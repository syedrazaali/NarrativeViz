// define the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right, // Adjust the width here
    height = 400 - margin.top - margin.bottom; // Adjust the height here

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv("players.csv").then(function(data) {

  // group the data: I want to count the number of players per position
  var positionCount = d3.rollup(data, v => v.length, d => d.position);

  // create an array from the map
  var positionArray = Array.from(positionCount, d => ({position: d[0], count: d[1]}));

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(positionArray.map(function(d) { return d.position; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(positionArray, d => d.count)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  var bars = svg.selectAll("mybar")
    .data(positionArray)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.position); })
      .attr("y", function(d) { return y(d.count); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.count); })
      .attr("fill", "#69b3a2");

  // X axis label
  svg.append("text")
    .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Position");

  // Y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Count");

  // Title
  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Distribution of Players by Position");

  // Tooltip
  var tooltip = d3.select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

 var mouseover = function(d) {
  tooltip
    .style("opacity", 1);
};

var mousemove = function(d) {
  tooltip
    .html("Position: " + d.position + "<br>Count: " + d.count)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px");
};

var mouseleave = function(d) {
  tooltip
    .style("opacity", 0);
};

bars
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
});
