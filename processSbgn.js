const fs = require('fs');
const convert = require('sbgnml-to-cytoscape');

const baseDir = '/Users/dylanfong/Documents/workspace/work/pathway-commons-ecosystem/path-stat/sbgn/';

const files = fs.readdirSync(baseDir);
let sbgnFiles = files
.map(f => fs.readFileSync(baseDir + f, 'utf-8'))
.filter(f => f.startsWith('<?xml'))
.map(f => convert(f));

const empties = sbgnFiles.filter(graphJSON => graphJSON.nodes.length === 0);
sbgnFiles = sbgnFiles.filter(graphJSON => graphJSON.nodes.length !== 0);

console.log(`${empties.length} files with nothing in them`);
console.log(`processing ${sbgnFiles.length} JSON pathways`);

let compartments = 0;
let maxNumCompartments = 0;
let minNodes = 10000000000000;
let maxNodes = 0;
let minEdges = 1000000000000;
let maxEdges = 0;
const labels = new Map();
let numNodes = 0;
let numEdges = 0;

for (let meansJSON of sbgnFiles) {
  numNodes += meansJSON.nodes.length;
  numEdges += meansJSON.edges.length;
}

const meanNodes = numNodes / sbgnFiles.length;
const meanEdges = numEdges / sbgnFiles.length;

let sqDiffNodes = 0;
let sqDiffEdges = 0;

for (let sbgnJSON of sbgnFiles) {
  const c = sbgnJSON.nodes.filter((node) => node.data.class === 'compartment');
  for (let comp of c) {
    if (labels.has(comp.data.id)) {
      labels.set(comp.data.id, labels.get(comp.data.id) + 1);
    } else {
      labels.set(comp.data.id, 1);
    }
  }
  if (c.length > maxNumCompartments) {
    maxNumCompartments = c.length;
  }

  if (sbgnJSON.nodes.length > maxNodes) {
    maxNodes = sbgnJSON.nodes.length;
  }
  if (sbgnJSON.nodes.length < minNodes) {
    minNodes =sbgnJSON.nodes.length;
  }

  if (sbgnJSON.edges.length > maxEdges) {
    maxEdges = sbgnJSON.edges.length;
  }
  if (sbgnJSON.edges.length < minEdges) {
    minEdges = sbgnJSON.edges.length;
  }
  compartments += c.length;

  sqDiffNodes += Math.pow(sbgnJSON.nodes.length - meanNodes, 2);
  sqDiffEdges += Math.pow(sbgnJSON.edges.length - meanEdges, 2);
}


const sigmaNodes = Math.sqrt((sqDiffNodes) / (sbgnFiles.length - 1));
const sigmaEdges = Math.sqrt((sqDiffEdges) / (sbgnFiles.length - 1));

const topPercentile = sbgnFiles.sort((a, b) => {
  return a.nodes.length > b.nodes.length ? -1 : a.nodes.length < b.nodes.length ? 1 : 0;
})
.map(f => f.nodes.length);

const sortedKeyLabels = new Map([...labels.entries()].sort((a,b) =>  a[0]>b[0]? 1:a[0]<b[0]? -1:0));
const sortedValueLabels = new Map([...labels.entries()].sort((a, b) => a[1]>b[1]? -1:a[1]<b[1]?1:0));


console.log(`average number of compartments: ${compartments / sbgnFiles.length}`);
console.log(`largest # of compartments: ${maxNumCompartments}`);

console.log(`max number of nodes: ${maxNodes}`);
console.log(`min number of nodes: ${minNodes}`);

console.log(`max number of edges: ${maxEdges}`);
console.log(`min number of edges: ${minEdges}`);

console.log(`std dev. nodes: ${sigmaNodes}`);
console.log(`std dev. edges: ${sigmaEdges}`);


console.log(`average number of nodes: ${meanNodes}`);
console.log(`average number of edges: ${meanEdges}`);
console.log(`labels sorted by key: `);
sortedKeyLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));
console.log(`labels sorted by occurences: `);
sortedValueLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));

console.log('top percentile: ' + JSON.stringify(topPercentile, null, 4));
console.log('top percentile length: ' + topPercentile.length);

