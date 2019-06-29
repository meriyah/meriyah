import * as CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

import "codemirror/addon/selection/active-line";
import "codemirror/addon/scroll/simplescrollbars.js";
import * as React from "react";

export interface IEditorProps {
  onChange?: (value: string) => void;
  lineNumbers?: boolean;
  mode?: string;
  value?: string;
  readOnly?: boolean;
  onInit?: (editor) => void;
}

export class Editor extends React.Component<IEditorProps> {
  private initialized: boolean;
  private editor;

  public init(element) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.editor = CodeMirror(element);
    this.editor.setOption("lineNumbers", true);
    if (this.props.readOnly) {
      this.editor.setOption("readOnly", true);
    }

    if (this.props.value) {
      this.editor.setOption("value", this.props.value);
    }
    this.editor.setOption(
      "mode",
      this.props.mode ? this.props.mode : "javascript"
    );
    this.editor.setOption("lineWrapping", true);
    //this.editor.setOption("scrollbarStyle", "simple");
    this.editor.setOption("styleActiveLine", true);
    //this.editor.setOption("styleActiveSelected", true);

    this.props.onInit && this.props.onInit(this.editor);
    this.editor.on("change", (e, v) => {
      const value = e.doc.getValue();
      this.props.onChange && this.props.onChange(value);
    });
  }

  public render() {
    return <div className="editor-container" ref={node => this.init(node)} />;
  }
}
