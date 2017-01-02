import d3 from "./d3.js";

d3.csv('./Zilla-Data-Analysis-Task-data.csv', undefined , (data)=> {
  plotBarGraph(data);
  plotPieGraph(data);
});

var currStudByGrades = [299, 284, 297, 322, 332, 353, 503, 175, 71, 48, 26, 29];
var schools = ["A", "B", "C", "D", "L","P","R","S","U","V"];


let plotBarGraph = (studentsData)=> {
  let unexpected = studentsData.filter((record)=> {
    return record.ExitedUnexpectedly === "Y";
  });
  console.log(unexpected.length);

  var data = byYrsAtZilla(unexpected);

  console.log(data);

  let svg = d3.select('#bar-graph').append('svg').attr('class', 'bg1')
    .attr('width', 700)
    .attr('height', 500);

  // xAxis and yAxis
  let xScale = d3.scaleLinear().domain([0.5, 5.5]).range([0, 600]);
  let yScale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([400, 0]);
  let xAxis = d3.axisBottom(xScale).ticks(5);
  let yAxis = d3.axisLeft(yScale);
  let x = svg.append('g').attr('class', 'xAxis')
          .attr('transform', "translate(50, 465)");
  let y = svg.append('g').attr('class', 'yAxis')
          .attr('transform', "translate(50, 65)");
  x.call(xAxis);
  y.call(yAxis);

  // Axes labels
  x.append('text').attr('class', 'x-label')
      .attr('x', 300)
      .attr('y', 30)
      .text('#Yrs At Zilla');
  y.append('text').attr('class', 'y-label')
      .attr('x', -150)
      .attr('y', -35)
      .attr('transform', 'rotate(-90)')
      .text('# of Students');

  // Bars
  let barsContainer = svg.append('g').attr('class', "bars")
    .attr('transform', 'translate(50, 0)');

  barsContainer.selectAll('.bar').data(data).enter()
    .append('g').append('rect')
    .attr('class', 'bar')
    .attr('x', (d, idx)=> { return xScale(idx+1)-40; })
    .attr('y', (d)=> { return yScale(d)+65; })
    .attr('width', 80)
    .attr('height', (d)=> { return 400-yScale(d); })
    .text((d)=> { return d });

  // bar labels
  barsContainer.selectAll('g').append('text')
      .attr('class', 'middle-anchored-text')
      .attr('x', (d, idx)=> { return xScale(idx+1); })
      .attr('y', (d)=> { return yScale(d)+60; })
      .text((d)=> { return d; });

  // Graph title
  svg.append('g').append('text').attr('class', 'middle-anchored-text title')
    .attr('y', 30)
    .attr('x', 350)
    .text("Unexpected Exits by Years At Zilla");

}

let byYrsAtZilla = (records)=> {
  var res = [0, 0, 0, 0, 0];
  records.forEach((rec)=> {
    if (parseInt(rec["#Yrs At Zilla"]) === 1) res[0] += 1;
    if (parseInt(rec["#Yrs At Zilla"]) === 2) res[1] += 1;
    if (parseInt(rec["#Yrs At Zilla"]) === 3) res[2] += 1;
    if (parseInt(rec["#Yrs At Zilla"]) === 4) res[3] += 1;
    if (parseInt(rec["#Yrs At Zilla"]) > 4) res[4] += 1;
  });
  return res;
}
