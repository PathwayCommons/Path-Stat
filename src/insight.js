// num compartments
// num nodes
// num edges
// num multimers
// associate with filename
// num of <sbgn class>
// num of aux items
// num empty files


// mean nodes
// mean edges
// stddev nodes
// stddev edges


// compartment labels
// sorted by val
// sorted by id


// top percentiles


// histogram

const nodeInfoSet = new Set()
.add('compartment').add('complex').add('simple chemical')
.add('macomolecule').add('nucleic acid feature').add('perturbing agent');

const nodeStateSet = new Set()
.add('complex').add('macomolecule').add('nucleic acid feature');


const isEmpty = (sbgnJSON) => sbgnJSON.nodes.length === 0;

const canHaveState = (node) => nodeStateSet.has(node.data.class);

const canHaveUInfo = (node) => nodeInfoSet.has(node.data.class);

const processNodes = (sbgnJSON) => {
  const ret = {
    numCompartments: 0,
    numMultimers: 0,
    numInfos: 0,
    numStates: 0,

    numNodesThatCanHaveState: 0,
    numNodesThatHaveState: 0,

    numNodesThatCanHaveUInfo: 0,
    numNodesThatHaveUInfo: 0
  };

  if (sbgnJSON.nodes.length === 0) {
    return ret;
  }

  let numCompartments = 0;
  let numMultimers = 0;
  let numInfos = 0;
  let numStates = 0;

  let numNodesThatCanHaveState = 0;
  let numNodesThatHaveState = 0;

  let numNodesThatCanHaveUInfo = 0;
  let numNodesThatHaveUInfo = 0;

  for (let node of sbgnJSON.nodes) {
    if (node.data.class === 'compartment') {
      numCompartments++;
    }
    if (node.data.class.includes('multimer')) {
      numMultimers++;
    }
    if (canHaveState(node)) {
      numNodesThatCanHaveState++;
      if (node.data.stateVariables.length > 0) {
        numNodesThatHaveState++;
      }
      numStates += node.data.stateVariables.length;
    }

    if (canHaveUInfo(node)) {
      numNodesThatCanHaveUInfo++;
      if (node.data.unitsOfInformation.length > 0) {
        numNodesThatHaveUInfo++;
      }
      numInfos += node.data.unitsOfInformation.length;
    }
  }
  return {
    numCompartments: numCompartments,
    numMultimers: numMultimers,
    numInfos: numInfos,
    numStates: numStates,

    numNodesThatCanHaveState: numNodesThatCanHaveState,
    numNodesThatHaveState: numNodesThatHaveState,

    numNodesThatCanHaveUInfo: numNodesThatCanHaveUInfo,
    numNodesThatHaveUInfo: numNodesThatHaveUInfo
  };
};

const processEdges = (sbgnJSON) => {
  return {};
};

const extractInsight = (sbgnJSON) => {
  const nodeInsight = processNodes(sbgnJSON);
  const edgeInsight = processEdges(sbgnJSON);
  return {
    numNodes: sbgnJSON.nodes.length,
    numEdges: sbgnJSON.edges.length,
    numCompartments: nodeInsight.numCompartments,
    numMultimers: nodeInsight.numMultimers,
    numInfos: nodeInsight.numInfos,
    numStates: nodeInsight.numStates,

    numNodesThatCanHaveState: nodeInsight.numNodesThatCanHaveState,
    numNodesThatHaveState: nodeInsight.numNodesThatHaveState,

    numNodesThatCanHaveUInfo: nodeInsight.numNodesThatCanHaveUInfo,
    numNodesThatHaveUInfo: nodeInsight.numNodesThatHaveUInfo
  };
};

module.exports = extractInsight;