// Set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 80},
    width = 770 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    function createScatterPlot(chartID, data, xAxisProp, yAxisProp, colorProp, chartTitle) {
        // Append the SVG object to the chart div of the page,
        // and set the dimensions of this SVG
        var svg = d3.select(chartID)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d[xAxisProp]; })])
        .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d[yAxisProp]; })])
        .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Color scale
        var color = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain(d3.extent(data, function (d) { return +d[colorProp]; }))
    
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[xAxisProp]); })
            .attr("cy", function (d) { return y(d[yAxisProp]); })
            .attr("r", 5)
            .style("fill", function (d) { return color(d[colorProp]) })
    
        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2)
            .attr("y", height + margin.top + 20)
            .text(xAxisProp);
    
        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -margin.top)
            .text(yAxisProp)
    }

// Function to filter data based on position
function filterDataByPosition(data, position) {
    return data.filter(d => d.position === position);
}

// Function to create a bar chart given a CSV file and a property to visualize
function createBarChart(chartID, data, property, chartTitle) {
    // Append the SVG object to the chart div of the page,
    // and set the dimensions of this SVG
    var svg = d3.select(chartID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var groupData;

    if(property === 'position') {
        // group the data: I want to count the number of players per position
        groupData = d3.rollup(data, v => v.length, d => d.position);
    } else if(property === 'averageAge') {
        // group the data: I want to calculate the average age of players per position
        groupData = d3.rollup(data, v => Number((d3.mean(v, d => d.age)).toFixed(2)), d => d.position);
    }

    // create an array from the map
    var dataArray = Array.from(groupData, d => ({property: d[0], value: d[1]}));

    // Add X axis
    var x = d3.scaleBand()
    .range([0, width])
    .domain(dataArray.map(function(d) { return d.property; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size", "14px")
    .call(d3.axisBottom(x))
    .append("text")  // append a label to the axis
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text(property === 'position' ? "Position" : "Position");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(dataArray, d => d.value)])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y).ticks(10))  // specify the number of ticks
    .append("text")  // append a label to the axis
    .attr("transform", "rotate(-90)")
    .style("font-size", "16px")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 35)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text(property === 'position' ? "Number of Players" : "Average Age");

    // Bars
    var bars = svg.selectAll(".mybar")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.property); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2");

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

    var mouseover = function(event, d) {
        tooltip
            .style("opacity", 1);
    };

    var mousemove = function(event, d) {
        tooltip
            .html("Property: " + d.property + "<br>Value: " + d.value)
            .style("left", (event.clientX + 10) + "px")
            .style("top", (event.clientY + 10) + "px");
    };

    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0);
    };

    bars
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
}

// Function to calculate stats from data array
function calculateStats(data, property) {
    let groupData;
    let total = 0;
    let mostProperty;
    let leastProperty;
    let highestValue = 0;
    let lowestValue = Number.MAX_SAFE_INTEGER;

    if(property === 'position') {
        groupData = d3.rollup(data, v => v.length, d => d.position);
    } else if(property === 'averageAge') {
        groupData = d3.rollup(data, v => Number((d3.mean(v, d => d.age)).toFixed(2)), d => d.position);
    }

    // create an array from the map
    var dataArray = Array.from(groupData, d => ({property: d[0], value: d[1]}));

    dataArray.forEach(item => {
        total += item.value;
        if(item.value > highestValue) {
            highestValue = item.value;
            mostProperty = item.property;
        }
        if(item.value < lowestValue) {
            lowestValue = item.value;
            leastProperty = item.property;
        }
    });

    return {
        total: total,
        mostProperty: mostProperty,
        highestValue: highestValue,
        leastProperty: leastProperty,
        lowestValue: lowestValue
    };
}

// Buttons to switch between views
var positionButton = document.getElementById('positionButton');
var ageButton = document.getElementById('ageButton');
var scatterButton = document.getElementById('scatterButton');  

// Clear the contents of the chart div
function clearChart() {
    d3.select("#chart").html("");
}

var data;

// Update the positionButton event listener
positionButton.addEventListener('click', function() {
    d3.csv("players.csv").then(function(csvData) {
        // convert birthDate strings to Date objects
        csvData.forEach(d => d.birthDate = new Date(d.birthDate));

        // calculate the current year
        let currentYear = new Date().getFullYear();

        // calculate ages and add as new property 'age'
        csvData.forEach(d => d.age = currentYear - d.birthDate.getFullYear());

        data = csvData; // set global data variable

        let stats = calculateStats(data, 'position');
        document.getElementById('scene1Message').innerText = `There are a total of ${stats.total} players. The position with the most players is ${stats.mostProperty} with ${stats.highestValue} players, while the position with the least players is ${stats.leastProperty} with ${stats.lowestValue} players.`;

        clearChart();
        createBarChart("#chart", data, "position", "Player Count by Position");
    });
});

ageButton.addEventListener('click', function() {
    d3.csv("players.csv").then(function(data) {
        // convert birthDate strings to Date objects
        data.forEach(d => d.birthDate = new Date(d.birthDate));

        // calculate the current year
        let currentYear = new Date().getFullYear();

        // calculate ages and add as new property 'age'
        data.forEach(d => d.age = currentYear - d.birthDate.getFullYear());

        let stats = calculateStats(data, 'averageAge');
        document.getElementById('scene1Message').innerText = `Age distribution gives us a clear representation of the athletic profile that breaks down each position, specifically giving us insight as to the hardest positions there are to be played. The position with the oldest average age is ${stats.mostProperty} at ${stats.highestValue} demonstrating precision outweighs athletic profile, while the position with the youngest average age is ${stats.leastProperty} at ${stats.lowestValue} which is argued amongst analysts to be the most difficult and taxing position to be played.`;

        clearChart();
        createBarChart("#chart", data, "averageAge", "Average Age of Players by Position");
    });
});

// Function to populate select dropdown with positions
function populatePositions(data) {
    // Get unique positions
    let positions = [...new Set(data.map(item => item.position))];

    let select = document.getElementById('positionSelect'); 

    // Create a new option element for each position
    positions.forEach(position => {
        let opt = document.createElement('option');
        opt.value = position;
        opt.innerHTML = position;
        select.appendChild(opt);
    });
}

document.getElementById('positionSelect').addEventListener('change', function() {
    // get the selected position
    let selectedPosition = this.value;

    // filter the data by selected position
    let filteredData = filterDataByPosition(data, selectedPosition);

    // call the scatter plot function with the required arguments
    clearChart();
    createScatterPlot("#chart", filteredData, "height", "weight", "age", "Player Height vs Weight colored by Age");
});

// Add button for scatter plot
var scatterPlotButton = document.getElementById('scatterPlotButton');

scatterPlotButton.addEventListener('click', function() {
    d3.csv("players.csv").then(function(data) {
        // convert birthDate strings to Date objects
        data.forEach(d => d.birthDate = new Date(d.birthDate));

        populatePositions(data);

        // calculate the current year
        let currentYear = new Date().getFullYear();

        // calculate ages and add as new property 'age'
        data.forEach(d => d.age = currentYear - d.birthDate.getFullYear());

        // get the selected position
        let selectedPosition = document.getElementById('positionSelect').value;

        // filter the data by selected position
        let filteredData = filterDataByPosition(data, selectedPosition);

        // call the scatter plot function with the required arguments
        clearChart();
        createScatterPlot("#chart", filteredData, "height", "weight", "age", "Player Height vs Weight colored by Age");
    });
});

positionButton.click()
