import * as vega from 'vega';
import { Voronoi } from './voronoiVegaD3Transform.js';
import { Sankey } from './sankeyVegaD3Transform.js';

vega.transforms.voronoi = Voronoi;
vega.transforms.sankey = Sankey;

export { vega }
