const fs = require('fs');
const convert = require('sbgnml-to-cytoscape');

const baseDir = '/Users/dylanfong/src/work/pc_ecosystem/path-stat/sbgn/';
const outputDir = '/Users/dylanfong/src/work/pc_ecosystem/path-stat/sbgnjson/';

const files = fs.readdirSync(baseDir);

const saveConvertedFiles = (files) => {
  for (let file of files) {
    const converted = convert(fs.readFileSync(baseDir + file, 'utf-8'));
    fs.writeFile(outputDir + file + '.json', JSON.stringify(converted, null, 2), (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

console.log(files.length);
let numEmpties = 0;

let maxNumCompartments = 0;
let minNodes = Infinity;
let maxNodes = 0;
let minEdges = Infinity;
let maxEdges = 0;

const labels = new Map();

let totalNodes = 0;
let totalEdges = 0;
let totalCompartments = 0;

const numNodeValues = [];
const numEdgeValues = [];

const histIntervals = new Map()
.set([0, 10], 0)
.set([10, 50], 0)
.set([50, 100], 0)
.set([50, 100], 0)
.set([100, 200], 0)
.set([200, 300], 0)
.set([300, 400], 0)
.set([400, 500], 0)
.set([500, 600], 0)
.set([600, 700], 0)
.set([700, 800], 0)
.set([800, 900], 0)
.set([900, 1000], 0)
.set([1000, 1100], 0)
.set([1100, 1200], 0)
.set([1200, 1300], 0)
.set([1300, 1400], 0)
.set([1400, 1500], 0)
.set([1500, 1600], 0)
.set([1600, 1700], 0)
.set([1700, 1800], 0)
.set([1800, 1900], 0)
.set([1900, 2000], 0)
.set([2000, Infinity], 0);

for (let fname of files) {
  const sbgnJSON = JSON.parse(fs.readFileSync(outputDir + fname + '.json', 'utf-8'));

  const num_nodes = sbgnJSON.nodes.length;
  const num_edges = sbgnJSON.edges.length;

  // skip empty files and record
  if (num_nodes === 0) {
    numEmpties++;
    continue;
  }

  // for (let [k, v] of histIntervals.entries()) {
  //   if (num_nodes <= k[1] && num_nodes > k[0]) {
  //     histIntervals.set(k, v + 1);
  //   }
  // }




//   // for std deviation
  numNodeValues.push(num_nodes);
//   numEdgeValues.push(num_edges);

//   // count num edges and nodes
//   totalNodes += num_nodes;
//   totalEdges += num_edges;

//   // count compartments
//   const compartments = sbgnJSON.nodes.filter((node) => node.data.class === 'compartment');
//   totalCompartments += compartments.length;

//   for (let comp of compartments) {
//     if (labels.has(comp.data.id)) {
//       labels.set(comp.data.id, labels.get(comp.data.id) + 1);
//     } else {
//       labels.set(comp.data.id, 1);
//     }
//   }

//   // find max compartments
//   if (compartments.length > maxNumCompartments) {
//     maxNumCompartments = compartments.length;
//   }

//   // find max num nodes
//   if (num_nodes > maxNodes) {
//     maxNodes = num_nodes;
//   }

//   // find min num nodes
//   if (num_nodes < minNodes) {
//     minNodes = num_nodes;
//   }

//   // find max num edges
//   if (num_edges > maxEdges) {
//     maxEdges = num_edges;
//   }

//   // find min num edges
//   if (num_edges < minEdges) {
//     minEdges = num_edges;
//   }
}


// const meanNodes = totalNodes / files.length;
// const meanEdges = totalEdges / files.length;

// const sqDiffNodes = numNodeValues.reduce((acc, val) => {
//   return acc + Math.pow(val - meanNodes, 2);
// });

// const sqDiffEdges = numEdgeValues.reduce((acc, val) => {
//   return acc + Math.pow(val - meanEdges, 2);
// });

// const stdDevNodes = Math.sqrt((sqDiffNodes) / (files.length - 1));
// const stdDevEdges = Math.sqrt((sqDiffEdges) / (files.length - 1));

console.log(`${numEmpties} files with nothing in them`);

// console.log(`average number of nodes: ${meanNodes}`);
// console.log(`average number of edges: ${meanEdges}`);
// console.log(`average number of compartments: ${totalCompartments / files.length}`);

// console.log(`largest # of compartments: ${maxNumCompartments}`);

// console.log(`max number of nodes: ${maxNodes}`);
// console.log(`min number of nodes: ${minNodes}`);

// console.log(`max number of edges: ${maxEdges}`);
// console.log(`min number of edges: ${minEdges}`);


// console.log(`std dev. nodes: ${stdDevNodes}`);
// console.log(`std dev. edges: ${stdDevEdges}`);

// const sortedKeyLabels = new Map([...labels.entries()].sort((a,b) =>  a[0]>b[0]? 1:a[0]<b[0]? -1:0));
// const sortedValueLabels = new Map([...labels.entries()].sort((a, b) => a[1]>b[1]? -1:a[1]<b[1]?1:0));

// console.log('**********************');
// console.log(`labels sorted by key: `);
// sortedKeyLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));
// console.log('**********************');
// console.log(`labels sorted by occurences: `);
// sortedValueLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));


// const topPercentile = sbgnFiles.sort((a, b) => {
//   return a.nodes.length > b.nodes.length ? -1 : a.nodes.length < b.nodes.length ? 1 : 0;
// })
// .map(f => f.nodes.length);


// console.log('top percentile: ' + JSON.stringify(topPercentile, null, 4));
// console.log('top percentile length: ' + topPercentile.length);

console.log(JSON.stringify(numNodeValues));
// console.log('hist values :');
// histIntervals.forEach((val, key, map) => console.log(`${key}: ${val}`));
