// Load the data from the CSV file
d3.csv("players.csv").then(data => {
    console.log(data);  // Log the data for debugging

    // Process the data (calculate averages, etc.)

    // Create the visualization
}).catch(error => {
    console.log(error);  // Log any error that occurred
});
