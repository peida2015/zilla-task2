import d3 from "./d3.js";

d3.csv('./Zilla-Data-Analysis-Task-data.csv', undefined , (data)=> {
  plotBarGraph(students);
  d3.select('.test').text(data);
});

let plotBarGraph = (studentsData)=> {
  let unexpected = studentsData.filter((record)=> {
    return record.ExitedUnexpectedly === "Y";
  });
  console.log(unexpected.length);

  let oneYear = unexpected.filter((record)=> {
    return parseInt(record["#Yrs At Zilla"]) === 1;
  });
  console.log("1 - ", oneYear.length);

  let twoYear = unexpected.filter((record)=> {
    return parseInt(record["#Yrs At Zilla"]) === 2;
  });
  console.log("2 - ", twoYear.length);

  let threeYear = unexpected.filter((record)=> {
    return parseInt(record["#Yrs At Zilla"]) === 3;
  });
  console.log("3 - ", threeYear.length);

  let fourYear = unexpected.filter((record)=> {
    return parseInt(record["#Yrs At Zilla"]) === 4;
  });
  console.log("4 - ", fourYear.length);

  let fiveYear = unexpected.filter((record)=> {
    return parseInt(record["#Yrs At Zilla"]) > 4;
  });
  console.log("5+ - ", fiveYear.length);
}
