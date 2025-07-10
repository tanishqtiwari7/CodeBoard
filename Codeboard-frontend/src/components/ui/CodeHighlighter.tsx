/**
 * CodeHighlighter Component
 *
 * Advanced code highlighting component with syntax highlighting,
 * line numbers, and copy functionality.
 */

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { spacing, borderRadius } from "../../theme/tokens";

// Define props interface
interface CodeHighlighterProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  lineNumbersStartAt?: number;
  highlight?: number[];
  copyable?: boolean;
  fileName?: string;
  maxHeight?: string;
  theme?: "light" | "dark";
  bordered?: boolean;
  style?: React.CSSProperties;
  className?: string;
  // Props from old CodeHighlighter for backwards compatibility
  showHeader?: boolean;
  onEdit?: () => void;
  tag?: string;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language = "text",
  showLineNumbers = true,
  lineNumbersStartAt = 1,
  highlight = [],
  copyable = true,
  fileName,
  maxHeight = "500px",
  theme = "dark",
  bordered = true,
  style = {},
  className = "",
  // Backwards compatibility props
  showHeader = false,
  onEdit,
  tag,
}) => {
  const [copied, setCopied] = useState(false);

  // Get proper language identifier
  const getLanguage = (lang: string): string => {
    // Map common language names to PrismJS supported names
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      rb: "ruby",
      java: "java",
      php: "php",
      cs: "csharp",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      json: "json",
      yml: "yaml",
      yaml: "yaml",
      xml: "xml",
      md: "markdown",
      sql: "sql",
      sh: "bash",
      bash: "bash",
      go: "go",
      rust: "rust",
      // Add more language mappings as needed
    };

    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Choose the theme based on the prop
  const codeStyle = theme === "light" ? vs : vscDarkPlus;

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: borderRadius.md,
    overflow: "hidden",
    border: bordered ? "1px solid var(--border)" : "none",
    ...style,
  };

  // Header styles (for file name and copy button)
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${spacing["2"]} ${spacing["4"]}`,
    backgroundColor:
      theme === "light" ? "var(--background-secondary)" : "var(--primary-dark)",
    borderBottom: bordered ? "1px solid var(--border)" : "none",
    color: theme === "light" ? "var(--text)" : "var(--text-light)",
    fontSize: "14px",
    fontWeight: 500,
  };

  // Copy button styles
  const copyButtonStyle: React.CSSProperties = {
    backgroundColor: copied
      ? "var(--success)"
      : theme === "light"
      ? "var(--background-tertiary)"
      : "#2d3748",
    color: copied
      ? "white"
      : theme === "light"
      ? "var(--text)"
      : "var(--text-light)",
    border: "none",
    borderRadius: borderRadius.md,
    padding: `${spacing["1"]} ${spacing["3"]}`,
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: spacing["2"],
  };

  // Define custom styles for the syntax highlighter
  const customHighlighterStyle = {
    ...codeStyle,
    'pre[class*="language-"]': {
      ...codeStyle['pre[class*="language-"]'],
      margin: 0,
      borderRadius: 0,
      maxHeight,
      overflow: "auto",
    },
  };

  return (
    <div style={containerStyle} className={`code-highlighter ${className}`}>
      {(fileName || copyable || (showHeader && tag)) && (
        <div style={headerStyle}>
          <div className="header-content">
            {fileName ? fileName : tag || ""}
            {showHeader && onEdit && (
              <button
                onClick={onEdit}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "8px",
                  color: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                <span style={{ marginRight: "4px" }}>Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            )}
          </div>
          {copyable && (
            <button onClick={handleCopy} style={copyButtonStyle}>
              <span style={{ fontSize: "14px" }}>{copied ? "✓" : "📋"}</span>
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      )}

      <SyntaxHighlighter
        language={getLanguage(language)}
        style={customHighlighterStyle}
        showLineNumbers={showLineNumbers}
        startingLineNumber={lineNumbersStartAt}
        wrapLines={highlight.length > 0}
        lineProps={(lineNumber: number) => ({
          style: {
            backgroundColor: highlight.includes(lineNumber)
              ? theme === "light"
                ? "rgba(255, 226, 143, 0.2)"
                : "rgba(255, 226, 143, 0.1)"
              : undefined,
            display: "block",
            width: "100%",
          },
        })}
        customStyle={{
          fontSize: "14px",
          padding: spacing["4"],
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeHighlighter;
