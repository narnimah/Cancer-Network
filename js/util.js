var serverUrl = "http://www.cbioportal.org/webservice.do?";
var pCColor;
// var caseSetIdParameters = "cmd=getCaseLists&cancer_study_id=";
// var clinicalDataParameters = "cmd=getClinicalData&case_set_id=";

function getClinicalData(cancer_study_id) {

  d3.select("#par_coords").remove();

  var clinicalDataQuery = serverUrl + "cmd=getClinicalData&case_set_id=" + cancer_study_id + "_all";
  pCColor = getColor(study_types[cancer_study_id]);

  console.log(clinicalDataQuery);

  new Promise(function(resolve) {
    d3.tsv(clinicalDataQuery, function(p) { resolve(p); })
  })
  .then(function(clinicalDataResult) {

    clinicalData = clinicalDataResult;
    plotParallelCoordinate(clinicalData);

  });

}

function getColor(study_type) {
  if (study_type=="bladder")
    return "#7a0177";
  else if (study_type=="breast")
    return "#fbb4b9";
  else if (study_type=="liver")
    return "#c51b8a";
  else if (study_type=="pancreatic")
    return "#dd1c77"
  else if (study_type=="skin")
    return "#fbb4b9";
  else{
    return "#8856a7";
  }
}

// Add color legend
var typeList = [];



 // ["increases_activity","decreases_activity", "translocation", "binds", "Multiple interaction types"]
function drawColorLegend(svg, study_types) {

//console.log(study_types);

var xx = 620;
var y1 = 10;
svg.selectAll(".arcLegend").data(typeList).enter()
.append("path")
  .attr("class", "arcLegend")
  .style("fill-opacity", 0)
  .style("stroke-width", 2)
  .style("stroke", function (d) {
      return getColor(d);
  })
  .attr("d", function(l,i){
    var yy = y1+14*i-10;
    var rr = 5.6;
    return "M" + xx + "," + yy + "A" + rr + "," + rr*1.25 + " 0 0,1 " + xx + "," + (yy+rr*2);
  });
svg.selectAll(".textLegend").data(typeList).enter()
  .append("text")
    .attr("class", "textLegend")
    .attr("x", xx+8)
    .attr("y", function(l,i){
      return y1+14*i;
    })
    .text(function (d) {
      return d;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .style("text-anchor", "left")
    .style("fill", function (d) {
      return getColor(d);
    });
}

function plotParallelCoordinate(clinicalData) {

  d3.select("#par_coords").remove();
  //d3.select("#bubble_chart").remove();

  if (clinicalData.length > 1) {
    var noProps = Object.keys(clinicalData[0]).length;

    if (noProps > 5) {
      var props = Object.keys(clinicalData[0]);

      var tClinicalData = [];

        clinicalData.forEach(function(cd) {
          //console.log(cd);
          var rcd = new Object();
          for (var i = 0; i < 6; i++) {
            rcd[props[i]] = cd[props[i]];
          }
          tClinicalData.push(rcd);
        });

      //console.log(tClinicalData);
      clinicalData = tClinicalData;
    }

  }

  var parcoords = d3.parcoords()('#clinicalHolder')
    .color(pCColor)
    .alpha(0.4);

  parcoords
    .data(clinicalData)
    .render()
    .brushMode("1D-axes");

}

function drawBubble(d, divCSS="#proteinHolder") {

  //d3.select("#par_coords").remove();
  d3.select("#bubble_chart").remove();

  var startStudy = d.source.name;
  var endStudy  = d.target.name;

  var connection = d.source.name + '__' + d.target.name;
  //console.log(connection);
  //console.log(relations);
  finalData = [];
  for (var rel in relations) {
        //console.log(rel);
        freqEndStudy = [];
        freqStartStudy = [];


        if( rel == connection)
        {
          var commonGenes = relations[rel];
            //console.log(commonGenes);
            for( var a in commonGenes){
              //console.log(commonGenes[a]);
                  for(var b in preProcessedData){
                    //console.log(preProcessedData[b]);
                          if(preProcessedData[b].gene == commonGenes[a]){
                                if(preProcessedData[b].study == startStudy){
                               freqStartStudy.push({commonGene:preProcessedData[b].gene,
                                 commonFreq: preProcessedData[b].frequency, commonStudy: preProcessedData[b].study});

                                }
                                if(preProcessedData[b].study == endStudy){
                                freqEndStudy.push({commonGene:preProcessedData[b].gene,
                                  commonFreq: preProcessedData[b].frequency, commonStudy: preProcessedData[b].study});

                                }

                          }
                  }
            }
            //console.log(freqStartStudy);
            //console.log(freqEndStudy);

            for(var c in freqStartStudy){
              for(var d in freqEndStudy){
                  if(freqStartStudy[c].commonGene == freqEndStudy[d].commonGene){
                    finalData.push({gene: freqStartStudy[c].commonGene,
                      totalFreq: parseInt(freqStartStudy[c].commonFreq) + parseInt(freqEndStudy[d].commonFreq)});
                  }

              }
            }
            //console.log(finalData);
      }
      //console.log(finalData);
  }

  //console.log(finalData);

  var divSelection = d3.select(divCSS);

  var divWidth = divSelection[0][0].clientWidth;
  var divHeight = divSelection[0][0].clientHeight;

  var diameter = 360,
      format = d3.format(",d"),
      color = d3.scale.category20c();

  var bubble = d3.layout.pack()
      .sort(null)
      .size([divWidth, divHeight])
      .padding(1.5);

  var bubbleSvg = d3.select("#proteinHolder").append("svg")
      .attr("width", divWidth)
      .attr("height", divHeight)
      .attr("class", "bubble")
      .attr("id", "bubble_chart");

  var root = {};
  root['name'] = "genes";
  root['children'] = [];

  finalData.forEach(function(g) {
    //console.log(g);
    root['children'].push({ name: g.gene, size: g.totalFreq });
  });

  var pScale = d3.scale.linear()
                       .domain(d3.extent(root['children'], function(i) { return +i.size })).range([10,40]);


  //console.log(getColor(study_types[startStudy]));
  //console.log(getColor(study_types[endStudy]));

  var colorScale = d3.scale.linear().domain(d3.extent(root['children'], function(i) { return +i.size }))
                             .range([getColor(study_types[startStudy]), getColor(study_types[endStudy])]);

  var node = bubbleSvg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) {
          var re = finalData.filter(function(s) { return s.gene ==  d.packageName});
          return colorScale(re[0].totalFreq);
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    bubbleSvg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Proteins in the Study");

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: node.name, className: node.name, value: pScale(node.size) });
    }

    recurse(null, root);
    //console.log({children:classes});
    return {children: classes};

  }

}

function drawStudyBubble(study, divCSS="#proteinHolder") {

  d3.select("#bubble_chart").remove();

  studyProteins = [];
  data.forEach(function(d) {
    if (study == d.study && d.protein != 'Unknown') {
      studyProteins.push(d);
    }
  });

  // console.log(studyProteins);

  var divSelection = d3.select(divCSS);

  var divWidth = divSelection[0][0].clientWidth;
  var divHeight = divSelection[0][0].clientHeight;

  var diameter = 360,
      format = d3.format(",d"),
      color = getColor(study_types[study]);

  var bubble = d3.layout.pack()
      .sort(null)
      .size([divWidth, divHeight])
      .padding(1.5);

  var bubbleSvg = d3.select("#proteinHolder").append("svg")
      .attr("width", divWidth - 5)
      .attr("height", divHeight - 5)
      .attr("class", "bubble")
      .attr("id", "bubble_chart");

  var root = {};
  root['name'] = "genes";
  root['children'] = [];

  studyProteins.forEach(function(g) {
    root['children'].push({ name: g.protein, size: g.freq });
  });

  var pScale = d3.scale.linear()
                       .domain(d3.extent(root['children'], function(i) { return +i.size })).range([10,40]);

  var node = bubbleSvg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) {
          var pt = studyProteins.filter(function(s) { return s.protein ==  d.className});
          return pScale(pt[0].freq);
        }).style("fill", function(d) { return color; });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: node.name, className: node.name, value: node.size});
    }

    recurse(null, root);
    //console.log({children:classes});
    return {children: classes};

  }

}
