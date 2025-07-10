/**
 * Language detection utility for CodeBoard
 *
 * This utility detects programming languages from code content by analyzing
 * patterns, keywords, and syntax elements in the code.
 */

interface LanguagePattern {
  name: string;
  patterns: RegExp[];
  exclusions?: RegExp[];
  priority: number;
}

// Language detection patterns ordered by specificity
const languagePatterns: LanguagePattern[] = [
  // Fortran - Very specific patterns
  {
    name: "Fortran",
    patterns: [
      /program\s+\w+/i,
      /subroutine\s+\w+/i,
      /implicit none/i,
      /end program/i,
      /end subroutine/i,
      /integer\s*::/i,
      /real\s*::/i,
      /character\s*::/i,
      /write\(\*,\*\)/i,
      /read\(\*,\*\)/i,
      /\bdo\s+\d+/i,
      /\bcontinue\b/i,
      /format\(/i,
    ],
    priority: 10,
  },

  // Rust - Specific patterns
  {
    name: "Rust",
    patterns: [
      /fn\s+\w+\s*\(/i,
      /let\s+mut\s+\w+/i,
      /impl\s+\w+/i,
      /use\s+std::/i,
      /pub\s+struct/i,
      /pub\s+enum/i,
      /#!\[.+\]/i,
    ],
    priority: 9,
  },

  // Go - Specific patterns
  {
    name: "Go",
    patterns: [
      /func\s+\w+\s*\(/i,
      /package\s+main/i,
      /import\s+\(/i,
      /import\s+"[^"]+"/i,
      /type\s+\w+\s+struct/i,
    ],
    priority: 9,
  },

  // Java - Very specific
  {
    name: "Java",
    patterns: [
      /public\s+class/i,
      /class\s+\w+\s+extends/i,
      /class\s+\w+\s+implements/i,
      /public\s+static\s+void\s+main/i,
      /System\.out\.println/i,
      /import\s+java\./i,
    ],
    priority: 9,
  },

  // Kotlin - Specific patterns
  {
    name: "Kotlin",
    patterns: [
      /fun\s+\w+/i,
      /val\s+\w+:/i,
      /var\s+\w+:/i,
      /suspend\s+fun/i,
      /companion\s+object/i,
      /data\s+class/i,
    ],
    priority: 8,
  },

  // Swift - Specific patterns
  {
    name: "Swift",
    patterns: [
      /import\s+Foundation/i,
      /func\s+\w+\(\)/i,
      /var\s+\w+\s*:\s*\w+/i,
      /let\s+\w+\s*:\s*\w+/i,
      /class\s+\w+\s*:\s*\w+/i,
      /struct\s+\w+/i,
    ],
    priority: 8,
  },

  // Python - Relatively specific
  {
    name: "Python",
    patterns: [
      /def\s+\w+\s*\(/i,
      /from\s+\w+\s+import/i,
      /import\s+\w+/i,
      /if\s+__name__\s*==\s*["']__main__["']/i,
      /print\s*\(/i,
      /elif\s+/i,
      /^\s*#.*python/im,
    ],
    exclusions: [
      /public\s+class/i, // Avoid Java mismatches
    ],
    priority: 7,
  },

  // C++ - More specific than C
  {
    name: "C++",
    patterns: [
      /#include\s*<iostream>/i,
      /#include\s*<vector>/i,
      /std::/i,
      /cout\s*<</i,
      /cin\s*>>/i,
      /namespace\s+\w+/i,
      /template\s*</i,
      /class\s+\w+\s*{/i,
    ],
    priority: 7,
  },

  // C - Less specific than C++
  {
    name: "C",
    patterns: [
      /#include\s*<stdio\.h>/i,
      /#include\s*<stdlib\.h>/i,
      /printf\s*\(/i,
      /scanf\s*\(/i,
      /malloc\s*\(/i,
      /void\s+\w+\s*\(/i,
    ],
    exclusions: [
      /std::/i, // Avoid C++ matches
      /class\s+\w+/i,
      /template/i,
    ],
    priority: 6,
  },

  // SQL - Specific keywords
  {
    name: "SQL",
    patterns: [
      /SELECT\s+.+\s+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+\w+\s+SET/i,
      /DELETE\s+FROM/i,
      /CREATE\s+TABLE/i,
      /ALTER\s+TABLE/i,
      /DROP\s+TABLE/i,
      /JOIN\s+\w+\s+ON/i,
      /GROUP\s+BY/i,
      /ORDER\s+BY/i,
    ],
    priority: 7,
  },

  // HTML - Tag-based patterns
  {
    name: "HTML",
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /<html[>\s]/i,
      /<head[>\s]/i,
      /<body[>\s]/i,
      /<div[>\s]/i,
      /<script[>\s]/i,
      /<a\s+href/i,
    ],
    priority: 5,
  },

  // CSS - Style properties
  {
    name: "CSS",
    patterns: [
      /\w+\s*{\s*[\w-]+\s*:/i,
      /\@media/i,
      /\@keyframes/i,
      /\@import/i,
      /margin\s*:/i,
      /padding\s*:/i,
      /font-family\s*:/i,
      /background-color\s*:/i,
    ],
    exclusions: [
      /<html/i, // Avoid HTML matches
    ],
    priority: 5,
  },

  // TypeScript - Type-based patterns
  {
    name: "TypeScript",
    patterns: [
      /interface\s+\w+\s*{/i,
      /type\s+\w+\s*=\s*{/i,
      /type\s+\w+\s*=/i,
      /:\s*string\b/i,
      /:\s*number\b/i,
      /:\s*boolean\b/i,
      /as\s+const\b/i,
      /readonly\s+/i,
    ],
    priority: 6,
  },

  // React - JSX syntax
  {
    name: "React",
    patterns: [
      /import\s+.*\s+from\s+['"]react['"]/i,
      /React\.useState/i,
      /React\.useEffect/i,
      /useEffect\(/i,
      /useState\(/i,
      /<\w+\s+.*\/>/i, // Self-closing component
      /className\s*=/i,
      /onClick\s*=\s*{/i,
    ],
    priority: 7,
  },

  // JavaScript - General JS patterns (lower priority than TS/React)
  {
    name: "JavaScript",
    patterns: [
      /function\s+\w+\s*\(/i,
      /const\s+\w+\s*=/i,
      /let\s+\w+\s*=/i,
      /var\s+\w+\s*=/i,
      /=>\s*{/i,
      /console\.log\(/i,
      /document\.getElementById/i,
      /window\./i,
    ],
    priority: 4,
  },

  // JSON - Structure detection
  {
    name: "JSON",
    patterns: [/^\s*{\s*"\w+"\s*:/i, /^\s*\[\s*{\s*"\w+"\s*:/i],
    priority: 3,
  },

  // Shell/Bash - Script patterns
  {
    name: "Shell",
    patterns: [
      /^\s*#!/i,
      /\becho\s+["']/i,
      /export\s+\w+=/i,
      /\$\(\w+\)/i,
      /if\s+\[\s+.*\s+\]\s*;/i,
    ],
    priority: 5,
  },
];

/**
 * Detects the programming language from code content
 *
 * @param content - The code content to analyze
 * @returns The detected language name or "Text" if no match
 */
export function detectLanguage(content: string): string {
  if (!content || content.trim() === "") {
    return "Text";
  }

  // First check for explicit language in markdown code blocks
  const markdownMatch = content.match(/```(\w+)/);
  if (markdownMatch && markdownMatch[1]) {
    const lang = markdownMatch[1].toLowerCase();
    // Map common language shorthands to full names
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      py: "Python",
      rb: "Ruby",
      php: "PHP",
      cs: "C#",
      cpp: "C++",
      c: "C",
      go: "Go",
      rs: "Rust",
      java: "Java",
      kt: "Kotlin",
      swift: "Swift",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      sql: "SQL",
      sh: "Shell",
      bash: "Bash",
      ps: "PowerShell",
      md: "Markdown",
      json: "JSON",
      yaml: "YAML",
      xml: "XML",
      fortran: "Fortran",
      f90: "Fortran",
      f: "Fortran",
    };

    return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  // Calculate match scores for each language
  const scores = languagePatterns.map((lang) => {
    let score = 0;

    // Count pattern matches
    for (const pattern of lang.patterns) {
      if (pattern.test(content)) {
        score += 1;
      }
    }

    // Apply exclusions (negative scoring)
    if (lang.exclusions) {
      for (const exclusion of lang.exclusions) {
        if (exclusion.test(content)) {
          score -= 2; // Strong negative signal
        }
      }
    }

    // Apply priority multiplier
    if (score > 0) {
      score *= lang.priority;
    }

    return { name: lang.name, score };
  });

  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);

  // Return top match if it has a positive score
  if (scores.length > 0 && scores[0].score > 0) {
    return scores[0].name;
  }

  // Generic fallback detection
  if (
    content.includes("{") ||
    content.includes("}") ||
    content.includes("(") ||
    content.includes(")") ||
    content.includes(";")
  ) {
    return "Code";
  }

  return "Text";
}
