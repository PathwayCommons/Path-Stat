const fs = require('fs');
const convert = require('sbgnml-to-cytoscape');

const sbgn2JSON = (files, inputDir, outputDir) => {
  for (let file of files) {
    const converted = convert(fs.readFileSync(inputDir + file, 'utf-8'));
    fs.writeFile(outputDir + file + '.json', JSON.stringify(converted, null, 2), (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

module.exports = {
  sbgn2JSON: sbgn2JSON
};