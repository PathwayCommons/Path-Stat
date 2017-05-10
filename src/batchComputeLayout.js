const fs = require('fs');
const path = require('path');

// const cytosnap = require('cytosnap');
// const SBGNRenderer = require('sbgn-renderer');
// const coseBilkent = require('cytoscape-cose-bilkent');

// coseBilkent( SBGNRenderer.__proto__ );


const baseDir = path.resolve('.');           // make it a command line opt
const sbgnDir = baseDir + '/sbgn/';          // make it a command line opt
const sbgnJSONDir = baseDir + '/sbgnjson/';  // make it a command line opt
const coseTransformDir = baseDir + '/cose_bilkent_transform/';

// const files = fs.readdirSync(sbgnDir);

// const renderer = new SBGNRenderer();

// const snap = cytosnap();

// for (let fname of files) {
//   const sbgnJSON = JSON.parse(fs.readFileSync(sbgnJSONDir + fname + '.json', 'utf-8'));
//   console.log(sbgnJSON);
//   const num_nodes = sbgnJSON.nodes.length;
//   // skip empty files and record
//   if (num_nodes === 0) {
//     continue;
//   }

//   if (num_nodes < 350) {
//     continue;
//   }

//   // renderer.remove('*');
//   // renderer.add(sbgnJSON);
//   // renderer.layout({
//   //   name: 'grid',
//   //   stop: function () {
//   //     fs.writeFile(coseTransformDir + fname + '.json', renderer.json(), (err) => {
//   //       if (err) throw err;
//   //     });
//   //   }
//   // });

//   snap.start().then(function(){
//     return snap.shot({
//       elements: sbgnJSON,
//       layout: {
//         name: 'grid',
//       },
//       resolvesTo: 'json'
//     });
//   }).then(function(img) {
//     console.log(img);
//     fs.writeFile(coseTransformDir + fname + '.json', img, (err) => {
//       if (err) throw err;
//     });
//   });

// }

var cytosnap = require('cytosnap');
var snap = cytosnap();

snap.start().then(function(){
  return snap.shot({
    elements: [ // http://js.cytoscape.org/#notation/elements-json
      { data: { id: 'foo' } },
      { data: { id: 'bar' } },
      { data: { source: 'foo', target: 'bar' } }
    ],
    layout: { // http://js.cytoscape.org/#init-opts/layout
      name: 'grid'
    },
    style: [ // http://js.cytoscape.org/#style
      {
        selector: 'node',
        style: {
          'background-color': 'red'
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': 'red'
        }
      }
    ],
    resolvesTo: 'base64uri',
    format: 'png',
    width: 640,
    height: 480,
    background: 'transparent'
  });
}).then(function( img ){
  // do whatever you want with img
  fs.writeFile(coseTransformDir  + '1.png', img, (err) => {
    if (err) throw err;
  });

  console.log( img );
  snap.stop();
});


