import { useState, useEffect } from "react";
import JSZip from "jszip";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  X,
  Download,
  Code,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

interface CodeViewerProps {
  url: string;
  fileName: string;
  onClose?: () => void;
  onDownload?: () => void;
  embedded?: boolean;
}

const extensionToLanguage: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  css: "css",
  scss: "css",
  html: "markup",
  htm: "markup",
  xml: "markup",
  svg: "markup",
  json: "json",
  py: "python",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  hpp: "cpp",
  cs: "csharp",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  txt: "plaintext",
};

const getLanguage = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return extensionToLanguage[ext] || "plaintext";
};

const isTextFile = (fileName: string): boolean => {
  const textExtensions = [
    "js", "jsx", "ts", "tsx", "css", "scss", "html", "htm", "xml", "svg",
    "json", "py", "java", "c", "h", "cpp", "hpp", "cs", "md", "yaml", "yml",
    "sql", "sh", "bash", "txt", "gitignore", "env", "config", "ini", "toml",
    "rs", "go", "rb", "php", "vue", "svelte", "astro", "lock",
  ];
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const baseName = fileName.toLowerCase();
  return textExtensions.includes(ext) || 
    ["readme", "license", "makefile", "dockerfile", "gitignore"].includes(baseName);
};

function buildFileTree(files: { path: string; content?: string }[]): FileNode[] {
  const root: FileNode[] = [];

  files.forEach(({ path, content }) => {
    const parts = path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existing = current.find((node) => node.name === part);

      if (existing) {
        if (!isFile && existing.children) {
          current = existing.children;
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
          content: isFile ? content : undefined,
        };
        current.push(newNode);
        if (!isFile && newNode.children) {
          current = newNode.children;
        }
      }
    });
  });

  // Sort: folders first, then files, both alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map((node) => ({
      ...node,
      children: node.children ? sortNodes(node.children) : undefined,
    }));
  };

  return sortNodes(root);
}

function FileTreeNode({
  node,
  depth = 0,
  selectedPath,
  onSelect,
  expandedFolders,
  onToggleFolder,
}: {
  node: FileNode;
  depth?: number;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (node.type === "folder") {
      onToggleFolder(node.path);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-accent rounded transition-colors text-left ${
          isSelected ? "bg-accent text-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CodeViewer({
  url,
  fileName,
  onClose,
  onDownload,
  embedded = false,
}: CodeViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadZipFile();
  }, [url]);

  const loadZipFile = async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, create mock file structure
      // In production, this would fetch and parse the actual ZIP file
      const mockFiles = [
        { path: "src/index.html", content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Project</title>\n  <link rel="stylesheet" href="styles/main.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script src="js/main.js"></script>\n</body>\n</html>' },
        { path: "src/js/main.js", content: 'import { initApp } from "./modules/app.js";\nimport { setupEventListeners } from "./modules/events.js";\n\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Application starting...");\n  initApp();\n  setupEventListeners();\n});\n\nexport function greet(name) {\n  return `Hello, ${name}!`;\n}' },
        { path: "src/js/modules/app.js", content: 'export function initApp() {\n  const app = document.getElementById("app");\n  app.innerHTML = `\n    <header>\n      <h1>Welcome to My Project</h1>\n    </header>\n    <main>\n      <p>This is the main content area.</p>\n    </main>\n  `;\n}' },
        { path: "src/js/modules/events.js", content: 'export function setupEventListeners() {\n  document.addEventListener("click", handleClick);\n  window.addEventListener("resize", handleResize);\n}\n\nfunction handleClick(event) {\n  console.log("Click:", event.target);\n}\n\nfunction handleResize() {\n  console.log("Window resized");\n}' },
        { path: "src/styles/main.css", content: ':root {\n  --primary-color: #3b82f6;\n  --text-color: #1f2937;\n  --bg-color: #ffffff;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  color: var(--text-color);\n  background: var(--bg-color);\n}\n\nheader {\n  padding: 2rem;\n  background: var(--primary-color);\n  color: white;\n}\n\nmain {\n  padding: 2rem;\n}' },
        { path: "src/styles/components.css", content: '.button {\n  padding: 0.5rem 1rem;\n  border-radius: 0.375rem;\n  font-weight: 500;\n  cursor: pointer;\n}\n\n.button-primary {\n  background: var(--primary-color);\n  color: white;\n  border: none;\n}\n\n.card {\n  padding: 1.5rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}' },
        { path: "README.md", content: '# Project Title\n\nA brief description of what this project does.\n\n## Installation\n\n```bash\nnpm install\nnpm start\n```\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## License\n\nMIT' },
        { path: "package.json", content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "description": "A sample project",\n  "main": "src/js/main.js",\n  "scripts": {\n    "start": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {},\n  "devDependencies": {\n    "vite": "^5.0.0"\n  }\n}' },
      ];

      const tree = buildFileTree(mockFiles);
      setFileTree(tree);

      // Auto-expand first level folders
      const firstLevelFolders = tree
        .filter((node) => node.type === "folder")
        .map((node) => node.path);
      setExpandedFolders(new Set(firstLevelFolders));

      // Auto-select README or first file
      const readmeFile = mockFiles.find((f) => f.path.toLowerCase().includes("readme"));
      if (readmeFile) {
        const findNode = (nodes: FileNode[]): FileNode | null => {
          for (const node of nodes) {
            if (node.path === readmeFile.path) return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        const node = findNode(tree);
        if (node) setSelectedFile(node);
      }
    } catch (err) {
      setError("Failed to load ZIP file");
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCopy = async () => {
    if (selectedFile?.content) {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getHighlightedCode = (content: string, language: string): string => {
    try {
      if (Prism.languages[language]) {
        return Prism.highlight(content, Prism.languages[language], language);
      }
      return content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    } catch {
      return content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : embedded
    ? "flex flex-col h-[500px]"
    : "flex flex-col h-[500px]";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {fileName}
          </span>
          {selectedFile && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground truncate">
                {selectedFile.path}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {selectedFile?.content && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              title="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {onDownload && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDownload}
              title="Download ZIP"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          {onClose && (
            <>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (isFullscreen) setIsFullscreen(false);
                  onClose();
                }}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading source code...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{error}</p>
              {onDownload && (
                <Button variant="outline" className="mt-4" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP Instead
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* File Tree */}
            <div className="w-64 border-r border-border flex-shrink-0 bg-muted/30">
              <ScrollArea className="h-full">
                <div className="py-2">
                  {fileTree.map((node) => (
                    <FileTreeNode
                      key={node.path}
                      node={node}
                      selectedPath={selectedFile?.path || null}
                      onSelect={setSelectedFile}
                      expandedFolders={expandedFolders}
                      onToggleFolder={toggleFolder}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Code View */}
            <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
              {selectedFile?.content ? (
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <pre className="text-sm leading-relaxed">
                      <code
                        className="text-gray-300 font-mono"
                        dangerouslySetInnerHTML={{
                          __html: getHighlightedCode(
                            selectedFile.content,
                            getLanguage(selectedFile.name)
                          ),
                        }}
                      />
                    </pre>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a file to view its contents</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="absolute top-16 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-border">
          Press ESC or click × to exit fullscreen
        </div>
      )}
    </div>
  );
}
