/**
 * Tree-sitter based AST Parser
 */

import * as treeSitter from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';
import JavaScript from 'tree-sitter-javascript';
import Python from 'tree-sitter-python';
import Go from 'tree-sitter-go';
import type {
  Language,
  ParseResult,
  ParserOptions,
  SourceLocation,
  ASTNode,
  ImportDeclaration,
  ExportDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableDeclaration,
  CallExpression,
  ParseError,
  Declaration,
  NamingPattern,
  NamingConvention,
} from './types.js';

/**
 * Parserクラス
 */
export class Parser {
  private parsers: Map<Language, treeSitter.Language>;
  private treeSitter: typeof treeSitter;

  constructor() {
    this.treeSitter = treeSitter;
    this.parsers = new Map();

    // 言語パーサーの初期化
    this.parsers.set(Language.TypeScript, TypeScript.typescript());
    this.parsers.set(Language.JavaScript, JavaScript.javascript());
    this.parsers.set(Language.Python, Python.python());
    this.parsers.set(Language.Go, Go.go());

    // Rust, Java は必要に応じて追加
    // this.parsers.set(Language.Rust, Rust.rust());
    // this.parsers.set(Language.Java, Java.java());
  }

  /**
   * ソースコードをパースする
   */
  parse(sourceCode: string, options: ParserOptions): ParseResult {
    const language = options.language;
    const lang = this.parsers.get(language);

    if (!lang) {
      return {
        language,
        declarations: [],
        imports: [],
        exports: [],
        calls: [],
        errors: [{
          message: `Unsupported language: ${language}`,
          location: { startLine: 1, startColumn: 0, endLine: 1, endColumn: 0 },
        }],
      };
    }

    const parser = new this.treeSitter.Parser();
    parser.setLanguage(lang);

    const tree = parser.parse(sourceCode);
    const root = tree.rootNode;

    const result: ParseResult = {
      language,
      declarations: [],
      imports: [],
      exports: [],
      calls: [],
      errors: [],
    };

    // エラー収集
    this.collectErrors(root, result.errors);

    // ノード抽出
    this.extractNodes(root, sourceCode, result);

    return result;
  }

  /**
   * パースエラーを収集する
   */
  private collectErrors(rootNode: treeSitter.SyntaxNode, errors: ParseError[]): void {
    if (rootNode.hasError()) {
      const visit = (node: treeSitter.SyntaxNode) => {
        if (node.isError()) {
          errors.push({
            message: 'Syntax error',
            location: this.toSourceLocation(node),
          });
        }

        for (const child of node.children) {
          visit(child);
        }
      };

      visit(rootNode);
    }
  }

  /**
   * ノードを抽出する
   */
  private extractNodes(
    rootNode: treeSitter.SyntaxNode,
    sourceCode: string,
    result: ParseResult
  ): void {
    const visit = (node: treeSitter.SyntaxNode) => {
      const type = node.type;

      switch (type) {
        case 'import_statement':
        case 'import_alias':
        case 'import_require':
          const importDecl = this.parseImport(node, sourceCode);
          if (importDecl) result.imports.push(importDecl);
          break;

        case 'export_statement':
        case 'export_alias':
          const exportDecl = this.parseExport(node, sourceCode);
          if (exportDecl) result.exports.push(exportDecl);
          break;

        case 'function_declaration':
        case 'function_definition':
        case 'method_definition':
          const funcDecl = this.parseFunction(node, sourceCode);
          if (funcDecl) result.declarations.push(funcDecl);
          break;

        case 'arrow_function':
        case 'function_expression':
          // Arrow function は通常トップレベルで宣言されないため、必要に応じて処理
          break;

        case 'class_declaration':
        case 'class_definition':
          const classDecl = this.parseClass(node, sourceCode);
          if (classDecl) result.declarations.push(classDecl);
          break;

        case 'interface_declaration':
          const interfaceDecl = this.parseInterface(node, sourceCode);
          if (interfaceDecl) result.declarations.push(interfaceDecl);
          break;

        case 'type_alias_declaration':
          const typeAlias = this.parseTypeAlias(node, sourceCode);
          if (typeAlias) result.declarations.push(typeAlias);
          break;

        case 'variable_declaration':
        case 'lexical_declaration':
        case 'const_declaration':
          const varDecl = this.parseVariable(node, sourceCode);
          if (varDecl) result.declarations.push(varDecl);
          break;

        case 'call_expression':
          const call = this.parseCall(node, sourceCode);
          if (call) result.calls.push(call);
          break;
      }

      for (const child of node.children) {
        visit(child);
      }
    };

    visit(rootNode);
  }

  /**
   * インポート宣言をパースする
   */
  private parseImport(node: treeSitter.SyntaxNode, sourceCode: string): ImportDeclaration | null {
    const location = this.toSourceLocation(node);

    // インポート元パスの抽出
    let source = '';
    const stringNode = node.descendantsOfType('string');
    if (stringNode.length > 0) {
      source = sourceCode.slice(
        stringNode[0].startIndex + 1,
        stringNode[0].endIndex - 1
      );
    }

    const specifiers = this.parseImportSpecifiers(node, sourceCode);

    return {
      type: 'import_statement' as any,
      location,
      source,
      specifiers,
    };
  }

  /**
   * インポートSpecifierをパースする
   */
  private parseImportSpecifiers(
    node: treeSitter.SyntaxNode,
    sourceCode: string
  ): Array<{ imported: string; local: string; isDefault: boolean; isType: boolean }> {
    const specifiers: Array<{
      imported: string;
      local: string;
      isDefault: boolean;
      isType: boolean;
    }> = [];

    // import_clause 配下を探索
    const clauses = node.childrenByFieldName('name') || node.children;

    for (const child of clauses) {
      if (child.type === 'identifier') {
        const name = sourceCode.slice(child.startIndex, child.endIndex);
        specifiers.push({
          imported: name,
          local: name,
          isDefault: true,
          isType: false,
        });
      }

      if (child.type === 'import_clause') {
        for (const grandchild of child.children) {
          if (grandchild.type === 'identifier') {
            const name = sourceCode.slice(grandchild.startIndex, grandchild.endIndex);
            specifiers.push({
              imported: name,
              local: name,
              isDefault: true,
              isType: false,
            });
          }

          if (grandchild.type === 'named_imports') {
            // import { a, b as c } from ...
            const identifiers = grandchild.descendantsOfType('identifier');
            for (let i = 0; i < identifiers.length; i += 2) {
              const imported = sourceCode.slice(
                identifiers[i].startIndex,
                identifiers[i].endIndex
              );
              const local =
                identifiers[i + 1] &&
                identifiers[i + 1].parent?.type === 'import_rename'
                  ? sourceCode.slice(
                      identifiers[i + 1].startIndex,
                      identifiers[i + 1].endIndex
                    )
                  : imported;

              specifiers.push({
                imported,
                local,
                isDefault: false,
                isType: false,
              });
            }
          }
        }
      }
    }

    return specifiers;
  }

  /**
   * エクスポート宣言をパースする
   */
  private parseExport(node: treeSitter.SyntaxNode, sourceCode: string): ExportDeclaration | null {
    const location = this.toSourceLocation(node);

    // export from の場合のsource
    let source: string | undefined;
    const stringNode = node.descendantsOfType('string');
    if (stringNode.length > 0) {
      source = sourceCode.slice(
        stringNode[0].startIndex + 1,
        stringNode[0].endIndex - 1
      );
    }

    // エクスポートするシンボル
    const specifiers: Array<{ local: string; exported: string }> = [];

    const identifiers = node.descendantsOfType('identifier');
    for (let i = 0; i < identifiers.length; i++) {
      const local = sourceCode.slice(
        identifiers[i].startIndex,
        identifiers[i].endIndex
      );
      // export { a as b } の場合
      const exported =
        identifiers[i + 1] &&
        identifiers[i + 1].parent?.type === 'export_rename'
          ? sourceCode.slice(
              identifiers[i + 1].startIndex,
              identifiers[i + 1].endIndex
            )
          : local;

      specifiers.push({ local, exported });
    }

    return {
      type: 'export_statement' as any,
      location,
      specifiers,
      source,
    };
  }

  /**
   * 関数宣言をパースする
   */
  private parseFunction(node: treeSitter.SyntaxNode, sourceCode: string): FunctionDeclaration | null {
    const location = this.toSourceLocation(node);

    // 関数名
    const nameNode = node.childByFieldName('name');
    const name = nameNode
      ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
      : '(anonymous)';

    // パラメータ
    const parameters = this.parseParameters(node, sourceCode);

    // async/修飾子
    const isAsync = node.children.some(
      (c) => c.type === 'async' || c.text === 'async'
    );
    const isGenerator = node.children.some(
      (c) => c.type === '*' || c.text === '*'
    );

    // 戻り値の型 (TypeScript)
    let returnType: string | undefined;
    const typeNode = node.childByFieldName('return_type');
    if (typeNode) {
      returnType = sourceCode.slice(typeNode.startIndex, typeNode.endIndex);
    }

    return {
      type: 'function_declaration' as any,
      location,
      name,
      parameters,
      returnType,
      isAsync,
      isGenerator,
    };
  }

  /**
   * パラメータをパースする
   */
  private parseParameters(
    node: treeSitter.SyntaxNode,
    sourceCode: string
  ): Array<{ name: string; type?: string; defaultValue?: string }> {
    const parameters: Array<{ name: string; type?: string; defaultValue?: string }> = [];

    const paramsNode = node.childByFieldName('parameters');
    if (!paramsNode) return parameters;

    for (const child of paramsNode.children) {
      if (
        child.type === 'identifier' ||
        child.type === 'required_parameter' ||
        child.type === 'optional_parameter'
      ) {
        const nameNode = child.childByFieldName('name') || child.children.find((c) => c.type === 'identifier');
        const name = nameNode
          ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
          : '';

        // 型
        let type: string | undefined;
        const typeNode = child.childByFieldName('type');
        if (typeNode) {
          type = sourceCode.slice(typeNode.startIndex, typeNode.endIndex);
        }

        // デフォルト値
        let defaultValue: string | undefined;
        const valueNode = child.childByFieldName('value');
        if (valueNode) {
          defaultValue = sourceCode.slice(valueNode.startIndex, valueNode.endIndex);
        }

        parameters.push({ name, type, defaultValue });
      }

      // Rest parameter
      if (child.type === 'rest_parameter') {
        const nameNode = child.childByFieldName('name') || child.children.find((c) => c.type === 'identifier');
        const name = nameNode
          ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
          : '';

        let type: string | undefined;
        const typeNode = child.childByFieldName('type');
        if (typeNode) {
          type = sourceCode.slice(typeNode.startIndex, typeNode.endIndex);
        }

        parameters.push({ name: `...${name}`, type });
      }
    }

    return parameters;
  }

  /**
   * クラス宣言をパースする
   */
  private parseClass(node: treeSitter.SyntaxNode, sourceCode: string): ClassDeclaration | null {
    const location = this.toSourceLocation(node);

    // クラス名
    const nameNode = node.childByFieldName('name');
    const name = nameNode
      ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
      : '(anonymous)';

    // 継承
    let extendsClause: string | undefined;
    const heritageNode = node.childByFieldName('heritage');
    if (heritageNode) {
      extendsClause = sourceCode.slice(heritageNode.startIndex, heritageNode.endIndex);
    }

    // メンバ
    const members: ClassDeclaration['members'] = [];
    const bodyNode = node.childByFieldName('body');
    if (bodyNode) {
      for (const child of bodyNode.children) {
        if (child.type === 'property_declaration' || child.type === 'method_definition') {
          const nameNode = child.childByFieldName('name');
          const memberName = nameNode
            ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
            : '';

          // アクセシビリティ
          let accessibility: 'public' | 'private' | 'protected' = 'public';
          const modifier = child.children.find((c) =>
            ['public', 'private', 'protected'].includes(c.type)
          );
          if (modifier) {
            accessibility = modifier.type as 'public' | 'private' | 'protected';
          }

          // static
          const isStatic = child.children.some((c) => c.type === 'static');

          members.push({
            kind: child.type === 'method_definition' ? 'method' : 'property',
            name: memberName,
            accessibility,
            isStatic,
          });
        }
      }
    }

    return {
      type: 'class_declaration' as any,
      location,
      name,
      extends: extendsClause,
      members,
    };
  }

  /**
   * インターフェース宣言をパースする (TypeScript)
   */
  private parseInterface(node: treeSitter.SyntaxNode, sourceCode: string): InterfaceDeclaration | null {
    const location = this.toSourceLocation(node);

    // インターフェース名
    const nameNode = node.childByFieldName('name');
    const name = nameNode
      ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
      : '';

    // 拡張
    const extendsClause: string[] = [];
    const extendsNode = node.childByFieldName('extends');
    if (extendsNode) {
      for (const child of extendsNode.children) {
        if (child.type === 'type_identifier') {
          extendsClause.push(sourceCode.slice(child.startIndex, child.endIndex));
        }
      }
    }

    // メンバ
    const members: InterfaceDeclaration['members'] = [];
    const bodyNode = node.childByFieldName('body');
    if (bodyNode) {
      for (const child of bodyNode.children) {
        if (child.type === 'property_signature' || child.type === 'method_signature') {
          const nameNode = child.childByFieldName('name');
          const memberName = nameNode
            ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
            : '';

          // 型
          let type = '';
          const typeNode = child.childByFieldName('type');
          if (typeNode) {
            type = sourceCode.slice(typeNode.startIndex, typeNode.endIndex);
          }

          // オプション
          const isOptional = child.children.some((c) => c.type === '?');

          members.push({
            kind: child.type === 'method_signature' ? 'method' : 'property',
            name: memberName,
            type,
            isOptional,
          });
        }
      }
    }

    return {
      type: 'interface_declaration' as any,
      location,
      name,
      extends: extendsClause,
      members,
    };
  }

  /**
   * 型エイリアス宣言をパースする (TypeScript)
   */
  private parseTypeAlias(node: treeSitter.SyntaxNode, sourceCode: string): TypeAliasDeclaration | null {
    const location = this.toSourceLocation(node);

    // 名前
    const nameNode = node.childByFieldName('name');
    const name = nameNode
      ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
      : '';

    // 型パラメータ
    const typeParamsNode = node.childByFieldName('type_parameters');
    const typeParameters: string[] = [];
    if (typeParamsNode) {
      for (const child of typeParamsNode.children) {
        if (child.type === 'type_identifier') {
          typeParameters.push(sourceCode.slice(child.startIndex, child.endIndex));
        }
      }
    }

    // 型定義
    const valueNode = node.childByFieldName('value');
    const definition = valueNode
      ? sourceCode.slice(valueNode.startIndex, valueNode.endIndex)
      : '';

    return {
      type: 'type_alias_declaration' as any,
      location,
      name,
      typeParameters,
      definition,
    };
  }

  /**
   * 変数宣言をパースする
   */
  private parseVariable(node: treeSitter.SyntaxNode, sourceCode: string): VariableDeclaration | null {
    const location = this.toSourceLocation(node);

    let kind: 'const' | 'let' | 'var' = 'const';
    for (const child of node.children) {
      if (child.type === 'const' || child.type === 'let' || child.type === 'var') {
        kind = child.type;
        break;
      }
    }

    const declarators = node.childrenByFieldName('declarator') || node.children;

    // 最初の宣言のみ抽出
    for (const declarator of declarators) {
      if (declarator.type === 'variable_declarator') {
        const nameNode = declarator.childByFieldName('name');
        const name = nameNode
          ? sourceCode.slice(nameNode.startIndex, nameNode.endIndex)
          : '';

        // 型
        let declaredType: string | undefined;
        const typeNode = declarator.childByFieldName('type');
        if (typeNode) {
          declaredType = sourceCode.slice(typeNode.startIndex, typeNode.endIndex);
        }

        // 初期値
        let initializer: string | undefined;
        const valueNode = declarator.childByFieldName('value');
        if (valueNode) {
          initializer = sourceCode.slice(valueNode.startIndex, valueNode.endIndex);
        }

        return {
          type: 'variable_declaration' as any,
          location,
          name,
          declaredType,
          initializer,
          kind,
        };
      }
    }

    return null;
  }

  /**
   * 呼び出し式をパースする
   */
  private parseCall(node: treeSitter.SyntaxNode, sourceCode: string): CallExpression | null {
    const location = this.toSourceLocation(node);

    // 関数名
    const funcNode = node.childByFieldName('function');
    if (!funcNode) return null;

    const callee = sourceCode.slice(funcNode.startIndex, funcNode.endIndex);

    // 引数
    const argumentsArray: string[] = [];
    const argsNode = node.childByFieldName('arguments');
    if (argsNode) {
      for (const child of argsNode.children) {
        if (child.type === 'identifier' || child.type === 'string' || child.type === 'number') {
          argumentsArray.push(sourceCode.slice(child.startIndex, child.endIndex));
        }
      }
    }

    return {
      type: 'call_expression' as any,
      location,
      callee,
      arguments: argumentsArray,
    };
  }

  /**
   * SyntaxNodeをSourceLocationに変換する
   */
  private toSourceLocation(node: treeSitter.SyntaxNode): SourceLocation {
    return {
      startLine: node.startPosition.row + 1,
      startColumn: node.startPosition.column,
      endLine: node.endPosition.row + 1,
      endColumn: node.endPosition.column,
    };
  }

  /**
   * プロジェクトの命名規則を分析する
   */
  analyzeNaming(result: ParseResult): NamingPattern {
    const pattern: NamingPattern = {
      variables: NamingConvention.unknown,
      functions: NamingConvention.unknown,
      classes: NamingConvention.unknown,
      interfaces: NamingConvention.unknown,
      constants: NamingConvention.unknown,
    };

    // 関数命名規則
    const funcNames = result.declarations
      .filter((d): d is FunctionDeclaration => d.type === 'function_declaration')
      .map((f) => f.name);

    if (funcNames.length > 0) {
      pattern.functions = this.detectNamingConvention(funcNames);
    }

    // クラス命名規則
    const classNames = result.declarations
      .filter((d): d is ClassDeclaration => d.type === 'class_declaration')
      .map((c) => c.name);

    if (classNames.length > 0) {
      pattern.classes = this.detectNamingConvention(classNames);
    }

    // インターフェース命名規則
    const interfaceNames = result.declarations
      .filter((d): d is InterfaceDeclaration => d.type === 'interface_declaration')
      .map((i) => i.name);

    if (interfaceNames.length > 0) {
      pattern.interfaces = this.detectNamingConvention(interfaceNames);
    }

    // 変数命名規則
    const varNames = result.declarations
      .filter((d): d is VariableDeclaration => d.type === 'variable_declaration')
      .map((v) => v.name);

    if (varNames.length > 0) {
      pattern.variables = this.detectNamingConvention(varNames);

      // 定数（SCREAMING_SNAKE_CASE）の検出
      const constants = varNames.filter((n) => /^[A-Z_]+$/.test(n));
      if (constants.length > varNames.length * 0.3) {
        pattern.constants = NamingConvention.SCREAMING_SNAKE_CASE;
      }
    }

    return pattern;
  }

  /**
   * 命名規約を検出する
   */
  private detectNamingConvention(names: string[]): NamingConvention {
    if (names.length === 0) return NamingConvention.unknown;

    let camelCase = 0;
    let PascalCase = 0;
    let snake_case = 0;
    let SCREAMING_SNAKE_CASE = 0;
    let kebab_case = 0;

    for (const name of names) {
      if (/^[a-z][a-zA-Z0-9]*$/.test(name)) camelCase++;
      if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) PascalCase++;
      if (/^[a-z][a-z0-9_]*$/.test(name)) snake_case++;
      if (/^[A-Z][A-Z0-9_]*$/.test(name)) SCREAMING_SNAKE_CASE++;
      if (/^[a-z][a-z0-9-]*$/.test(name)) kebab_case++;
    }

    const total = names.length;
    const threshold = total * 0.6;

    if (camelCase >= threshold) return NamingConvention.camelCase;
    if (PascalCase >= threshold) return NamingConvention.PascalCase;
    if (snake_case >= threshold) return NamingConvention.snake_case;
    if (SCREAMING_SNAKE_CASE >= threshold) return NamingConvention.SCREAMING_SNAKE_CASE;
    if (kebab_case >= threshold) return NamingConvention['kebab-case'];

    return NamingConvention.unknown;
  }
}

/**
 * デフォルトエクスポート
 */
export default Parser;
