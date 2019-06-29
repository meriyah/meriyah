import * as React from "react";
import { LeftMenu } from "./LeftMenu";
import "./styles/main.scss";
import { Editor } from "./editor";
import * as meriyah from "../meriyah.umd.js";

import { Header } from "./Header";
import { DEFAULT_CODE } from './config';
const initialCode = `function foo(bar){
  return bar;
}`;

function saveToLocalStorage(str : string){
  localStorage.setItem("code", str);
}

function getCodeFromLocalStage(){
  return localStorage.getItem("code") || DEFAULT_CODE;
}

export class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      jsCode: getCodeFromLocalStage(),
      settings: { module: true },
      menuOpened: true
    };
  }
  private jsonEditor;
  private tm;

  private parse(settings?) {
    try {
      const out = meriyah.parse(
        this.state.jsCode,
        settings || this.state.settings
      );

      if (this.jsonEditor) {
        this.setState({ error: undefined });
        this.jsonEditor.setValue(JSON.stringify(out, null, 2));
      }
    } catch (e) {
      this.jsonEditor.setValue("");
      this.setState({ error: e.message });
    }
  }
  private onSettingsChange = settings => {
    this.setState({ settings: settings });
    this.parse(settings);
  };

  public onJavascriptCode = (value: string) => {
    this.setState({ jsCode: value });
    clearTimeout(this.tm);
    this.tm = setTimeout(() => {
      saveToLocalStorage(value);
      this.parse();
    }, 50);
  };

  private toggleMenu = () => {
    this.setState({ menuOpened: this.state.menuOpened ? false : true });
  };
  private parseError() {
    const error = this.state.error;
    return error.replace("\n", "<br/>");
  }

  render() {
    const leftClass = ["left"];
    if (!this.state.menuOpened) {
      leftClass.push("closed");
    }
    return (
      <div className="layout">
        <div className="main-container">
          <div className={leftClass.join(" ")}>
            <LeftMenu onSettingsChange={this.onSettingsChange} />
            <div className={"drawer"} onClick={this.toggleMenu} />
          </div>
          <div className="right">
            <Header menuOpened={this.state.menuOpened} />

            <div className="editors">
              <div className="editor">
                <Editor
                  onChange={this.onJavascriptCode}
                  value={this.state.jsCode}
                />
                {this.state.error && (
                  <div
                    className="error"
                    dangerouslySetInnerHTML={{ __html: this.parseError() }}
                  />
                )}
              </div>
              <div className="results">
                <Editor
                  readOnly={true}
                  onInit={editor => {
                    this.jsonEditor = editor;
                    this.parse();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
