import { Transform } from 'vega-dataflow';
import { inherits } from 'vega-util';
import * as d3Sankey from "d3-sankey";

// export default function Sankey(params) {
//   Transform.call(this, null, params);
// }

const Sankey = function (params) {
  Transform.call(this, null, params);
}

Sankey.Definition = {
  "type": "Sankey",
  "metadata": { "modifies": true },
  "params": [
    { "name": "source", "type": "field", "required": true },
    { "name": "target", "type": "field", "required": true },
    { "name": "volume", "type": "field", "required": true },
  ]
};

const output = ["index", "source", "target", "value", "width", "y0", "y1"];

const prototype = inherits(Sankey, Transform);

const defaultExtent = [[-1e5, -1e5], [1e5, 1e5]];

prototype.transform = function (_, pulse) {
  console.log(_);
  console.log(pulse);

  const data = pulse.source;

  let sourceNodes;
  let targetNodes;
  let sankeyLinks;

  if (_.source.fname.includes("datum.") || _.target.fname.includes("datum.")) {
    const datumTable = data && data.map(x => ({ datum: x }));
    sourceNodes = datumTable.map(_.source);
    targetNodes = datumTable.map(_.target);
    sankeyLinks = datumTable.map(x => ({ source: _.source(x), target: _.target(x), value: _.volume(x) }));
  } else {
    sourceNodes = data.map(_.source);
    targetNodes = data.map(_.target);
    sankeyLinks = data.map(x => ({ source: _.source(x), target: _.target(x), value: _.volume(x) }));
  }

  sourceNodes = sourceNodes.map(x => x ? x.trim().replace(/\s+/g, ' ') : x);
  targetNodes = targetNodes.map(x => x ? x.trim().replace(/\s+/g, ' ') : x);
  sankeyLinks.forEach(x => {
    x && x.source && x.source.trim().replace(/\s+/g, ' ');
    x && x.target && x.target.trim().replace(/\s+/g, ' ');
  });

  let uniqueNodes = [];
  (() => {
    let uniqueSet = [];
    let xLower;
    sourceNodes.forEach(x => {
      x
        && (xLower = x.toLowerCase()) && !uniqueSet.includes(xLower)
        && uniqueSet.push(xLower) && uniqueNodes.push({ id: x });
    });
    targetNodes.forEach(x => {
      x
        && (xLower = x.toLowerCase()) && !uniqueSet.includes(xLower)
        && uniqueSet.push(xLower) && uniqueNodes.push({ id: x });
    });
  })();

  let nodeAlign = "justify"; // Sankey node alignment strategy: left, right, justify, center
  let nodeWidth = 15; // width of node rects
  let nodePadding = 10; // vertical separation between adjacent nodes

  let marginTop = 5; // top margin, in pixels
  let marginRight = 1; // right margin, in pixels
  let marginBottom = 5; // bottom margin, in pixels
  let marginLeft = 1; // left margin, in pixels

  let width = 1000; // outer width, in pixels
  let height = 600; // outer height, in pixels

  // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
  if (typeof nodeAlign !== "function") nodeAlign = {
    left: d3Sankey.sankeyLeft,
    right: d3Sankey.sankeyRight,
    center: d3Sankey.sankeyCenter
  }[nodeAlign] ?? d3Sankey.sankeyJustify;

  d3Sankey.sankey()
    .nodeId(({ index: i }) => uniqueNodes[i].id)
    .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
    ({ nodes: uniqueNodes, links: sankeyLinks });

  for (let i = 0; i < data.length; ++i) {
    let originalItem = data[i];
    let sankeyLink = sankeyLinks[i];
    originalItem[output[0]] = sankeyLink["index"];
    originalItem[output[1]] = sankeyLink["source"];
    originalItem[output[2]] = sankeyLink["target"];
    originalItem[output[3]] = sankeyLink["value"];
    originalItem[output[4]] = sankeyLink["width"];
    originalItem[output[5]] = sankeyLink["y0"];
    originalItem[output[6]] = sankeyLink["y1"];
  }

  return pulse.reflow(_.modified()).modifies(output);
  // var as = _.as || 'path',
  //   data = pulse.source,
  //   diagram, polygons, i, n;

  // // configure and construct sankey diagram
  // diagram = sankey().x(_.x).y(_.y);
  // if (_.size) diagram.size(_.size);
  // else diagram.extent(_.extent || defaultExtent);

  // this.value = (diagram = diagram(data));

  // // map polygons to paths
  // polygons = diagram.polygons();
  // for (i = 0, n = data.length; i < n; ++i) {
  //   data[i][as] = polygons[i]
  //     ? 'M' + polygons[i].join('L') + 'Z'
  //     : null;
  // }

  // return pulse.reflow(_.modified()).modifies(as);
};

export { Sankey }
