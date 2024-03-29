import React, { Component } from "react";
import { returnStations, showData, showSnow } from "../index";
import Metolib from "@fmidev/metolib";

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: "",
    };

    this.handleDropdownSearch = this.handleDropdownSearch.bind(this);
  }

  handleDropdownVisibility = (state) => {
    this.setState({ visible: state === 0 ? false : true });
  };
  handleDropdownSearch = (event) => {
    this.setState({ value: event.target.value });
  };
  // Tekee datapyynnön fmi:ltä ja kutsuu datankäsittelijäfunktion showData (index.js)
  handleOptionClick = (id, option) => {
    console.log(option);
    // Määritellään ensiksi tämänhetkinen aika (dt) sekä aika vuosi sitten (dtstart)
    var dt = new Date();
    var dtstart = new Date(
      new Date().getFullYear() - 1,
      new Date().getMonth(),
      new Date().getDate()
    );
    var dtsnowstart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 30
    );

    var parser = new Metolib.WfsRequestParser();
    var SERVER_URL = "http://opendata.fmi.fi/wfs";
    var STORED_QUERY_OBSERVATION =
      "fmi::observations::weather::daily::multipointcoverage";
    if (option === 1) {
      parser.getData({
        url: SERVER_URL,
        storedQueryId: STORED_QUERY_OBSERVATION,
        requestParameter: "tmin,tmax",
        begin: new Date(dtstart).getTime(),
        end: new Date(dt).getTime(),
        fmisid: id,
        callback: function (data, errors) {
          console.log(data);
          showData(data);
          if (errors) {
            // Miten tämä toimii??
            console.log("Virhe");
          }
        },
      });
    }
    if (option === 4) {
      console.log("lumensyvyyden kuvaaja");
      parser.getData({
        url: SERVER_URL,
        storedQueryId: STORED_QUERY_OBSERVATION,
        requestParameter: "snow",
        begin: new Date(dtsnowstart).getTime(),
        end: new Date(dt).getTime(),
        fmisid: id,
        callback: function (data, errors) {
          console.log(data.locations[0].data.snow.timeValuePairs.length);
          if (data.locations.length > 0) {
            showSnow(data);
          } else {
            alert("Asemalta ei saatu tietoja. Kokeile toista asemaa");
          }

        },
      });
    }
  };

  render() {
    const option = (name, key) =>
      React.createElement(
        "a",
        {
          style: {
            cursor: "pointer",
          },
          // href: key,
          key: key,
          onMouseDown: () => {
            // 4 = lumensyvyys, 1 = lämpötilakuvaaja
            if (window.location.pathname === "/lumensyvyys") {
              this.handleOptionClick(key, 4);
            }
            if (window.location.pathname === "/kuvaaja" || "/") {
              this.handleOptionClick(key, 1);
            }
          },
        },
        name
      );
    const fetchOptions = () => {
      var optionlist = [];
      returnStations(this.state.value).forEach((value, index) => {
        optionlist.push(option(value[0], value[1]));
      });
      return optionlist;
    };
    const dropdownVisibleClass = "dropdown-content";
    const dropdownHiddenClass = "dropdown-content hidden";
    return (
      <div id="search" className="card">
        <div className="card-header justify-content-center ">
          Valitse haluamasi mittausasema havaintohistoriaa varten
        </div>
        <div
          className="card-body justify-content-center"
          onFocus={() => this.handleDropdownVisibility(1)}
          onBlur={() => this.handleDropdownVisibility(0)}
        >
          <input
            type="text"
            value={this.state.value}
            placeholder="Hae..."
            id="dropdowninput"
            onChange={this.handleDropdownSearch}
          />
          <div className="dropdown">
            <div
              id="dropdownbox"
              className={
                this.state.visible === true
                  ? dropdownVisibleClass
                  : dropdownHiddenClass
              }
            >
              {fetchOptions()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Searchbar;
