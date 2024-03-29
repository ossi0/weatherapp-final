import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/navigation";
import Searchbar from "./components/searchbar";
import asemat from "./asemat";
import Datatable from "./components/datatable";
import Tempgraph from "./components/tempgraph";
import Snowgraph from "./components/snowgraph";
import * as d3 from "d3";

var timevaluepairshot;
var timevaluepairscold;
var chartstation;
// Alkuperäinen datankäsittelijäfunktio jota kutsutaan searchbar-komponentista.
// Palauttaa datan luettavaan muotoon datatablen table-elementtiin
// Tämän kutsuu searchbar-komnponentin handleOptionClick-funktio
export function showData(d) {
  timevaluepairshot = d.locations[0].data.tmax.timeValuePairs;
  timevaluepairscold = d.locations[0].data.tmin.timeValuePairs;
  chartstation = d.locations[0].info.name;
  // Koko vuoden max- ja mintemp erillisiksi funktioiksi
  var maxtemp = timevaluepairshot.reduce((init, currentvalue, currentindex) => {
    return init.value < currentvalue.value ? currentvalue : init;
  });
  var mintemp = timevaluepairscold.reduce(
    (init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    }
  );
  var lastmonthmax = lastMonthMax(timevaluepairshot);
  var lastmonthmin = lastMonthMin(timevaluepairscold);
  var lastweekmax = lastWeekMax(timevaluepairshot);
  var lastweekmin = lastWeekMin(timevaluepairscold);

  // Palauttaa span-elementin, jossa lämpötilaa vastaava päivämäärä on väriltään MUSTALLA
  function Nodes(txt) {
    var node = document.createTextNode(txt);
    var span = document.createElement("span");
    span.style.color = "black";
    span.appendChild(node);
    return span;
  }

  document.getElementById(
    "last-365-days-hot"
  ).textContent = maxtemp.value.toFixed(1);
  document
    .getElementById("last-365-days-hot")
    .appendChild(
      Nodes(
        ` (${new Date(maxtemp.time).getDate()}.${new Date(maxtemp.time).getMonth() + 1
        }.${new Date(maxtemp.time).getFullYear()})`
      )
    );

  document.getElementById(
    "last-365-days-cold"
  ).textContent = mintemp.value.toFixed(1);
  document
    .getElementById("last-365-days-cold")
    .appendChild(
      Nodes(
        ` (${new Date(mintemp.time).getDate()}.${new Date(mintemp.time).getMonth() + 1
        }.${new Date(mintemp.time).getFullYear()})`
      )
    );

  document.getElementById(
    "last-30-days-hot"
  ).textContent = lastmonthmax.value.toFixed(1);
  document
    .getElementById("last-30-days-hot")
    .appendChild(
      Nodes(
        ` (${new Date(lastmonthmax.time).getDate()}.${new Date(lastmonthmax.time).getMonth() + 1
        }.${new Date(lastmonthmax.time).getFullYear()})`
      )
    );

  document.getElementById(
    "last-30-days-cold"
  ).textContent = lastmonthmin.value.toFixed(1);
  document
    .getElementById("last-30-days-cold")
    .appendChild(
      Nodes(
        ` (${new Date(lastmonthmin.time).getDate()}.${new Date(lastmonthmin.time).getMonth() + 1
        }.${new Date(lastmonthmin.time).getFullYear()})`
      )
    );

  document.getElementById(
    "last-7-days-hot"
  ).textContent = lastweekmax.value.toFixed(1);
  document
    .getElementById("last-7-days-hot")
    .appendChild(
      Nodes(
        ` (${new Date(lastweekmax.time).getDate()}.${new Date(lastweekmax.time).getMonth() + 1
        }.${new Date(lastweekmax.time).getFullYear()})`
      )
    );

  document.getElementById(
    "last-7-days-cold"
  ).textContent = lastweekmin.value.toFixed(1);
  document
    .getElementById("last-7-days-cold")
    .appendChild(
      Nodes(
        ` (${new Date(lastweekmin.time).getDate()}.${new Date(lastweekmin.time).getMonth() + 1
        }.${new Date(lastweekmin.time).getFullYear()})`
      )
    );

  document.getElementById("last-day-hot").textContent = timevaluepairshot[
    timevaluepairshot.length - 1
  ].value.toFixed(1);
  document
    .getElementById("last-day-hot")
    .appendChild(
      Nodes(
        ` (${new Date(
          timevaluepairshot[timevaluepairshot.length - 1].time
        ).getDate()}.${new Date(
          timevaluepairshot[timevaluepairshot.length - 1].time
        ).getMonth() + 1
        }.${new Date(
          timevaluepairshot[timevaluepairshot.length - 1].time
        ).getFullYear()})`
      )
    );

  document.getElementById("last-day-cold").textContent = timevaluepairscold[
    timevaluepairscold.length - 1
  ].value.toFixed(1);
  document
    .getElementById("last-day-cold")
    .appendChild(
      Nodes(
        ` (${new Date(
          timevaluepairscold[timevaluepairscold.length - 1].time
        ).getDate()}.${new Date(
          timevaluepairscold[timevaluepairscold.length - 1].time
        ).getMonth() + 1
        }.${new Date(
          timevaluepairscold[timevaluepairscold.length - 1].time
        ).getFullYear()})`
      )
    );

  // Lopuksi kutsutaan kuvaajanpiirtäjäfunktio
  drawGraph(
    timevaluepairshot.slice(
      timevaluepairshot.length - 90,
      timevaluepairshot.length
    ),
    timevaluepairscold.slice(
      timevaluepairscold.length - 90,
      timevaluepairscold.length
    ),
    chartstation
  );
}
// Tätä funktiota kutsutaan searchbar-komponentista. Funktio hakee str-parametria (käyttäjän syöttämä)
// vastaavat tulokset asemat-muuttujasta (asemat.js) ja palauttaaa tulokset kutsuvan funktion käyttöön
export function returnStations(str) {
  var matchList = [];
  var searchRegex = new RegExp(str, "i");
  if (str.length > 1) {
    asemat.forEach((value, index) => {
      if (searchRegex.test(value[0])) {
        matchList.push(value);
      }
    });
    return matchList;
  } else {
    asemat.forEach((value, index) => {
      matchList.push(value);
    });
    return matchList;
  }
}

// Piirtää lämpötilakuvaajan kun käyttäjä valitsee mittausaseman
function drawGraph(hot, cold, station) {
  ReactDOM.render(
    <React.StrictMode>
      <Navigation />
      <Searchbar />
      <Datatable elements={Datatable.elements} />
      <Tempgraph />
    </React.StrictMode>,
    document.getElementById("root")
  );

  // Tarkistetaan onko kuvaaja jo ennestään olemassa
  if (document.getElementById("tempgraph").children.length > 1) {
    d3.select("svg").remove();
  }
  // set the dimensions and margins of the graph
  var margin = { top: 90, right: 70, bottom: 30, left: 70 },
    width = Math.max(window.innerWidth * 0.85, 550),
    height = Math.max(window.innerHeight / 2, 450);

  // append the svg object to the body of the page
  var svg = d3
    .select("#tempgraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(hot, function (d) {
        return d.time;
      })
    )
    .range([0, width])

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height).tickSizeOuter(0).tickFormat(d3.timeFormat("%b %d")));

  var y = d3
    .scaleLinear()
    .domain([
      d3.min(cold, function (d) {
        return +Math.floor(d.value);
      }),
      d3.max(hot, function (d) {
        return +Math.ceil(d.value);
      }),
    ])
    .range([height, 0]);

  svg
    .append("g")
    .call(d3.axisLeft(y).tickSize(-width).tickSizeOuter(0));

  // tooltip-funktiot

  var tdiv = d3.select("#tempgraph")
    .append('div')
    .attr("id", "tooltip")
    .style("text-align", "left")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "max-content")


  var bisect = d3.bisector(function (d) { return d.time; }).left;

  // Create the circles that travels along the curve of chart
  var focusHot = svg
    .append('g')
    .append('circle')
    .style("fill", "red")
    .attr("stroke", "none")
    .attr('r', 4)
    .style("opacity", 0)

  var focusCold = svg
    .append('g')
    .append('circle')
    .style("fill", "blue")
    .attr("stroke", "none")
    .attr('r', 4)
    .style("opacity", 0)

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', () => {
      focusHot.style("opacity", 1)
      focusCold.style("opacity", 1)
      d3.select("#tooltip").style("visibility", "visible")
    })

    .on('mousemove', (event) => {
      var coords = d3.pointer(event);
      var x0 = x.invert(coords[0]).getTime();
      var i = bisect(hot, x0);
      focusHot
        .attr("cx", x(hot[i].time))
        .attr("cy", y(hot[i].value))
      focusCold
        .attr("cx", x(cold[i].time))
        .attr("cy", y(cold[i].value))
      d3.select("#tooltip")
        .html(`${new Date(hot[i].time).getDate()}.
        ${(new Date(hot[i].time).getMonth() + 1)}.
        ${new Date(hot[i].time).getFullYear()} 
        <br> Max: <font color="red">${hot[i].value.toFixed(1)}</font> 
        <br> Min: <font color="blue">${cold[i].value.toFixed(1)}</font>`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 100) + 'px')
    })

    .on('mouseout', () => {
      focusHot.style("opacity", 0)
      focusCold.style("opacity", 0)
      d3.select("#tooltip").style("visibility", "hidden")
    });

  // Add the line
  svg
    .append("path")
    .datum(hot)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.value);
        })
    )

  svg
    .append("path")
    .datum(cold)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", margin.top / 2)
    .attr("transform", "translate(0," + -90 + ")")
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("text-decoration", "bold")
    .text(station);

}

export function showSnow(d) {
  var history = d.locations[0].data.snow.timeValuePairs;
  var station = d.locations[0].info.name;
  drawSnowGraph(history, station);
}

function drawSnowGraph(depth, title) {
  ReactDOM.render(
    <React.StrictMode>
      <Navigation />
      <Searchbar />
      <Snowgraph />
    </React.StrictMode>,
    document.getElementById("root")
  );

  // Tarkistetaan onko kuvaaja jo ennestään olemassa
  if (document.getElementById("snowgraph").children.length > 0) {
    d3.select("svg").remove();
  }

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 50, left: 30 },
    width = Math.max(window.innerWidth * 0.85, 550),
    height = Math.max(window.innerHeight / 2, 460),
    offset = width / depth.length / 2;

  // append the svg object to the body of the page
  var svg = d3
    .select("#snowgraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(depth, function (d) {
        return d.time;
      })
    )
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(" + offset + "," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(depth, function (d) {
      return +Math.ceil(d.value);
    })
    ])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  svg.selectAll("mybar")
    .data(depth)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.time); })
    .attr("y", function (d) { return y(d.value); })
    .attr("width", width / (depth.length + 1))
    .attr("height", function (d) { return height - y(d.value); })
    .attr("fill", "#1c4cc7")

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("text-decoration", "bold")
    .text(title);

}


function lastMonthMax(arr) {
  return arr
    .slice(
      arr.length -
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
      arr.length
    )
    .reduce((init, currentvalue, currentindex) => {
      return init.value < currentvalue.value ? currentvalue : init;
    });
}
function lastMonthMin(arr) {
  return arr
    .slice(
      arr.length -
      new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
      arr.length
    )
    .reduce((init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    });
}
function lastWeekMax(arr) {
  return arr
    .slice(arr.length - 7, arr.length)
    .reduce((init, currentvalue, currentindex) => {
      return init.value < currentvalue.value ? currentvalue : init;
    });
}
function lastWeekMin(arr) {
  return arr
    .slice(arr.length - 7, arr.length)
    .reduce((init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    });
}

export function showMonthGraph() {
  if (document.getElementById("tempgraph").children.length > 1) {
    d3.select("svg").remove();

    drawGraph(
      timevaluepairshot.slice(
        timevaluepairshot.length - 30,
        timevaluepairshot.length
      ),
      timevaluepairscold.slice(
        timevaluepairscold.length - 30,
        timevaluepairscold.length
      ),
      chartstation
    );
  }
}

export function showThreeMonthGraph() {
  if (document.getElementById("tempgraph").children.length > 1) {
    d3.select("svg").remove();

    drawGraph(
      timevaluepairshot.slice(
        timevaluepairshot.length - 90,
        timevaluepairshot.length
      ),
      timevaluepairscold.slice(
        timevaluepairscold.length - 90,
        timevaluepairscold.length
      ),
      chartstation
    );
  }
}

export function showYearGraph() {
  if (document.getElementById("tempgraph").children.length > 1) {
    d3.select("svg").remove();

    drawGraph(timevaluepairshot, timevaluepairscold, chartstation);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Navigation />
    <Searchbar />
    <Datatable elements={Datatable.elements} />
  </React.StrictMode>,
  document.getElementById("root")
);
