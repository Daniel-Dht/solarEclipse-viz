<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <script src="https://d3js.org/d3.v4.min.js"></script>
  <script src="https://d3js.org/topojson.v2.min.js"></script>
  <script src="https://d3js.org/d3-geo-projection.v1.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css?family=Karla" rel='stylesheet' type='text/css'>
    <style>
    body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
    svg { width:100%;height:100% }
    path {fill:none;}
    .graticule {
      fill: none;
      stroke: #777;
      stroke-width: .5px;
      stroke-opacity: .5;
    }
    .stroke {
  	  fill: none;
  		stroke: #000;
  		stroke-width: 3px;
		}
    text {
    	font-family: 'Karla' ;
      font-weight : normal;
    }
  </style>
</head>

<body>
  <script>
    var width = 960;
    var height = 500;
    
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var graticule = d3.geoGraticule();
    var svg = d3.select("body").append("svg");
    var g = svg.append("g");

    //https://bl.ocks.org/mbostock/3710082
		var projection = d3.geoKavrayskiy7()
    .scale(170)
    .translate([width / 2, height / 2])
    .precision(.1)
    .rotate([-11,0]);
    
    var path = d3.geoPath().projection(projection);

    svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    
    var data = "https://piwodlaiwo.github.io/topojson//world-continents.json";
    
    d3.json(data, function(error, topology) {
      var continents = topojson.feature(topology, topology.objects.continent).features;
      
      var centroids = continents.map(function (d){
        return projection(d3.geoCentroid(d))
  		});
      
      svg.selectAll(".continent")
      .data(continents)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("title", function(d,i) { 
        return d.properties.continent;
      })
      .style("fill", function(d, i) { return color(i); });
      
       svg.selectAll(".name").data(centroids)
    	 .enter().append("text")
       .attr("x", function (d){ return d[0]; })
       .attr("y", function (d){ return d[1]; })
 		   .style("fill", "black")
       .attr("text-anchor", "middle")
       .text(function(d,i) {
         return continents[i].properties.continent;
       });

     
    })

      //reference
      /*
      starting point: techslides.com/demos/d3/worldmap-template-d3v4.html
      colors via neighbors: https://bl.ocks.org/mbostock/4180634
      https://github.com/piwodlaiwo/topojson
      http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f (look into using d3.tip.js)
      
      //Did not need polylabel.js for labels
      https://bl.ocks.org/Fil/da021023d58b8ddefd165c65e37f796b
      http://blockbuilder.org/pnavarrc/75ec1502f51f86c2f43e
      http://bl.ocks.org/hugolpz/42955069888057aff8c2
      http://blockbuilder.org/d3noob/401237468c9e38cea8c7
      */
    
  </script>
</body>
