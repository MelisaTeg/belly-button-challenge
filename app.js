// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
   for (key in result) {
        panel.append("h6").text('${key.toUpperCase()}: ${result[key]}');
     };
  });
}
// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubble_data = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values, 
                color: otu_ids,
                colorscale: "Earth"
            }
        }
    ];

    // Render the Bubble Chart
    let bubble_layout = {
        title: "OTU Bubble Chart",
        margin: {t: 0},
        xaxis: {title: "OTU ID"},
        yaxis: {"title": "Sample Values"},
        hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(otuID => "OTU ${otuID}");

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_data = [
        {
            y: yticks.slice(0, 10).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];
      
    let bar_layout = {
        title: "Top 10 OTUs Found",
        xaxis: {title: "Sample Values"},
        margin: {t: 30, l: 150}
    };

    // Render the Bar Chart
        Plotly.newPlot("bar", bar_data, bar_layout);
    });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sample_names.length; i++){
        dropdown
            .append("option")
            .text(sample_names[i])
            .property("value", sample_names[i]);
    };

    // Get the first sample from the list
    let first_sample = sample_names[0];

    // Build charts and metadata panel with the first sample
        buildMetadata(first_sample);
        buildCharts(first_sample);
    });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
