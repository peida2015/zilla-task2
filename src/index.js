import d3 from "./d3.js";

d3.csv('./Zilla-Data-Analysis-Task-data.csv', undefined , (data)=> {
  plotBarGraph(data);
  plotPieGraph(data);
});

var currStudByGrades = [299, 284, 297, 322, 332, 353, 503, 175, 71, 48, 26, 29];
var schools = ["A", "B", "C", "D", "L","P","R","S","U","V"];


let plotPieGraph = (studentsData)=> {
  // Not exited unexpectedly but not still enrolled
  let shortStays = studentsData.filter((record)=> {
    return record.ExitedUnexpectedly === "N" && record["Still Enrolled"] === "N"
  });

  let shortStaysByYrsAtZilla = byYrsAtZilla(shortStays);
  let sum = shortStays.length;

  let svg = d3.select('#pie-graph').append('svg').attr('class', 'pg1')
    .attr('width', 700)
    .attr('height', 500);

  let colors = d3.schemeAccent;

  let pie = d3.pie()(shortStaysByYrsAtZilla);
  let piegraph = svg.append('g').attr('class', 'pie')
                  .attr('transform', "translate(430, 275)");
  let d3arc = d3.arc().innerRadius(0).outerRadius(200);
  let slices = piegraph.selectAll('.slice').data(pie).enter().append('g')
          .attr('class', 'slice');
  slices.append('path')
          .attr('d', (d)=> { return d3arc(d); })
          .attr('fill', (d, idx)=> { return colors[idx]; });

  // Pie slices labels
  d3arc.outerRadius(300);
  slices.append('text').attr('class', 'middle-anchored-text')
  .attr('transform', (d)=> {
    let center = d3arc.centroid(d);
    return "translate("+center+")";
  })
  .html((d)=>{
    return "<tspan>"+d.data+"</tspan>"+"<tspan x=0px dy=20px>("+Math.round(d.data/sum*100, -3)+"%)</tspan>"});

  // Pie graph legend
  let legendsWrap = svg.append('g').attr('class', 'legend')
                .attr('transform', 'translate(30, 90)');
  let legendWraps = legendsWrap.selectAll('.chart-key').data(shortStaysByYrsAtZilla).enter()
          .append('g').attr('class', 'chart-key');
  legendWraps.append('rect').attr('width', 20).attr('height', 20)
          .attr('x', 0).attr('y', (d, idx)=> { return 30*(idx+1); })
          .attr('fill', (d, idx)=>{ return colors[idx]; });
  legendWraps.append('text')
          .attr('x', 30).attr('dy', (d, idx)=> { return 30*(idx+1)+15; })
          .text((d, idx)=>{ return idx+1 < 5 ? idx+1 : "5+"; });


  // Legend title
  legendsWrap.append('text').attr('y', 10).text('#Yrs At Zilla');

  // Pie graph title
  svg.append('g').append('text').attr('class', 'middle-anchored-text title')
    .attr('y', 30)
    .attr('x', 350)
    .text("Students Not Still Enrolled by Years At Zilla");

}


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
