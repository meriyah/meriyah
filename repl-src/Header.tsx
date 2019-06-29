import * as React from "react";
import "./styles/Header.scss";

export class Header extends React.Component<{ menuOpened?: boolean }> {
  public render() {
    return (
      <div className="header">
        {!this.props.menuOpened && <div className="small-logo">meriyah</div>}
        <div className="items">
          <a
            href="https://meriyah.github.io/meriyah/performance/"
            target="_blank"
            className="item"
          >
            <i className="fas fa-tachometer-alt" /> Benchmark
          </a>
          <a
            href="https://github.com/meriyah/meriyah/"
            target="_blank"
            className="item"
          >
            <i className="fab fa-github" /> Github
          </a>
        </div>
      </div>
    );
  }
}
