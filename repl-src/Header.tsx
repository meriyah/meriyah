import * as React from "react";
import "./styles/Header.scss";

export class Header extends React.Component {
  public render() {
    return (
      <div className="header">
        <div className="items">
          <a
            href="https://github.com/meriyah/meriyah/"
            target="_blank"
            className="item"
          >
            Github
          </a>
        </div>
      </div>
    );
  }
}
