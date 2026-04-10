import Editor from "@monaco-editor/react";
import { useState } from "react";
import PlusIcon from "../ui/PlusIcon";
import { Dropdown } from "./Dropdown";
import { useReviewStore } from "../store/useReviewStore";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "SQL", value: "sql" },
  { label: "JSON", value: "json" },
];

const THEMES = [
  { label: "Dark", value: "vs-dark" },
  { label: "Light", value: "vs" },
  { label: "High Contrast", value: "hc-black" },
];

function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");

  const { isSubmitting, code, setCode, submitCode, isViewingHistory } =
    useReviewStore();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Language & Theme Select  */}
      <div className="flex items-center gap-3 border-b border-neutral-800 px-4 py-2">
        <Dropdown value={language} options={LANGUAGES} onChange={setLanguage} />
        <Dropdown value={theme} options={THEMES} onChange={setTheme} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-6 py-2">
        <div className="min-h-0 flex-1">
          <Editor
            height="100%"
            language={language}
            theme={theme}
            options={{
              wordWrap: "on",
            }}
            value={code}
            onChange={(value) => setCode(value)}
          />
        </div>
        <div className="mb-4 min-h-0">
          <button
            className={`font-inter text-neutral-0 flex w-full cursor-pointer items-center justify-center gap-0.5 rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed ${isViewingHistory ? "bg-neutral-700 hover:bg-neutral-700" : ""}`}
            onClick={() => submitCode(code)}
            disabled={isSubmitting || !code.trim() || isViewingHistory}
          >
            <PlusIcon />
            <span className="font-inter text-neutral-0 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px]">
              Submit For Review
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
