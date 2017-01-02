import { select, selectAll } from 'd3-selection';
import { arc, pie } from 'd3-shape';
import { csv } from 'd3-request';
import * as collection from 'd3-collection';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { min, max } from 'd3-array';

export default {
  select: select,
  selectAll: selectAll,
  csv: csv,
  arc: arc,
  pie: pie,
  collection: collection,
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  axisBottom: axisBottom,
  axisLeft: axisLeft,
  min: min,
  max: max,
  schemeAccent: schemeAccent
}
