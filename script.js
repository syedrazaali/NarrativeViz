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
  // rest of the x-axis code...
  
  // Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(positionData, function(d) { return d.count; })])
    .range([ height, 0]);
  // rest of the y-axis code...

  // Bars
  svg.selectAll("mybar")
    .data(positionData)
    .enter()
    .append("rect")
    // rest of the bar code...

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
