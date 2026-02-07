// Generator Agent - Prompt Templates

export interface PromptContext {
  language: string
  description: string
  context?: string
  codeStyle?: {
    indentStyle?: string
    indentSize?: number
    semi?: boolean
    singleQuote?: boolean
    trailingComma?: boolean
  }
}

export class PromptBuilder {
  /**
   * Build system prompt for code generation
   */
  static buildSystemPrompt(context: PromptContext): string {
    return `You are an expert code generation assistant specializing in ${context.language}.

Your task is to generate production-ready code templates based on user requirements.

**Code Style Requirements**:
${this.buildCodeStyleSection(context.codeStyle)}

**Output Format**:
Return your response as a JSON object with the following structure:
{
  "name": "Template name (e.g., 'React useFetch Hook')",
  "description": "Brief description of what this template does",
  "files": [
    {
      "path": "file/path.ext",
      "content": "file content with proper imports and exports"
    }
  ],
  "placeholders": [
    {
      "name": "placeholderName",
      "type": "string|boolean|number|select",
      "default": "default value",
      "required": true,
      "options": ["option1", "option2"], // for select type only
      "description": "What this placeholder is for"
    }
  ]
}

**Guidelines**:
- Generate clean, well-commented code
- Follow modern best practices for ${context.language}
- Include proper error handling
- Add TypeScript types if applicable
- Make code reusable and maintainable
- Use meaningful variable and function names
- Include JSDoc/TSDoc comments where appropriate`
  }

  /**
   * Build user prompt for code generation
   */
  static buildUserPrompt(context: PromptContext, retrievedPatterns?: string[]): string {
    let prompt = `Generate a ${context.language} code template for: ${context.description}\n\n`

    if (context.context) {
      prompt += `**Additional Context**:\n${context.context}\n\n`
    }

    if (retrievedPatterns && retrievedPatterns.length > 0) {
      prompt += `**Reference Patterns** (for inspiration, not to copy directly):\n`
      retrievedPatterns.forEach((pattern, i) => {
        prompt += `\nPattern ${i + 1}:\n${pattern}\n`
      })
      prompt += '\nUse these patterns as inspiration but adapt the code to fit the specific request.\n\n'
    }

    prompt += `Please generate the template following the output format specified in the system prompt.`

    return prompt
  }

  /**
   * Build code style section
   */
  private static buildCodeStyleSection(codeStyle?: PromptContext['codeStyle']): string {
    if (!codeStyle) {
      return '- Use standard conventions for the language'
    }

    const rules: string[] = []

    if (codeStyle.indentStyle === 'tabs') {
      rules.push('- Use tabs for indentation')
    } else if (codeStyle.indentSize) {
      rules.push(`- Use ${codeStyle.indentSize} spaces for indentation`)
    }

    if (codeStyle.semi !== undefined) {
      rules.push(`- ${codeStyle.semi ? 'Use' : 'Omit'} semicolons`)
    }

    if (codeStyle.singleQuote !== undefined) {
      rules.push(`- Use ${codeStyle.singleQuote ? 'single' : 'double'} quotes`)
    }

    if (codeStyle.trailingComma) {
      rules.push('- Use trailing commas where applicable')
    }

    return rules.join('\n') || '- Use standard conventions for the language'
  }

  /**
   * Build prompt for code improvement/refinement
   */
  static buildRefinementPrompt(
    originalCode: string,
    feedback: string,
    language: string
  ): string {
    return `Please refine the following ${language} code based on the feedback:

**Original Code**:
\`\`\`${language}
${originalCode}
\`\`\`

**Feedback**:
${feedback}

Please provide the improved version of the code that addresses the feedback while maintaining the same functionality.`
  }

  /**
   * Build prompt for placeholder extraction
   */
  static buildPlaceholderExtractionPrompt(code: string, language: string): string {
    return `Analyze the following ${language} code and identify placeholders (variable parts that users might want to customize).

**Code**:
\`\`\`${language}
${code}
\`\`\`

Identify:
1. Variable names that should be customizable
2. Default values that might vary
3. Configuration options
4. Any other user-definable elements

Return your response as a JSON array of placeholder objects:
[
  {
    "name": "placeholderName",
    "type": "string|boolean|number|select",
    "default": "detected default value",
    "required": true/false,
    "options": ["option1", "option2"], // for select type only
    "description": "What this placeholder controls"
  }
]`
  }

  /**
   * Build prompt for test generation
   */
  static buildTestGenerationPrompt(
    templateCode: string,
    language: string
  ): string {
    return `Generate unit tests for the following ${language} code:

\`\`\`${language}
${templateCode}
\`\`\`

Generate comprehensive tests that cover:
1. Happy path / normal usage
2. Edge cases and boundary conditions
3. Error handling
4. Common failure scenarios

Use the appropriate testing framework for ${language} (e.g., Jest for TypeScript/JavaScript, pytest for Python).`
  }
}

/**
 * Pre-defined system prompts for different use cases
 */
export const SystemPrompts = {
  /**
   * React component generation
   */
  reactComponent: `You are a React component expert specializing in TypeScript and modern React patterns.

**Requirements**:
- Use functional components with hooks
- Define proper TypeScript interfaces for props
- Handle loading and error states appropriately
- Include accessibility attributes
- Follow React best practices (no prop drilling, proper memoization, etc.)
- Use Tailwind CSS for styling if applicable`,

  /**
   * API route generation
   */
  apiRoute: `You are an API design expert specializing in RESTful endpoints.

**Requirements**:
- Implement proper HTTP methods (GET, POST, PUT, DELETE)
- Include request validation
- Return appropriate status codes
- Handle errors consistently
- Include API documentation in comments
- Follow REST conventions`,

  /**
   * Database model generation
   */
  databaseModel: `You are a database design expert.

**Requirements**:
- Follow normalization principles
- Define proper indexes
- Include foreign key relationships
- Add constraints and validations
- Provide migration-friendly schema
- Include JSDoc comments for each field`,

  /**
   * Hook generation
   */
  customHook: `You are a React hooks expert.

**Requirements**:
- Follow hooks naming convention (use*)
- Include proper cleanup in useEffect
- Handle loading and error states
- Return consistent tuple or object
- Include TypeScript types
- Document hook usage and parameters`,
} as const
