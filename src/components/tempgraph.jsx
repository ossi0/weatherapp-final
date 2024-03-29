import React, { Component } from "react";
import { showMonthGraph, showThreeMonthGraph, showYearGraph } from "../index";

class Tempgraph extends Component {
  render() {
    return (
      <div
        id="tempgraph"
        className="center"
        style={{
          textAlign: "center",
          marginTop: "40px",
          display: "table-cell",
        }}
      >
        <div id="buttons" className="center">
          <button id="show-graph-month" onClick={showMonthGraph}>
            Kuukausi
          </button>
          <button id="show-graph-three-months" onClick={showThreeMonthGraph}>
            3 Kuukautta
          </button>
          <button id="show-graph-year" onClick={showYearGraph}>
            Vuosi
          </button>
        </div>
      </div>
    );
  }
}

export default Tempgraph;
