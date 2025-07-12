/**
 * Language detector using highlight.js
 * Automatically detects programming language from code content
 */

import hljs from "highlight.js";

// Language display names with emojis
const LANGUAGE_DISPLAY_NAMES: { [key: string]: string } = {
  javascript: "🟨 JavaScript",
  typescript: "🔷 TypeScript",
  python: "🐍 Python",
  java: "☕ Java",
  cpp: "🔵 C++",
  c: "🔵 C",
  csharp: "🟦 C#",
  php: "🐘 PHP",
  ruby: "💎 Ruby",
  go: "🐹 Go",
  rust: "🦀 Rust",
  swift: "🍎 Swift",
  kotlin: "🅺 Kotlin",
  scala: "🎼 Scala",
  html: "🌐 HTML",
  css: "🎨 CSS",
  scss: "🎨 SCSS",
  less: "🎨 LESS",
  sql: "🗄️ SQL",
  json: "📋 JSON",
  xml: "📄 XML",
  yaml: "⚙️ YAML",
  bash: "🐚 Bash",
  shell: "🐚 Shell",
  powershell: "🔷 PowerShell",
  dockerfile: "🐳 Dockerfile",
  markdown: "📝 Markdown",
  plaintext: "📄 Text",
  text: "📄 Text",
};

/**
 * Detects the programming language of the given code
 * @param code - The code content to analyze
 * @returns Object with language name and display name
 */
export const detectLanguage = (
  code: string
): { language: string; displayName: string } => {
  if (!code || code.trim().length === 0) {
    return { language: "text", displayName: "📄 Text" };
  }

  try {
    // Use highlight.js to detect language
    const result = hljs.highlightAuto(code);

    // Get the detected language
    const detectedLanguage = result.language || "text";

    // Get display name or use the raw language name
    const displayName =
      LANGUAGE_DISPLAY_NAMES[detectedLanguage] || `🏷️ ${detectedLanguage}`;

    return {
      language: detectedLanguage,
      displayName: displayName,
    };
  } catch (error) {
    console.warn("Language detection failed:", error);
    return { language: "text", displayName: "📄 Text" };
  }
};

/**
 * Get just the language name (for syntax highlighting)
 * @param code - The code content to analyze
 * @returns Language name string
 */
export const getLanguageName = (code: string): string => {
  const result = detectLanguage(code);
  return result.language;
};

/**
 * Get the display name with emoji
 * @param code - The code content to analyze
 * @returns Display name string with emoji
 */
export const getLanguageDisplayName = (code: string): string => {
  const result = detectLanguage(code);
  return result.displayName;
};

/**
 * Get available languages that highlight.js supports
 * @returns Array of supported language names
 */
export const getSupportedLanguages = (): string[] => {
  return hljs.listLanguages();
};
