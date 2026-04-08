import Editor from "@monaco-editor/react";
import PlusIcon from "../ui/PlusIcon";

function CodeEditor() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Language & Theme Select  */}
      <div className="border-b border-neutral-800 px-4 py-2">
        <h1 className="text-white">Language</h1>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 py-2">
        <div className="flex-1">
          <Editor
            height="100%"
            language="javascript"
            options={{
              wordWrap: "on",
            }}
          />
        </div>
        <div className="mb-4">
          <button className="font-inter text-neutral-0 flex w-full cursor-pointer items-center justify-center gap-0.5 rounded-lg bg-blue-500 px-4 py-3 text-[16px] leading-[1.2] font-semibold tracking-[-0.3px] transition-all duration-200 hover:bg-blue-700 focus:outline-2 focus:outline-offset-3 focus:outline-neutral-600 disabled:cursor-not-allowed">
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
