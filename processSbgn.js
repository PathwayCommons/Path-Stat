const fs = require('fs');
const convert = require('sbgnml-to-cytoscape');

const baseDir = '//Users/dylanfong/src/work/pc_ecosystem/path-stat/sbgn/';

const files = fs.readdirSync(baseDir);

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

for (let fname of files) {
  const sbgnJSON = convert(fs.readFileSync(baseDir + fname, 'utf-8'));

  const num_nodes = sbgnJSON.nodes.length;
  const num_edges = sbgnJSON.edges.length;

  // skip empty files and record
  if (num_nodes === 0) {
    numEmpties++;
    continue;
    console.log('here');
  }

  // for std deviation
  numNodeValues.push(num_nodes);
  numEdgeValues.push(num_edges);

  // count num edges and nodes
  totalNodes += num_nodes;
  totalEdges += num_edges;

  // count compartments
  const compartments = sbgnJSON.nodes.filter((node) => node.data.class === 'compartment');
  totalCompartments += compartments.length;

  for (let comp of compartments) {
    if (labels.has(comp.data.id)) {
      labels.set(comp.data.id, labels.get(comp.data.id) + 1);
    } else {
      labels.set(comp.data.id, 1);
    }
  }

  // find max compartments
  if (compartments.length > maxNumCompartments) {
    maxNumCompartments = compartments.length;
  }

  // find max num nodes
  if (num_nodes > maxNodes) {
    maxNodes = num_nodes;
  }

  // find min num nodes
  if (num_nodes < minNodes) {
    minNodes = num_nodes;
  }

  // find max num edges
  if (num_edges > maxEdges) {
    maxEdges = num_edges;
  }

  // find min num edges
  if (num_edges < minEdges) {
    minEdges = num_edges;
  }
}


const meanNodes = totalNodes / files.length;
const meanEdges = totalEdges / files.length;

const sqDiffNodes = numNodeValues.reduce((acc, val) => {
  return acc + Math.pow(val - meanNodes, 2);
});

const sqDiffEdges = numEdgeValues.reduce((acc, val) => {
  return acc + Math.pow(val - meanEdges, 2);
});

const stdDevNodes = Math.sqrt((sqDiffNodes) / (files.length - 1));
const stdDevEdges = Math.sqrt((sqDiffEdges) / (files.length - 1));

console.log(`${numEmpties} files with nothing in them`);

console.log(`average number of nodes: ${meanNodes}`);
console.log(`average number of edges: ${meanEdges}`);
console.log(`average number of compartments: ${totalCompartments / files.length}`);

console.log(`largest # of compartments: ${maxNumCompartments}`);

console.log(`max number of nodes: ${maxNodes}`);
console.log(`min number of nodes: ${minNodes}`);

console.log(`max number of edges: ${maxEdges}`);
console.log(`min number of edges: ${minEdges}`);


console.log(`std dev. nodes: ${stdDevNodes}`);
console.log(`std dev. edges: ${stdDevEdges}`);

const sortedKeyLabels = new Map([...labels.entries()].sort((a,b) =>  a[0]>b[0]? 1:a[0]<b[0]? -1:0));
const sortedValueLabels = new Map([...labels.entries()].sort((a, b) => a[1]>b[1]? -1:a[1]<b[1]?1:0));

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

