var svg_saros=d3.select(".svg_saros");
var svg_map=d3.select(".svg_map");
var eclipse_liste_container=d3.select(".eclipse_liste_container");


//Taille des svg
var svg_width=(document.getElementsByClassName("svg_container")[0].offsetWidth);
var svg_height=0.9*(document.getElementsByClassName("svg_container")[0].offsetHeight);
svg_saros.attr("viewBox","0 0 "+svg_width.toString()+" "+svg_height.toString());
svg_map.attr("viewBox","0 0 "+svg_width.toString()+" "+svg_height.toString());



//Switch
var svg_container_map=d3.select(".svg_container_map");
var infos_supp_map=d3.select(".infos_supp_map");
var svg_container_saros=d3.select(".svg_container_saros");
var infos_supp_saros=d3.select(".infos_supp_saros");

var map_button=d3.select(".fa-map-marker-alt");
var saros_button=d3.select(".fa-history");
var switch_button=d3.select(".switch");



function switch_to(zone)
{
	if(zone=="saros")
	{
		svg_container_saros.style("display","block");
		infos_supp_saros.style("display","block");
		svg_container_map.style("display","none");
		infos_supp_map.style("display","none");
		
		saros_button.style("color","rgb(0,31,63)");
		map_button.style("color","rgb(200,200,200)");
		switch_button.style("justify-content","flex-end");

	}
	else 
	{
		svg_container_saros.style("display","none");
		infos_supp_saros.style("display","none");
		svg_container_map.style("display","block");
		infos_supp_map.style("display","block");
		
		map_button.style("color","rgb(0,31,63)");
		saros_button.style("color","rgb(200,200,200)");
		switch_button.style("justify-content","flex-start");
		//showGEonMap();
	}
}



map_button.on("click",function(){switch_to("map");});
saros_button.on("click",function(){switch_to("saros");});
//infos_supp_saros.style("display","none");


//Lecture du jeu de données
function parseLatitude(latitude){
	var val = latitude.slice(0,-1);
	if(latitude.slice(-1)=='S') val*=-1;
	return  val; 
}
function parseLongitude(longitude){
	var val = longitude.slice(0,-1);
	if(longitude.slice(-1)=='W') val*=-1;
	return  val; 
}
var parseDate = d3.timeParse("%_Y %B %e");
var parseTime = d3.timeParse("%H:%M:%S");
var parseDuration = d3.timeParse("%Mm%Ss");
var data = d3.csv('solar_1950_2050.csv', function(error, data){
  
  //parsage des données
  data.forEach(function(d)
  {
	  
		//PARSAGE
		d['Catalog Number']=parseInt(d['Catalog Number']);
		d['Calendar Date']=parseDate(d['Calendar Date']);
		d['Eclipse Time']=parseTime(d['Eclipse Time']);
		d['Delta T (s)']=parseInt(d['Delta T (s)']);
		d['Lunation Number']=parseInt(d['Lunation Number']);
		d['Saros Number']=parseInt(d['Saros Number']);
		d['Gamma']=parseFloat(d['Gamma']);
		d['Eclipse Magnitude']=parseFloat(d['Eclipse Magnitude']);
		d['Sun Altitude']=parseInt(d['Sun Altitude']);
		d['Sun Azimuth']=parseInt(d['Sun Azimuth']);
		d['Path Width (km)']=parseInt(d['Path Width (km)']); 
		d['Central Duration']=parseDuration(d['Central Duration']);
		d['Longitude']=parseLongitude(d['Longitude']);
		d['Latitude']=parseLatitude(d['Latitude']);

		//Traitement des données manquantes : mises nulles
		if(isNaN(d['Path Width (km)']))
		{
		  d['Path Width (km)']=parseInt("0");  
		}
		if((d['Central Duration'])===null)
		{
		  d['Central Duration']=parseDuration("0m0s");
		}
		
		
  });



var formatDate = d3.timeFormat("%d/%m/%Y");
var formatHeure = d3.timeFormat("%H:%M");
var formatDuree = d3.timeFormat("%M'%S''");

function show_saros(e)
{
	//Titre : Soros et son numéro
	d3.select(".infos_supp_titre_saros")
	  .text("Saros "+ e['Saros Number'].toString());
	  
	//On repasse en 1 seule colomnes  
	d3.select(".infos_supp_multiple_columns_saros")
	  .text("")
	  .style("column-count","1");
	
	//Ajout de la ligende. Un .saros_item est une grid de 6 colomnes	
	var saros_item = d3.select(".infos_supp_multiple_columns_saros")
						.append("div")
						.attr("class","saros_item")
						  
	saros_item.append("span").html("<i>Date</i>");
	saros_item.append("span").html("<i>Heure</i>");
	saros_item.append("span").html("<i>Type</i>");
	saros_item.append("span").html("<i>Durée</i>");
	saros_item.append("span").html("<i>Ratio</i>");
	saros_item.append("span").html("<i>Longueur (km)</i>");
	  
	
	//Parcourt des polylines
	d3.selectAll("polyline")
	 .attr("stroke-width",function(d){if(d["Catalog Number"]===e["Catalog Number"]){return "3.0";}})
	 .attr("stroke",function(d)
				{
					//Si meme saros
					if(d["Saros Number"]===e["Saros Number"])
					{
						var color_selected = "rgb(0,31,63)";
						
						//Ajout des cercles sur les axes
						svg_saros.append("circle").attr("cx",(0.08*svg_width).toString()).attr("cy",date_scale(d['Calendar Date']).toString()).attr("r","3.5").style("fill",color_selected);
						svg_saros.append("circle").attr("cx",(0.36*svg_width).toString()).attr("cy",duration_scale(d['Central Duration']).toString()).attr("r","3.5").style("fill",color_selected);
						svg_saros.append("circle").attr("cx",(0.64*svg_width).toString()).attr("cy",magnitude_scale(d['Eclipse Magnitude']).toString()).attr("r","3.5").style("fill",color_selected);
						svg_saros.append("circle").attr("cx",(0.92*svg_width).toString()).attr("cy",path_scale(d['Path Width (km)']).toString()).attr("r","3.5").style("fill",color_selected);
						
						//Ajout d'un saros_item
						var saros_item = d3.select(".infos_supp_multiple_columns_saros")
											.append("div")
											.attr("class","saros_item")
						 
						//Remplissage de l'item
						saros_item.append("span").text(formatDate(d['Calendar Date']));
						saros_item.append("span").text(formatHeure(d['Eclipse Time']));
						var eclipse_type;
						if(d['Eclipse Type'].substring(0,1)=="P"){eclipse_type="&#9680;"}
						if(d['Eclipse Type'].substring(0,1)=="A"){eclipse_type="&#10687;"}
						if(d['Eclipse Type'].substring(0,1)=="T"){eclipse_type="&#x2B24;"}
						if(d['Eclipse Type'].substring(0,1)=="H"){eclipse_type="&#9677;"}
						saros_item.append("span").html(eclipse_type);
						saros_item.append("span").text(formatDuree(d['Central Duration']).toString().substring(0,8));
						saros_item.append("span").text(d['Eclipse Magnitude'].toString().substring(0,4));
						saros_item.append("span").text(d['Path Width (km)'].toString());
						
						
						return color_selected;
						//return color(e["Saros Number"]);
					}
					//Sinon
					else
					{
						return "rgba(230,230,230,0.1)";
					}
				})
}

function hide_saros()
{
	//On repasse au texte par defaut
	d3.select(".infos_supp_titre_saros")
	  .text("Saros");
	
	//On repasse au texte par defaut 
	d3.select(".infos_supp_multiple_columns_saros")
	  .html("Le saros est une période de 18 ans, 11 jours, 7 heures et 43 minutes.<br/>Si une éclipse solaire se produit à un instant donné, une éclipse similaire aura lieu un saros plus tard car la configuartion relative Soleil-Terre-Lune sera quasiment identique. Il y a en tout 204 séries de saros.<br/><br/><em>Survolez une éclipse pour visualiser son saros.</em>");
	  
	
	//On supprime les saros_items  
	d3.selectAll(".saros_item").remove();
	 
	
	//On supprime les cercles 
	svg_saros.selectAll("circle").remove();
	
	//On remet les polyline par defaut 
	d3.selectAll("polyline").attr("stroke","rgba(200,200,200,0.1)")
}

//AFFICHAGE LISTE DES ECLIPSES
//Creation des items

var items = eclipse_liste_container.selectAll("div").data(data)
						   .enter()
						   .append("div")
						   .attr("class","eclipse_liste_item")						   
						   .on("mouseover",function(e,i){show_saros(e); GE_onemouseover(i);}) // showOnePathOnMap(e,i);
						   .on("mouseout", function() {hide_saros(); GE_onemouseleave(); }) // showGEonMap();


//Pour le formattage
var formatDate = d3.timeFormat("%d/%m/%Y");
var formatHeure = d3.timeFormat("%H:%M");
var formatDuree = d3.timeFormat("%M'%S''");
//var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Eclipse Magnitude']})).range([0,70]);
//Changer de paramScale avec le choix du paramètre

//Ajout de la date a chaque item
items.append("div")
	   .attr("class","eclipse_liste_item_date")
	   .text(function(d){return formatDate(d['Calendar Date'])});

//Ajout de l'heure a chaque item
items.append("div")
	   .attr("class","eclipse_liste_item_heure")
	   .text(function(d){return formatHeure(d['Eclipse Time'])})

//Ajout du type a chaque item
items.append("div")
	   .attr("class","eclipse_liste_item_type")
	   .html(function(d)
				{
					if(d['Eclipse Type'].substring(0,1)=="P"){return "&#9680;"}
					if(d['Eclipse Type'].substring(0,1)=="A"){return "&#10687;"}
					if(d['Eclipse Type'].substring(0,1)=="T"){return "&#x2B24;"}
					if(d['Eclipse Type'].substring(0,1)=="H"){return "&#9677;"}
				})

//Ajout du parametre a chaque item
var eclipse_liste_item_param= items.append("div")
								   .attr("class","eclipse_liste_item_param");
								   
var eclipse_liste_item_param_barre=eclipse_liste_item_param.append("div")
															.attr("class","barre")
															.style("width","0%")
															.style("visibility","hidden");
															
var eclipse_liste_item_param_span=eclipse_liste_item_param.append("span")
								   //.html(function(d){return '<div class="barre" style="width:'+"0"+'%">.&nbsp;</div><span>'+d['Eclipse Magnitude'].toString().substring(0,4)+'</span>'})
	   
//Gestion du menu deroulant pour le choix du paramètre
d3.select(".choose_param_ratio").on("click",function()
											{
												d3.select(".choosen_param i").text("Ratio");
												
												var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Eclipse Magnitude']})).range([0,70]);
												
												eclipse_liste_item_param_barre.style("visibility","visible");
												
											    eclipse_liste_item_param_span.text(function(d){return d['Eclipse Magnitude'].toString().substring(0,4)});
												
												eclipse_liste_item_param_barre.style("width",function(d){return paramScale(d['Eclipse Magnitude']).toString().substring(0,4)+"%"});
												
											});
											
d3.select(".choose_param_longueur").on("click",function()
											{
												d3.select(".choosen_param i").text("Longueur (km)");
												
												var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Path Width (km)']})).range([0,70]);
												
												eclipse_liste_item_param_barre.style("visibility","visible");
												
												eclipse_liste_item_param_span.text(function(d){return d['Path Width (km)'].toString()});
												
												eclipse_liste_item_param_barre.style("width",function(d){return paramScale(d['Path Width (km)']).toString().substring(0,4)+"%"});
												
											});
   
d3.select(".choose_param_duree").on("click",function()
											{
												d3.select(".choosen_param i").text("Durée");
												
												var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Central Duration']})).range([0,70]);
												
												eclipse_liste_item_param_barre.style("visibility","visible");
												
												eclipse_liste_item_param_span.text(function(d){return formatDuree(d['Central Duration']).toString()});
												
												eclipse_liste_item_param_barre.style("width",function(d){return paramScale(d['Central Duration']).toString().substring(0,4)+"%"});
												
											});
											
d3.select(".choose_param_gamma").on("click",function()
											{
												d3.select(".choosen_param i").text("Gamma");
												
												var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Gamma']})).range([0,70]);
												
												eclipse_liste_item_param_barre.style("visibility","visible");
												
												eclipse_liste_item_param_span.text(function(d){return d['Gamma'].toString().substring(0,4)});
												
												eclipse_liste_item_param_barre.style("width",function(d){return paramScale(d['Gamma']).toString().substring(0,4)+"%"});
												
											});


//Affichage d'une partie des données seulement  
function show_only_type(type) // TODO: lien avec la map
{
	
	if(type=="P" || type=="A" || type=="T" || type=="H")
	{
		items.style("display",function(d)
								{
									if(d['Eclipse Type'].substring(0,1)==type){return "grid";}
									else{return "none";}
								}
								);
	}
	else
	{
		items.style("display","grid");
	}
} 

show_only_type("ALL");
d3.select(".type_P").on("click",function(){show_only_type("P");});
d3.select(".type_A").on("click",function(){show_only_type("A");});
d3.select(".type_T").on("click",function(){show_only_type("T");});
d3.select(".type_H").on("click",function(){show_only_type("H");});
d3.select(".type_ALL").on("click",function(){show_only_type("ALL");});

	   
// AFFICHAGE DU GRAPHE DES SAROS

//Les echelles
var date_scale=d3.scaleTime()
     				.domain(d3.extent(data, function(d) {return d['Calendar Date'];}))
					.range([0.02*svg_height,0.92*svg_height]);
					         
var duration_scale=d3.scaleTime()
				.domain(d3.extent(data, function(d) {return d['Central Duration'];}))
				.range([0.02*svg_height,0.92*svg_height]); 				
				
var magnitude_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Eclipse Magnitude'];}))
				.range([0.02*svg_height,0.92*svg_height]); 
								
var path_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Path Width (km)'];}))
				.range([0.02,0.92*svg_height]); 
				

//Affichage des traits				
svg_saros.selectAll("polyline")
	 .data(data)
	 .enter()
	 .append("polyline")
	 .attr("fill","none")
	 .attr("stroke","rgba(200,200,200,0.1)")
	 .attr("stroke-width","2.0")
	 .on("mouseover",function(e){show_saros(e);})
	 .on("mouseout",function(){hide_saros()})
	 .attr("points",function(d){return (0.08*svg_width).toString()+","+date_scale(d['Calendar Date']).toString()+" "
									  +(0.36*svg_width).toString()+","+duration_scale(d['Central Duration']).toString()+" "
									  +(0.64*svg_width).toString()+","+magnitude_scale(d['Eclipse Magnitude']).toString()+" "
									  +(0.92*svg_width).toString()+","+path_scale(d['Path Width (km)']).toString()});
	  
//Affichage des axes
svg_saros.append("line")
   .attr("x1",(0.08*svg_width).toString())
   .attr("x2",(0.08*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","black")
   .attr("stroke-width","3.4");
svg_saros.append("polygon")
   .attr("points",(0.07*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" "
					+(0.08*svg_width).toString()
					+","
					+(1*svg_height).toString()
					+" "
					+(0.09*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","black");

svg_saros.append("line")
   .attr("x1",(0.36*svg_width).toString())
   .attr("x2",(0.36*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","black")
   .attr("stroke-width","3.4"); 
svg_saros.append("polygon")
   .attr("points",(0.35*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" "
					+(0.36*svg_width).toString()
					+","
					+(1*svg_height).toString()
					+" "
					+(0.37*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","black");
   
svg_saros.append("line")
   .attr("x1",(0.64*svg_width).toString())
   .attr("x2",(0.64*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","black")
   .attr("stroke-width","3.4");
svg_saros.append("polygon")
   .attr("points",(0.63*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" "
					+(0.64*svg_width).toString()
					+","
					+(1*svg_height).toString()
					+" "
					+(0.65*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","black");
   
svg_saros.append("line")
   .attr("x1",(0.92*svg_width).toString())
   .attr("x2",(0.92*svg_width).toString())
   .attr("y1",(0.00*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","black")
   .attr("stroke-width","3.4");
svg_saros.append("polygon")
   .attr("points",(0.91*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" "
					+(0.92*svg_width).toString()
					+","
					+(1*svg_height).toString()
					+" "
					+(0.93*svg_width).toString()
					+","
					+(0.95*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","black");

  

//***************************************************************************** */
//****************************   MAP        *********************************** */
//***************************************************************************** */

// layers:
var svg_continent = svg_map.append('g');

var svg_path = svg_map.append('g');
var svg_GE = svg_map.append('g');

var graticule = d3.geoGraticule();

var projection = d3.geoKavrayskiy7()
	.scale(170)
	.translate([svg_width / 2, svg_height / 2])
	.precision(.1)
	.rotate([-11,0]);

var formatDate_Ymd = d3.timeFormat("%Y-%m-%d");


// affichage des GE de chaque eclipses sur la map
{ 
	function showContinents(){

		var path = d3.geoPath().projection(projection);

		svg_continent.append("defs").append("path") // contour du monde
			.datum({type: "Sphere"})
			.attr("id", "sphere")
			.attr("d", path)
			//.attr("color", "none");  

		svg_continent.append("use") // contour du monde
			.attr("class", "stroke")
			.attr("xlink:href", "#sphere")
			.style("fill", "rgb(230,230,230)");  

		svg_continent.append("path") // tracés des longitudes/lattitudes
			.datum(graticule)
			.attr("class", "graticule")
			.attr("d", path)
			.style("fill", "none");  

		// Affichage des continents		
		var dataContinentsPath = "https://piwodlaiwo.github.io/topojson//world-continents.json";
		d3.json(dataContinentsPath, function(error, topology) {
			var continents = topojson.feature(topology, topology.objects.continent).features;

			svg_continent.selectAll(".continent")
			.data(continents)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("title", function(d,i) { 
				return d.properties.continent;
			})
			.style("fill", "rgb(0, 31, 63)")   //function(d, i) { return color(i); });
			// .on("mouseover", function(d) {        	
			// 	d3.select(this)
			// 		.transition()
			// 		.duration(200)
			// 		.style("fill", "red");     		
			// })
			// .on("mouseout", function(d) {        	
			// 	d3.select(this)
			// 		.transition()
			// 		.duration(200)
			// 		.style("fill", "rgb(0, 31, 63)");     		
			// });	
		})
	}
	function showOnePathOnMap(id){
		
		d3.json("all_paths.json", function(eclipsePath){	
					
			showPath(id, eclipsePath);		
					
		});
		//return success; // don't work due to async behavior
	}
	function showAllPathOnMap(){
		d3.json("all_paths.json", function(error, eclipsePath){		
			for(var i=0; i< data.length; i++)
			{			
				showPath(i, eclipsePath);
			}
		});
	};

	function showPath(id, eclipsePath) {
		var d = data[id];
		var date = formatDate_Ymd(d['Calendar Date']);
	
		path = eclipsePath.cartographicDegrees[date];

		if(path == undefined) {
			return false;
		}
		
		for(var i=0; i< path.length; i+=2){        
			var point = [path[i], path[i+1]]
			var proj = projection(point)
			svg_path.append('circle')
				.attr("cx",proj[0]) 
				.attr("cy",proj[1])
				.attr("r",1)
				.style("fill","green")
		}  
		return true;
	};

	function showGEonMap(){
		data.forEach(function(d,i)
		{       
			var point = [d['Longitude'], d['Latitude']]
			var proj = projection(point)
			svg_GE.append('circle')
				.attr("cx",proj[0]) 
				.attr("cy",proj[1])
				.attr("r", 0.1*path_scale(d['Path Width (km)']))
				.style("fill","green")
				.style('opacity','0.5')
		}); 
	};
	function GE_interaction(){
		svg_GE.selectAll('circle')
			.on("mouseenter", function(d1,i1) {			
				GE_onemouseover(i1);
			})
			.on("mouseleave", function() {      
				GE_onemouseleave();
			});
	}
}

function GE_onemouseover(i1){
	// hide all + show path
	path_exist = showOnePathOnMap(i1);
	// console.log("2->", path_exist)
	// if(!path_exist){
	// 	d3.select(".infos_supp_multiple_columns_map").html('éclipse sans trajectoires')
	// }

	svg_map.selectAll('circle')
		.style('visibility', function(d2,i2){						
			if(i1==i2){
				return "visible";                
			} else { 
				return "hidden";
			}						
		})	
}
function GE_onemouseleave(){
	//d3.select(".infos_supp_multiple_columns_map").html('Infos sur la map')
	svg_path.selectAll('circle').remove();
	svg_map.selectAll('circle').style('visibility',"visible");
}

showContinents();
showGEonMap();
GE_interaction();

switch_to("map");

});



