// Tree-sitter を使用した AST 解析

import * as TsParser from "tree-sitter-typescript";
import * as JsParser from "tree-sitter-javascript";
import * as PyParser from "tree-sitter-python";
import * as GoParser from "tree-sitter-go";
import Parser from "tree-sitter";
import type { ASTNode, ParserResult } from "@codestencil/shared/types";

export type SupportedLanguage = "typescript" | "javascript" | "python" | "go";

const LANGUAGE_PARSERS: Record<SupportedLanguage, typeof Parser> = {
  typescript: TsParser,
  javascript: JsParser,
  python: PyParser,
  go: GoParser,
};

export function detectLanguage(filename: string): SupportedLanguage | null {
  const ext = filename.split(".").pop()?.toLowerCase();

  const languageMap: Record<string, SupportedLanguage> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    go: "go",
  };

  return ext && ext in languageMap ? languageMap[ext] : null;
}

export function parseCode(
  code: string,
  language: SupportedLanguage,
): ParserResult {
  try {
    const ParserClass = LANGUAGE_PARSERS[language];
    const parser = new ParserClass();

    const tree = parser.parse(code);

    return {
      success: true,
      ast: convertTreeToAST(tree.rootNode),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function convertTreeToAST(node: Parser.SyntaxNode): ASTNode {
  const astNode: ASTNode = {
    type: node.type,
  };

  if (node.childCount > 0) {
    astNode.children = [];
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        astNode.children.push(convertTreeToAST(child));
      }
    }
  }

  if (node.namedChildCount > 0) {
    for (let i = 0; i < node.namedChildCount; i++) {
      const child = node.namedChild(i);
      if (child) {
        const fieldName = node.fieldsForNode(child)[0];
        if (fieldName) {
          astNode[fieldName] = convertTreeToAST(child);
        }
      }
    }
  }

  return astNode;
}

export function extractImports(ast: ASTNode): string[] {
  const imports: string[] = [];

  function traverse(node: ASTNode) {
    if (node.type === "import_statement" || node.type === "import_declaration") {
      // import 文からパスを抽出
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "string" || child.type === "string_fragment") {
            // 文字列から引用符を除去
            const match = JSON.stringify(child).match(/"([^"]+)"/);
            if (match) {
              imports.push(match[1]);
            }
          }
        }
      }
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(ast);
  return imports;
}

export function extractExports(ast: ASTNode): string[] {
  const exports: string[] = [];

  function traverse(node: ASTNode) {
    if (node.type === "export_statement" || node.type === "export_declaration") {
      // export 文から名前を抽出
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "identifier") {
            exports.push(JSON.stringify(child).replace(/"/g, ""));
          }
        }
      }
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(ast);
  return exports;
}
