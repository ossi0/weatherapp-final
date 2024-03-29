import React, { Component } from "react";
// import { snowdepth } from "../index";

class Navigation extends Component {
  handleSelection = (id) => {
    if (id === 1) {
      console.log("Lämpötila");
    } else if (id === 3) {
      console.log("Salamat");
    } else if (id === 3) {
      console.log("Kuvaaja");
    } else if (id === 4) {
      console.log("Lumensyvyys");
    }
  };

  render() {
    return (
      <div id="nav">
        <ul className="nav nav-pills nav-fill bg-dark">
          <li className="nav-item">
            <a
              onClick={() => this.handleSelection(1)}
              className="nav-link text-white"
              href="#"
            >
              Lämpötilahistoria
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="kuvaaja" onClick={() => this.handleSelection(2)}>
              Lämpötilakuvaaja
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => this.handleSelection(3)}
              className="nav-link text-white"
              href="#"
            >
              Salamat
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => this.handleSelection(4)}
              className="nav-link text-white"
              href="lumensyvyys"
              >
              Lumensyvyys
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navigation;
