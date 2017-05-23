const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');
const cytosnap = require('cytosnap');

const baseDir = path.resolve('.');           // make it a command line opt
const sbgnDir = baseDir + '/sbgn/';          // make it a command line opt
const sbgnJSONDir = baseDir + '/sbgnjson/';  // make it a command line opt
const coseTransformDir = baseDir + '/cose_bilkent_transform/';

const files = fs.readdirSync(sbgnDir).filter((file) => file !== '.DS_Store');

const snap = cytosnap();


const processFile = (json) => {
  return new Promise((resolve, reject) => {
    return snap.shot({
      elements: json,
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
    })
    .then((img) => {
      // do whatever you want with img
      console.log(img);
      resolve(img);
    })
    .catch((e) => {
      reject(e);
    });
  });
};

snap.start().then(function () {
  const processedImgs = files.map((f) => {
    const json = JSON.parse(fs.readFileSync(sbgnJSONDir + f + '.json',  'utf-8'));
    return processFile(json);
  });

  // Promise.all(processedImgs)
  // .then(function(out) {
  //   console.log(out);
  //   snap.stop();
  // });
  // const json = JSON.parse(fs.readFileSync(sbgnJSONDir + files[0] + '.json', 'utf-8'));
  // const result = processFile(json);
  // result.then((output) => {
  //   console.log(output);
  //   snap.stop();
  // });
});

