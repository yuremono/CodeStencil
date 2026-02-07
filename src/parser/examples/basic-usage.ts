/**
 * Parser Agent Basic Usage Example
 */

import { Parser, Language } from '../src';

// パーサーの初期化
const parser = new Parser();

// サンプルコード（TypeScript）
const sampleCode = `
import { ApiClient } from './api';
import type { User, Post } from './types';

interface UserService {
  getUser(id: string): Promise<User>;
  getPosts(userId: string): Promise<Post[]>;
}

class UserServiceImpl implements UserService {
  constructor(private api: ApiClient) {}

  async getUser(id: string): Promise<User> {
    return this.api.get(\`/users/\${id}\`);
  }

  async getPosts(userId: string): Promise<Post[]> {
    return this.api.get(\`/users/\${userId}/posts\`);
  }

  private logError(error: Error): void {
    console.error('[UserService]', error);
  }
}

export { UserServiceImpl as UserService };
`;

// コードをパース
console.log('=== Parser Agent Basic Usage ===\n');

const result = parser.parse(sampleCode, {
  language: Language.TypeScript,
});

console.log('📦 Declarations:');
for (const decl of result.declarations) {
  console.log(`  - ${decl.type}: ${decl.name}`);
}

console.log('\n📥 Imports:');
for (const imp of result.imports) {
  console.log(`  from "${imp.source}":`);
  for (const spec of imp.specifiers) {
    console.log(`    - ${spec.imported}${spec.imported !== spec.local ? ` as ${spec.local}` : ''}`);
  }
}

console.log('\n📤 Exports:');
for (const exp of result.exports) {
  console.log(`  export:`, exp.specifiers.map((s) => `${s.local} as ${s.exported}`).join(', '));
}

// 命名規則の分析
const naming = parser.analyzeNaming(result);
console.log('\n🎨 Naming Conventions:');
console.log(`  Variables:   ${naming.variables}`);
console.log(`  Functions:   ${naming.functions}`);
console.log(`  Classes:     ${naming.classes}`);
console.log(`  Interfaces:  ${naming.interfaces}`);
console.log(`  Constants:   ${naming.constants}`);

// エラーチェック
if (result.errors.length > 0) {
  console.log('\n⚠️ Errors:');
  for (const error of result.errors) {
    console.log(`  Line ${error.location.startLine}: ${error.message}`);
  }
} else {
  console.log('\n✅ No syntax errors');
}
