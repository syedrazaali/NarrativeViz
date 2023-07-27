var margin = {top: 30, right: 30, bottom: 70, left: 80},
    width = 770 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    function createScatterPlot(chartID, data, xAxisProp, yAxisProp, colorProp, chartTitle) {
        document.getElementById('chartTitle').innerText = "Player Attribute Breakdown";
        var svg = d3.select(chartID)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(d3.zoom().on("zoom", function (event) {
                svg.attr("transform", event.transform);
            }))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Calculate the minimum and maximum for x and y
        var xMin = d3.min(data, function (d) { return +d[xAxisProp]; });
        var xMax = d3.max(data, function (d) { return +d[xAxisProp]; });
        var yMin = d3.min(data, function (d) { return +d[yAxisProp]; });
        var yMax = d3.max(data, function (d) { return +d[yAxisProp]; });
    
        var x = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    
        var y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
    
        var color = d3.scaleThreshold()
            .domain([23, 25, 30, 35])
            .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

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
        tooltip.style("opacity", 1);
    };
    var mousemove = function(event, d) {
        tooltip
            .html("Height: " + d[xAxisProp] + "<br>Weight: " + d[yAxisProp] + "<br>Age: " + d[colorProp])
            .style("left", (event.clientX + 10) + "px")
            .style("top", (event.clientY + 10) + "px");
    };

    var mouseleave = function(d) {
        tooltip.style("opacity", 0);
    };
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[xAxisProp]); })
        .attr("cy", function (d) { return y(d[yAxisProp]); })
        .attr("r", 5)
        .style("fill", function (d) { return color(d[colorProp]) })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + margin.top + 20)
        .text(xAxisProp);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text(yAxisProp);

// Legend
var ageRanges = ["20-25", "25-30", "30-35", "35-40",];

var legend = svg.selectAll(".legend")
    .data(ageRanges)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + (height - i * 20 - 25) + ")"; }); // Adjust this for legend position

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return color(i * 5 + 22.5); }); 

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
    
}
// Function to filter data based on position
function filterDataByPosition(data, position) {
    return data.filter(d => d.position === position);
}

// Function to create a bar chart given a CSV file and a property to visualize
function createBarChart(chartID, data, property, chartTitle) {
    document.getElementById('chartTitle').innerText = chartTitle;
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
    .attr("fill", "#013369");  // Dark blue similar to NFL logo

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

var positionButton = document.getElementById('positionButton');
var ageButton = document.getElementById('ageButton');
var scatterButton = document.getElementById('scatterButton');  

// Clear the contents of the chart div
function clearChart() {
    d3.select("#chart").html("");
}
var data;

positionButton.addEventListener('click', function() {
    positionLabel.style.display = "none";
    positionSelect.style.display = "none";
    d3.csv("players.csv").then(function(csvData) {
        csvData.forEach(d => d.birthDate = new Date(d.birthDate));
        let currentYear = new Date().getFullYear();
        csvData.forEach(d => d.age = currentYear - d.birthDate.getFullYear());

        data = csvData; // set global data variable
        let stats = calculateStats(data, 'position');
        document.getElementById('scene1Message').innerText = `Our visualization journey begins with an overview of the total number of NFL players, clocking in at an impressive ${stats.total}. The Player Count by Position bar chart provides us with a bird's eye view of the league, highlighting the distribution of players across the various roles. The chart instantly captures our attention towards the position brimming with the highest count of players - ${stats.mostProperty}, boasting a whopping ${stats.highestValue} players. This might not come as a surprise considering the pivotal role this position plays in the dynamics of the game. However, the position that lays claim to the fewest players is ${stats.leastProperty}, fielding merely ${stats.lowestValue} players. This disparity in the count of players might hint at the relative complexity or niche requirements of this role, but can also be broken down into a subset of the runningback position. We will begin to look further into all the factors that directly have an impact on the performance trends of NFL players across various positions and other factors (to be seen ahead).`;

        clearChart();
        createBarChart("#chart", data, "position", "Player Count by Position");
    });
});

ageButton.addEventListener('click', function() {
    positionLabel.style.display = "none";
    positionSelect.style.display = "none";
    d3.csv("players.csv").then(function(data) {
        data.forEach(d => d.birthDate = new Date(d.birthDate));
        let currentYear = new Date().getFullYear();
        data.forEach(d => d.age = currentYear - d.birthDate.getFullYear());

        let stats = calculateStats(data, 'averageAge');
        document.getElementById('scene1Message').innerText = `The Average Age by Position bar chart paints a fascinating picture of the relationship between the player's age and their position within the NFL. This age distribution is not merely numbers; it offers valuable insights into the athletic profile required for each position and the physical demands they entail. With a quick glance at the chart, it's possible to identify which positions are considered the most challenging or taxing to play. For instance, the position with the oldest average age, ${stats.mostProperty}, with an average age of ${stats.highestValue}, suggests that experience and tactical acumen often outshine sheer athleticism. On the other hand, the position with the youngest average age, ${stats.leastProperty}, at a tender ${stats.lowestValue}, is frequently viewed as the most physically challenging and taxing to be played (which is why the NFL is consider a young man's sport). This dichotomy underscores the complexity and diversity of skills and physical prowess required across different positions in the NFL. Not only does the chart represent the demographic landscape of the league, but it also prompts us to appreciate the nuances and intricacies that make the sport so engaging and unpredictable. This like the last bar graph is interactable with tooltips, giving exact specifics for each position's average age.`;

        clearChart();
        createBarChart("#chart", data, "averageAge", "Average Age of Players by Position");
    });
});

// Function to populate select dropdown with positions
function populatePositions(data) {
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
    let selectedPosition = this.value;
    let filteredData = filterDataByPosition(data, selectedPosition);
    clearChart();
    createScatterPlot("#chart", filteredData, "height", "weight", "age", "Player Height vs Weight colored by Age");
});

// Add button for scatter plot
var scatterPlotButton = document.getElementById('scatterPlotButton');
var positionSelect = document.getElementById('positionSelect');
var positionLabel = document.getElementById('positionLabel');

scatterPlotButton.addEventListener('click', function() {
    positionLabel.style.display = "block";
    positionSelect.style.display = "block";
    d3.csv("players.csv").then(function(data) {
        data.forEach(d => d.birthDate = new Date(d.birthDate));

        populatePositions(data);
        let currentYear = new Date().getFullYear();
        data.forEach(d => d.age = currentYear - d.birthDate.getFullYear());
        let selectedPosition = document.getElementById('positionSelect').value;
        let filteredData = filterDataByPosition(data, selectedPosition);
        document.getElementById('scene1Message').innerText = "The scatterplot represents a comprehensive breakdown of player attributes in terms of height and weight, color-coded by age. This graphical representation offers insights into the typical physical profiles across different positions in the NFL, with each dot representing an individual player and includes the functionality to be able to zoom in and out of the graph to get a closer look at each position. By color-coding the data points by age, the plot provides an additional layer of information, offering a glimpse into how age distributions can vary across positions. This visualization is particularly useful for identifying patterns and correlations between the physical attributes and age of players. The drop-down menu allows for data filtering, enabling viewers to focus on specific positions for more detailed analysis. As seen in the plot, each position is vastly different: age, height, and weight demographics all vary widely from the more Athletic positions in comparison to the blocking and rushing positions. WR, RB, CB cover the most athletic positions in the NFL which is why we see a younger age, taller height, and moderate weight for these positions. This dataset clearly breaks down the mold of NFL player by position.   ";
        clearChart();
        createScatterPlot("#chart", filteredData, "height", "weight", "age", "Player Height vs Weight colored by Age");
    });
});

let tabButtons = document.querySelectorAll('.tablinks');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveTab(button);
    });
});
function setActiveTab(activeButton) {
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}
var hasVisitedPosition = false;
var hasVisitedAge = false;

document.getElementById('positionButton').addEventListener('click', function() {
  hasVisitedPosition = true;
  checkAccessToFullBreakdown();
});
document.getElementById('ageButton').addEventListener('click', function() {
  hasVisitedAge = true;
  checkAccessToFullBreakdown();
});
function checkAccessToFullBreakdown() {
  if (hasVisitedPosition && hasVisitedAge) {
    document.getElementById('scatterPlotButton').disabled = false;
  }
}
document.getElementById('scatterPlotButton').disabled = true;

positionButton.click()
