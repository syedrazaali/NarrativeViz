var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right, // Adjust the width here
    height = 400 - margin.top - margin.bottom; // Adjust the height here

// Tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

// Tooltip mouse events
var mouseover = function(event, d) {
    tooltip.style("opacity", 1);
};

var mousemove = function(event, d) {
    tooltip
    .html("Position: " + d.position + "<br>Value: " + d.value)
    .style("left", (event.clientX + 10) + "px") // adjust these values as needed
    .style("top", (event.clientY + 10) + "px"); // adjust these values as needed
};

var mouseleave = function(d) {
    tooltip.style("opacity", 0);
};

d3.csv("players.csv").then(function(data) {
    // Calculate age from birthDate
    data.forEach(function(d) {
        var birthDate = new Date(d.birthDate);
        var ageDifMs = Date.now() - birthDate.getTime();
        var ageDate = new Date(ageDifMs);
        d.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    });

    // group the data: I want to count the number of players per position
    var positionCount = d3.rollup(data, v => v.length, d => d.position);
    var positionAge = d3.rollup(data, v => d3.mean(v, d => d.age), d => d.position);

    // create an array from the map
    var positionCountArray = Array.from(positionCount, d => ({position: d[0], value: d[1]}));
    var positionAgeArray = Array.from(positionAge, d => ({position: d[0], value: d[1]}));

    // Create the SVGs
    var svg1 = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = d3.select("#chart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the charts
    createBarChart(positionCountArray, svg1, height, width);
    createAverageAgeChart(positionAgeArray, svg2, height, width);
});

function createBarChart(data, svg, height, width) {
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.position; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    var bars = svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.position); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

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
        .attr("y", 0 - (margin.top / 2) + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Distribution of Players by Position");
}

function createAverageAgeChart(data, svg, height, width) {
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.position; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    var bars = svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.position); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

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
        .text("Average Age");

    // Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2) + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Age of Players by Position");
}
