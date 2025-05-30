import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Check, X } from "lucide-react";

type CodeEditorProps = {
  initialValue: string;
  onSubmit: (code: string) => void;
  onDiscard: () => void;
};

function CodeEditor({
  onSubmit,
  onDiscard,
  initialValue = "",
}: CodeEditorProps) {
  const editorContainer = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>(undefined);

  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (!editorContainer.current) return;
    if (editor.current) return;

    // Create the editor instance
    editor.current = monaco.editor.create(editorContainer.current, {
      language: "python",
      automaticLayout: true,
    });

    editor.current.setValue(initialValue);

    editor.current.onDidChangeModelContent(() => {
      setCode(editor.current?.getValue() ?? "");
    });

    return () => {
      editor.current?.dispose();
      editor.current = undefined;
    };
  }, [initialValue]);

  useEffect(() => {
    // Function to set the editor theme based on the color scheme
    const setEditorTheme = (theme: string) => {
      if (theme === "dark") {
        monaco.editor.setTheme("vs-dark");
      } else {
        monaco.editor.setTheme("vs-light");
      }
    };

    // Detect the initial color scheme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setEditorTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for changes in the color scheme
    const handleChange = (e: MediaQueryListEvent) => {
      setEditorTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center justify-between bg-base-300 p-4">
        <h1 className="text-lg font-bold text-base-content">Code Editor</h1>
        <div className="flex gap-2">
          <button
            className="btn flex items-center gap-1 btn-sm btn-success"
            onClick={() => onSubmit(code)}
          >
            <Check size={16} />
            Submit
          </button>
          <button
            className="btn flex items-center gap-1 btn-sm btn-error"
            onClick={onDiscard}
          >
            <X size={16} />
            Discard
          </button>
        </div>
      </div>
      <div
        className="min-h-120 border border-base-300 shadow-lg"
        ref={editorContainer}
      />
    </div>
  );
}

export default CodeEditor;
