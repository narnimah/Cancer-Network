var data;
var studies = [];
var typeList = [];
var study_types = {};
var studyFreqs = [];
var relations = [];
var freqStartStudy = [];
var freqEndStudy = [];
var finalData = [];
var preProcessedData = [];


function displayDetails(d) {

   if (d.source==undefined && d.target==undefined){ // this is a vertex
     getClinicalData(d.name);
     drawStudyBubble(d.name);
   }
   else if (d.source && d.target){
     drawBubble(d);
   }
}

  d3.csv('data/study_genes_count.csv', function(_data) {
   data = _data;

   data.forEach(function(d) {

     preProcessedData.push({gene:d.protein,frequency:d.freq, study:d.study});

     if (!study_types[d.study])
       study_types[d.study] = d.study_type;

    if (!typeList.includes(d.study_type))
      typeList.push(d.study_type);

      //console.log(typeList);

     if (!studyFreqs[d.study]) {
       studyFreqs[d.study] = parseInt(d.freq);
     }
    else
        studyFreqs[d.study] += parseInt(d.freq);

     if (!studies.includes(d.study)) {
       studies.push(d.study);
       studies[d.study] = [];
     }

     if (!studies[d.study].includes(d.protein))
       //studies[d.study].push({ protein: d.protein, freq: d.freq});
       studies[d.study].push(d.protein);

   });

   // console.log(studyFreqs);

   for (var i=0; i < studies.length-1; i++) {

     for (var j = i+1; j < studies.length; j++) {

       // Compare elements inside the array with the next ones
       for (var k = 0; k < studies[studies[i]].length; k++) {

         //console.log(studies[studies[j]]);
         //console.log(studies[studies[i]][k]);
         if (studies[studies[j]].includes(studies[studies[i]][k])) {
           if (!relations[studies[i] + '__' + studies[j]]) {
             relations[studies[i] + '__' + studies[j]] = [];
             relations[studies[i] + '__' + studies[j]].push(studies[studies[i]][k]);
           } else {
             relations[studies[i] + '__' + studies[j]].push(studies[studies[i]][k]);
           }

         }
       }
     }

   }
   //console.log(relations);

   var study_links = [];
   for (var relation in relations) {
     // console.log(relations[relation].length);
     r = relation.split("__");
     study_links.push({source: r[0], target: r[1], value: relations[relation].length});
   }

   //console.log(study_links);

   plotNetwork(study_links);
   displayDetails({name: 'skcm_broad'});

 });


function plotNetwork(links, divCSS="#container") {

   var nodes = {};

   // Compute the distinct nodes from the links.
   links.forEach(function(link) {
     link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
     link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
   });

   var divSelection = d3.select(divCSS);

   var divWidth = divSelection[0][0].clientWidth;
   var divHeight = divSelection[0][0].clientHeight;

   //console.log(links);

   var nScale = d3.scale.linear()
                       .domain(d3.extent(links, function(i) { return +i.value })).range([300,500]);

   var force = d3.layout.force()
       .nodes(d3.values(nodes))
       .links(links)
       .size([divWidth - 5, divHeight - 5])
       .linkDistance(function(d) { return nScale(d.value); } )
       .charge(-300)
       .on("tick", tick)
       .start();

   var svg = d3.select(divCSS).append("svg")
       .attr("width", divWidth)
       .attr("height", divHeight);

    drawColorLegend(svg, typeList);

 var studyArray = [];
 for (var s in studyFreqs) {
   studyArray.push({study: s, freq: studyFreqs[s]});
 }

  var nodeScale = d3.scale.linear()
                       .domain(d3.extent(studyArray, function(i) { return +i.freq })).range([10,35]);

   var link = svg.selectAll(".link")
       .data(force.links())
     .enter().append("line")
       .attr("class", "link")
       .style("stroke", "#ccc")
       .on('mouseover', function(d) {
         drawBubble(d);
         svg.selectAll(".link").transition()
             .duration(300)
          .style('stroke-opacity', function(l) {
            if (d.source.name === l.source.name && d.target.name === l.target.name) {
              return 1;
            }
            else {
              return 0.1;
            }
          });
       })
       .on('mouseout', function(d) {
         svg.selectAll(".link").transition()
             .duration(300)
          .style('stroke-opacity', 1);
       })
       .on('click', function(d) {
         drawBubble(d);
       });


   var node = svg.selectAll(".node")
       .data(force.nodes())
     .enter().append("g")
       .attr("class", "node")
       .style("fill", function(l){
          return getColor(study_types[l.name]);
       })
       .on('mouseover', function(d) {
           displayDetails(d);
           //drawStudyBubble(d);
           var selNodes = [];
           svg.selectAll(".link").transition()
               .duration(500)
            .style('stroke-opacity', function(l) {
              if (d.name === l.source.name) {
                selNodes.push(l.target.name);
                return 1;
              }
              else {
                return 0.1;
              }
            });

            svg.selectAll(".node").transition()
                .duration(500)
             .style('fill-opacity', function(l) {
             if (d.name === l.name)
               return 1;
              else if ( selNodes.includes(l.name) )
                 return 1;
               else {
                 return 0.1;
               }
             });

            d3.select(this).select("circle").transition()
                .duration(500)
                .attr("r", function(d) {
                  return nodeScale(studyFreqs[d.name]) +5;
                });
       })
       .on('click', function(d) {
         displayDetails(d);
       })
       .on('mouseout', function(d) {
         svg.selectAll(".link").transition()
             .duration(500)
          .style('stroke-opacity', 1);
          d3.select(this).select("circle").transition()
              .duration(500)
              .attr("r", function(d) {
                return nodeScale(studyFreqs[d.name]);
              });
          svg.selectAll(".node").transition()
              .duration(500)
           .style('fill-opacity', 1);
       })
       .call(force.drag);

   node.append("circle")
       .attr("r", function(d) {
         return nodeScale(studyFreqs[d.name]);
       })
       .style("fill", function(l) { return getColor(study_types[l.name]); });

   node.append("text")
       .attr("x", 12)
       .attr("dy", ".35em")
       .style("fill", '#000000')
       .text(function(d) { return d.name; });

   function tick() {
     link
         .attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

     node
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
   }

}
