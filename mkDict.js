var Promise = require("bluebird");
var lodash = require('lodash');
var fs = require('fs');
var fsp = require('fs-promise');
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var fetch = require('node-fetch');
fetch.Promise = Promise;

console.log("Begin download ...");
console.log("");

var baseUrl = "http://beta.pathwaycommons.org/pc2/search.json?q=*&type=pathway";
var numPagesToFetch = fetch(baseUrl)
  .then(res => res.json())
  .then(resObj => {
    var numHitsTotal = resObj.numHits;
    var hitsPerPage = resObj.maxHitsPerPage;
    var numPages = Math.floor((numHitsTotal - 1) / hitsPerPage) + 1;
    return numPages;
  });

function fetchSearch(baseUrl, pageNumber) {
  // Some code taken from fetch-retry
  return new Promise(function(resolve, reject) {
    var wrappedFetch = function(n) {
      if (n >= 0) {
        fetch(baseUrl + "&page=" + pageNumber)
          .then(res => res.json())
          .then(searchObj => {
            if (typeof searchObj === "object") {
              return searchObj.searchHit;
            } else {
              throw new Error();
            }
          })
          .then(resolvable => resolve(resolvable))
          .catch((e) => {
            console.log(e.message);
            wrappedFetch(--n);
          });
      }
    }
    wrappedFetch(5);
  });
}

var pathway_array = numPagesToFetch
  .then(numPages => {
    return Array(numPages).fill(0).map(function(x, i) {
      return i
    });
  })
  .map(pageNumber => {
    console.log(pageNumber);
    return fetchSearch(baseUrl, pageNumber);
  }, {
    concurrency: 6
  })
  .then(arrayList => {
    output = [];
    for (var i = 0; i < arrayList.length; i++) {
      output = output.concat(arrayList[i]);
    }
    return output;
  })
  .catch((e) => console.log(e));

// Use pathway_array to generate object where the key are pathways and the values are number of referenced symbols
var pathway_list = pathway_array.then(pathwayObject => {
  return pathwayObject.map(pathway => {
    return lodash.pick(pathway, ["name", "size", "dataSource"]);
  });
});

Promise.all([pathway_array, pathway_list]).then(promiseArray => {
  console.log("");
  console.log("Processing completed")
  console.log(Object.keys(promiseArray[1]).length + " pathways found");
  console.log("");
});

function writeToFile(file_name, output) {
  var path = __dirname + "/output/" + file_name;
  try {
    fs.mkdirSync(__dirname + "/output");
  } catch (e) {}
  fsp.remove(path + ".min.json").then(() => {
    fsp.writeFile(path + ".min.json", JSON.stringify(output));
  });
  fsp.remove(path + ".json").then(() => {
    fsp.writeFile(path + ".json", JSON.stringify(output, null, 2));
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
