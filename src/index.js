import d3 from "./d3.js";

d3.csv('./Zilla-Data-Analysis-Task-data.csv', undefined , (data)=> {
  plotPieGraph(data);
});

var currStudByGrades = [299, 284, 297, 322, 332, 353, 503, 175, 71, 48, 26, 29];
var schools = ["A", "B", "C", "D", "L","P","R","S","U","V"];

let drawTable = ()=> {
  // Title
  d3.select('#table').append('h3').text("2006-2007 Enrollment and 2005-2006 Attrition By Grades")

  let data = [  { attrition: 23, enrollment: 284, newEnroll: 34  },
                { attrition: 34, enrollment: 297, newEnroll: 44  },
                { attrition: 28, enrollment: 322, newEnroll: 65  },
                { attrition: 26, enrollment: 332, newEnroll: 84  },
                { attrition: 31, enrollment: 353, newEnroll: 104 },
                { attrition: 74, enrollment: 503, newEnroll: 268 }  ];

  let tblDIV = d3.select("#table").append('table').attr('class', 'rel-center');

  let columns = ["06-07 Grade", "06-07 New Enrollment", "07-08 Enrollment", "06-07 Unexpected Exits"];

  tblDIV.append('tr').selectAll('.heading').data(columns).enter()
      .append('th').attr('class', '.heading')
      .text((d)=>{ return d; });

  let rows = tblDIV.selectAll(".grade").data(data).enter()
      .append('tr').attr('class', 'grade');

  rows.append('td').text((d, idx)=> { return idx+1; });
  rows.append('td').text((d)=> { return d.newEnroll; });
  rows.append('td').text((d)=> { return d.enrollment; });
  rows.append('td').text((d)=> { return d.attrition; });
}

let drawTable2 = ()=> {
  // Title
  d3.select('#table2').append('h3').text("Elementary and Middle School Average Attritions By School Year")

  let data = [  { elementary: 25, middle: 14.3  },
                { elementary: 24, middle: 38.3  },
                { elementary: 37.6, middle: 56.3  },
                { elementary: 27.4, middle: 38  },
                { elementary: 28.4, middle: 49.7  }  ];

  let tblDIV = d3.select("#table2").append('table').attr('class', 'rel-center');

  let columns = ["School Year", "Elementary", "Middle"];

  tblDIV.append('tr').selectAll('.heading').data(columns).enter()
      .append('th').attr('class', '.heading')
      .text((d)=>{ return d; });

  let rows = tblDIV.selectAll(".grade").data(data).enter()
      .append('tr').attr('class', 'grade');

  rows.append('td').text((d, idx)=> { return idx+2002 + "-" + (idx+1+2002); });
  rows.append('td').text((d)=> { return d.elementary; });
  rows.append('td').text((d)=> { return d.middle; });
}

drawTable();
drawTable2();

let plotPieGraph = (studentsData)=> {
  // Exited unexpectedly but not still enrolled
  let unexpExits = studentsData.filter((record)=> {
    return record.ExitedUnexpectedly === "Y";
  });

  let unexpExitsByYrsAtZilla = byYrsAtZilla(unexpExits);
  let sum = unexpExits.length;

  let svg = d3.select('#pie-graph').append('svg').attr('class', 'pg1')
    .attr('width', 700)
    .attr('height', 500);

  let colors = d3.schemeAccent;

  let pie = d3.pie()(unexpExitsByYrsAtZilla);
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
  let legendWraps = legendsWrap.selectAll('.chart-key').data(unexpExitsByYrsAtZilla).enter()
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
