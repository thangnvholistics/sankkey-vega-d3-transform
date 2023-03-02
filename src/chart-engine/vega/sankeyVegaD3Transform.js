import { Transform } from 'vega-dataflow';
import { inherits } from 'vega-util';
import { sankey } from 'd3-sankey';

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

var prototype = inherits(Sankey, Transform);

var defaultExtent = [[-1e5, -1e5], [1e5, 1e5]];

prototype.transform = function (_, pulse) {
  console.log(_);
  console.log(pulse);
  debugger;

  
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
