var Promise = require('bluebird');
var lodash = require('lodash');
var fs = require('fs');
var fsp = require('fs-promise');
var fetch = require('node-fetch');
fetch.Promise = Promise;

var sbgnConverter = require('sbgnml-to-cytoscape');

var baseUrlSearch = 'http://beta.pathwaycommons.org/pc2/search.json?q=*&type=pathway';
var baseUrlGet = 'http://beta.pathwaycommons.org/pc2/get?format=sbgn&uri=';

var getNumPages = fetch(baseUrlSearch)
  .then(result => result.json())
  .then(resultObj => {
    return Math.floor((resultObj.numHits - 1) / resultObj.maxHitsPerPage) + 1;
  });

function fetchSearch(baseUrl, pageNumber) {
  // Some code taken from fetch-retry
  return new Promise(function(resolve, reject) {
    var wrappedFetch = function(n) {
      if (n >= 0) {
        fetch(baseUrlSearch + '&page=' + pageNumber)
          .then(res => res.json())
          .then(searchObj => {
            if (typeof searchObj === 'object') {
              return searchObj.searchHit;
            } else {
              throw new Error();
            }
          })
          .then(resolvable => resolve(resolvable))
          .catch((e) => {
            wrappedFetch(--n);
          });
      }
    };
    wrappedFetch(5);
  });
}
function fetchGet(uri) {
  // Some code taken from fetch-retry
  return new Promise(function(resolve, reject) {
    var wrappedFetch = function(n) {
      if (n >= 0) {
        fetch(baseUrlGet + uri)
          .then(res => res.text())
          .then(searchStr => {
            return sbgnConverter(searchStr);
          })
          .then(resolvable => resolve(resolvable))
          .catch((e) => {
            wrappedFetch(--n);
          });
      }
    };
    wrappedFetch(5);
  });
}
var pathway_array = getNumPages
  .then(numPages => {
    return Array(numPages).fill(0).map(function(x, i) {
      return i;
    });
  })
  .map(pageNumber => {
    return fetchSearch(baseUrlSearch, pageNumber);
  }, {
    concurrency: 6
  })
  .then(arrayList => {
    var output = [];
    for (var i = 0; i < arrayList.length; i++) {
      output = output.concat(arrayList[i]);
    }
    console.log(output);
    return output;
  })
  .catch((e) => console.log(e));

// Use pathway_array to generate object where the key are pathways and the values are number of referenced symbols
var pathway_list = pathway_array.then(pathwayObject => {
  return pathwayObject.map(pathway => {
    return lodash.pick(pathway, ['name', 'size', 'dataSource']);
  });
});

// Use pathway_array to generate object where the key are pathways and the values are number of referenced symbols
var uri_list = pathway_array.then(pathwayObject => {
     return pathwayObject.map(pathway => {
     return lodash.pick(pathway, ['uri']);
   });
  })
  .map(uri => {
    console.log(uri);
    return fetchGet(uri.uri).then( jsonData => {
    console.log('START');
    console.log(jsonData);
    return {
      numNodes: jsonData.nodes.length,
      numEdges: jsonData.edges.length,
      numClassCompartment: jsonData.map(node => node.data.class === 'compartment' ? 1 : 0).reduce((acc, cur) => acc + cur),
      compartmentLabels: jsonData.map(node => node.data.class === 'compartment' ? node.data.label : null),
      numChildNodes: jsonData.map(node => node.data.parent !== '' ? 1 : 0).reduce((acc, cur) => acc + cur)
    };
  })}, {
    concurrency: 12
  });

Promise.all([pathway_array, pathway_list]).then(promiseArray => {
  console.log('');
  console.log('Processing completed');
  console.log(Object.keys(promiseArray[1]).length + ' pathways found');
  console.log('');
});

function writeToFile(file_name, output) {
  var path = __dirname + '/output/' + file_name;
  try {
    fs.mkdirSync(__dirname + '/output');
  } catch (e) {}
  fsp.remove(path + '.min.json').then(() => {
    fsp.writeFile(path + '.min.json', JSON.stringify(output));
  });
  fsp.remove(path + '.json').then(() => {
    fsp.writeFile(path + '.json', JSON.stringify(output, null, 2));
  });
}

// Write pathway_array to file
pathway_array.then(output => {
  var file_name = "pathway_array";
  writeToFile(file_name, output);
});

// Write pathway_weighted to file
pathway_list.then(output => {
  var file_name = "pathway_list";
  writeToFile(file_name, output);
});
