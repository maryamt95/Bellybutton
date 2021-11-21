function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data)
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildBarCharts(firstSample);
    buildMetadata(firstSample);
    buildBubleCharts(firstSample)
    buildGuageCharts(firstSample)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildBarCharts(newSample)
  buildBubleCharts(newSample);
  buildGuageCharts(newSample)
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildBarCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  var samplesdata= data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
  var sampless=samplesdata.filter(sampleObj => sampleObj.id == sample)
console.log(sampless)
    //  5. Create a variable that holds the first sample in the array.
var samplearray=sampless[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values_10=samplearray.sample_values.sort((a,b)=>b-a).slice(0,10).reverse()
    var otu_labels_10=samplearray.otu_labels.slice(0,10)
    var otu_ids_10=samplearray.otu_ids.slice(0,10).sort((a,b)=>b-a)
  

    // 7. Create the yticks for the bar chart.

    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids_10.map(x=>"OTU"+ x)
     console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [{x:sample_values_10,
      y:yticks,
      type: "bar",
      text: otu_labels_10,
      orientation: "h"
      
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found"}
     
    //};
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData,barLayout)

  })}
//////////////////////////////////////////////////////////////////////////////////////////////////
function buildBubleCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  var samplesdata= data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
  var sampless=samplesdata.filter(sampleObj => sampleObj.id == sample)
  //  5. Create a variable that holds the first sample in the array.
  var samplearray=sampless[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values=samplearray.sample_values
    var otu_labels=samplearray.otu_labels
    var otu_ids=samplearray.otu_ids
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:'markers',
      
      marker:{
        color: otu_ids,
        //opacity: [1, 0.8, 0.6, 0.4,0.5,0.4,0.9,0.7,0.4,0.3],
        size: sample_values
      }

    }];
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID",
      showlegend: false,
      autosize: true}
      
    };

    // 2. Create the layout for the bubble chart.
 Plotly.newPlot("bubble",bubbleData,bubbleLayout)
  

  })}

////////////////////////////////////////////////////////////////////////////////////////////
function buildGuageCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washing_freq=parseFloat(result.wfreq)

    
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
    domain: { x: [0, 1], y: [0, 1] },
		value: washing_freq,
		title: { text: "Scrubs per week" },
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { range: [0, 10] ,dtick:"2"},
      bar: { color: "darkblue" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2,4], color: "orange" },
        { range: [4,6], color: "yellow" },
        { range: [6,8], color: "light green" },
        { range: [8,10], color: "green" }]
      }
    }    
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title:"Belly Button Washing Frequency"
     
   };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}