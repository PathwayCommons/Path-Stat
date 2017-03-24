const fs = require('fs');
const convert = require('sbgnml-to-cytoscape');

const baseDir = '/Users/dylanfong/Documents/workspace/work/pathway-commons-ecosystem/path-stat/sbgn/';

const files = fs.readdirSync(baseDir);
const sbgnFiles = files
.map(f => fs.readFileSync(baseDir + f, 'utf-8'))
.filter(f => f.startsWith('<?xml'))
.map(f => convert(f))
.filter(graphJSON => graphJSON.nodes.length !== 0);

console.log(`processing ${sbgnFiles.length} JSON pathways`);

let compartments = 0;
let maxNumCompartments = 0;
const labels = new Map();
let numNodes = 0;
let numEdges = 0;


for (let sbgnJSON of sbgnFiles) {
  const c = sbgnJSON.nodes.filter((node) => node.data.class === 'compartment');
  for (let comp of c) {

    // console.log(c);
    if (labels.has(comp.data.id)) {
      labels.set(comp.data.id, labels.get(comp.data.id) + 1);
    } else {
      labels.set(comp.data.id, 1);
    }
  }
  if (c.length > maxNumCompartments) {
    maxNumCompartments = c.length;
  }
  compartments += c.length;
  numNodes += sbgnJSON.nodes.length;
  numEdges += sbgnJSON.edges.length;
}

const sortedKeyLabels = new Map([...labels.entries()].sort((a,b) =>  a[1]>b[1]? -1:a[1]<b[1]?1:0));
// const sortedValueLabels = [...labels.entries()].sort((a, b) => a.value[1] > b.value[1]);


console.log(`average number of compartments: ${compartments / sbgnFiles.length}`);
console.log(`largest # of compartments: ${maxNumCompartments}`);

console.log(`average number of nodes: ${numNodes / sbgnFiles.length}`);
console.log(`average number of edges: ${numEdges / sbgnFiles.length}`);
console.log(`labels: `);
sortedKeyLabels.forEach((val, key, map) => console.log(`m[${key}] = ${val}`));
// console.log()


