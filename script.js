// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the div called 'chart'
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Load the data
d3.csv("players.csv").then(function(data) {
  // Process the data to get the count of players for each position
  var positionData = d3.rollups(data, v => v.length, d => d.position);
  positionData = Array.from(positionData, d => ({position: d[0], count: d[1]}));

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(positionData.map(function(d) { return d.position; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(positionData, function(d) { return d.count; })])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(positionData)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.position); })
    .attr("width", x.bandwidth())
    .attr("fill", "#69b3a2")
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); }) // always equal to height

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(d.count); })
    .delay(function(d,i){return(i*100)})

}).catch(function(error){
  console.log(error);
})
