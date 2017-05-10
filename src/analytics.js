const fs = require('fs');
const path = require('path');

const SBGNRenderer = require('sbgn-renderer');
const coseBilkent = require('cytoscape-cose-bilkent');

coseBilkent( SBGNRenderer.__proto__ );

const util = require('./util');

const baseDir = path.resolve('.');           // make it a command line opt
const sbgnDir = baseDir + '/sbgn/';          // make it a command line opt
const sbgnJSONDir = baseDir + '/sbgnjson/';  // make it a command line opt

const files = fs.readdirSync(sbgnDir);

const cy = new SBGNRenderer();

// TODO: make opts be accepted by command line or config
const opts = {

};

if (opts.sbgn2JSON) {
  util.sbgn2JSON(files, sbgnDir, sbgnJSONDir);
}


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
let totalMultimers = 0;
let totalInfos = 0;
let totalStates = 0;

let nodesThatCanHaveInfos = 0;
let nodesThatCanHaveStates = 0;

const numNodeValues = [];
const numEdgeValues = [];

const nodesWithFileName = [];

let cleanNumNodeValues = [];

const nodeInfoSet = new Set()
.add('compartment').add('complex').add('simple chemical')
.add('macomolecule').add('nucleic acid feature').add('perturbing agent');

const nodeStateSet = new Set()
.add('complex').add('macomolecule').add('nucleic acid feature');


for (let fname of files) {
  const sbgnJSON = JSON.parse(fs.readFileSync(sbgnJSONDir + fname + '.json', 'utf-8'));

  const num_nodes = sbgnJSON.nodes.length;
  const num_edges = sbgnJSON.edges.length;

  // skip empty files and record
  if (num_nodes === 0) {
    numEmpties++;
    continue;
  }

  if (num_nodes < 350) {
    continue;
  }

  // cy.remove('*');
  // cy.add(sbgnJSON);
//   const compartmentChildren = cy.nodes('[class="compartment"]').children();
//   compartmentChildren.filterFn((ele) => ele.neighborhood().length === 0).remove();

//   const danglingNodes = cy.nodes('[class != "compartment"], [class != "complex"], [class != "complex multimer"]');
//   danglingNodes.filterFn((ele) => !ele.isChild() && ele.neighborhood.length === 0).remove();

//   cy.nodes('[class="complex"]').children().remove();
//   cleanNumNodeValues.push(cy.nodes().size());



//   totalMultimers += sbgnJSON.nodes.filter((node) => {
//     return node.data.class.includes('multimer');
//   }).length;

//   const nodesWithInfo = sbgnJSON.nodes.filter((node) => {
//     return nodeInfoSet.has(node.data.class);
//   });

//   const nodesWithState = sbgnJSON.nodes.filter((node) => {
//     return nodeStateSet.has(node.data.class);
//   });

//   nodesThatCanHaveInfos += nodesWithInfo.length;
//   nodesThatCanHaveStates += nodesWithState.length;

//   totalStates += nodesWithState.reduce( (acc, cur) => cur.data.stateVariables.length + acc, 0);
//   totalInfos += nodesWithInfo.reduce( (acc, cur) => cur.data.unitsOfInformation.length + acc, 0);
//   // for (let [k, v] of histIntervals.entries()) {
//   //   if (num_nodes <= k[1] && num_nodes > k[0]) {
//   //     histIntervals.set(k, v + 1);
//   //   }
//   // }

//   // for std deviation
  numNodeValues.push(num_nodes);
//   numEdgeValues.push(num_edges);

  nodesWithFileName.push(fname);



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

// console.log(`${numEmpties} files with nothing in them`);

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

// console.log(`total number of multimers: ${totalMultimers}`);


// console.log(`total number of units of information: ${totalInfos}`);
// console.log(`total number of state variables: ${totalStates}`);

// console.log(`total number of nodes that can have units of information: ${nodesThatCanHaveInfos}`);
// console.log(`total number of nodes that can have state variables: ${nodesThatCanHaveStates}`);

// console.log(`average num of state variables for nodes that can have it: ${totalStates / nodesThatCanHaveStates}`);
// console.log(`average num of units of information for nodes that can have it: ${totalInfos / nodesThatCanHaveInfos}`);

// const sortedKeyLabels = new Map([...labels.entries()].sort((a,b) =>  a[0]>b[0]? 1:a[0]<b[0]? -1:0));
// const sortedValueLabels = new Map([...labels.entries()].sort((a, b) => a[1]>b[1]? -1:a[1]<b[1]?1:0));
//
// console.log('**********************');
// console.log(`labels sorted by key: `);
// sortedKeyLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));
// console.log('**********************');
// console.log(`labels sorted by occurences: `);
// sortedValueLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));

//
// const topPercentile = sbgnFiles.sort((a, b) => {
//   return a.nodes.length > b.nodes.length ? -1 : a.nodes.length < b.nodes.length ? 1 : 0;
// })
// .map(f => f.nodes.length);


// console.log('top percentile: ' + JSON.stringify(topPercentile, null, 4));
// console.log('top percentile length: ' + topPercentile.length);
// console.log(JSON.stringify(numNodeValues));
console.log(JSON.stringify(nodesWithFileName));
console.log(nodesWithFileName.length);

// console.log(JSON.stringify(cleanNumNodeValues));

// console.log(nodesWithFileName.length);
// console.log(JSON.stringify(nodesWithFileName.sort((a, b) => b[1] - a[1]), null, 4));


// console.log('hist values :');
// histIntervals.forEach((val, key, map) => console.log(`${key}: ${val}`));
