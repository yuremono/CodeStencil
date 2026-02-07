/**
 * Parser Tests
 */

import { describe, it, expect } from 'vitest';
import { Parser, Language } from './parser.js';

describe('Parser', () => {
  const parser = new Parser();

  describe('TypeScript', () => {
    it('should parse function declarations', () => {
      const source = `
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

      const result = parser.parse(source, { language: Language.TypeScript });

      expect(result.declarations).toHaveLength(1);
      const func = result.declarations[0];
      expect(func.type).toBe('function_declaration');
      expect(func.name).toBe('greet');
      expect(func.parameters).toEqual([{ name: 'name', type: 'string' }]);
    });

    it('should parse class declarations', () => {
      const source = `
class UserService {
  constructor(private api: ApiClient) {}

  async getUser(id: string): Promise<User> {
    return this.api.get(\`/users/\${id}\`);
  }
}
`;

      const result = parser.parse(source, { language: Language.TypeScript });

      const classDecl = result.declarations.find((d) => d.type === 'class_declaration');
      expect(classDecl).toBeDefined();
      expect(classDecl?.name).toBe('UserService');
    });

    it('should parse interface declarations', () => {
      const source = `
interface User {
  id: string;
  name: string;
  email?: string;
}
`;

      const result = parser.parse(source, { language: Language.TypeScript });

      const interfaceDecl = result.declarations.find(
        (d) => d.type === 'interface_declaration'
      );
      expect(interfaceDecl).toBeDefined();
      expect(interfaceDecl?.name).toBe('User');
    });

    it('should parse import statements', () => {
      const source = `
import { useState, useEffect } from 'react';
import { ApiClient } from './api';
import type { User } from './types';
`;

      const result = parser.parse(source, { language: Language.TypeScript });

      expect(result.imports).toHaveLength(3);
      expect(result.imports[0].source).toBe('react');
      expect(result.imports[1].source).toBe('./api');
      expect(result.imports[2].source).toBe('./types');
    });

    it('should parse export statements', () => {
      const source = `
export { parse, analyze } from './parser';
export { default } from './main';
`;

      const result = parser.parse(source, { language: Language.TypeScript });

      expect(result.exports.length).toBeGreaterThan(0);
    });

    it('should detect naming conventions', () => {
      const source = `
function getUserData() {}
function createUser() {}
class UserService {}
interface IUserRepository {}
const MAX_RETRIES = 3;
`;

      const result = parser.parse(source, { language: Language.TypeScript });
      const naming = parser.analyzeNaming(result);

      expect(naming.functions).toBe('camelCase');
      expect(naming.classes).toBe('PascalCase');
      expect(naming.interfaces).toBe('PascalCase');
      expect(naming.constants).toBe('SCREAMING_SNAKE_CASE');
    });
  });

  describe('JavaScript', () => {
    it('should parse arrow functions', () => {
      const source = `
const greet = (name) => {
  return \`Hello, \${name}!\`;
};
`;

      const result = parser.parse(source, { language: Language.JavaScript });

      expect(result.declarations).toHaveLength(1);
      const varDecl = result.declarations[0];
      expect(varDecl.type).toBe('variable_declaration');
      expect(varDecl.name).toBe('greet');
    });
  });

  describe('Python', () => {
    it('should parse function definitions', () => {
      const source = `
def greet(name: str) -> str:
    return f"Hello, {name}!"
`;

      const result = parser.parse(source, { language: Language.Python });

      expect(result.declarations.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    it('should handle syntax errors gracefully', () => {
      const source = `
export function broken(
  // Missing closing parenthesis
{

`;

      const result = parser.parse(source, { language: Language.TypeScript });

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return error for unsupported language', () => {
      const result = parser.parse('some code', {
        language: 'rust' as Language,
      });

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Unsupported language');
    });
  });
});
