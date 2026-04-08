import Editor from "@monaco-editor/react";

function CodeEditor() {
  return (
    <div>
      {/* <div>
        <select name="" id=""></select>
      </div> */}

      <Editor
        height="400px"
        language="javascript"
        options={{
          wordWrap: "on",
        }}
      />
    </div>
  );
}

export default CodeEditor;
