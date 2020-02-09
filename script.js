var svg=d3.select("svg");
console.log(document.getElementsByTagName("svg")[0].getBBox());
svg.attr("viewBox","0 0 100 100");
svg.attr("preserveAspectRatio","none");
var eclipse_liste_container=d3.select(".eclipse_liste_container");

//Lecture du jeu de données
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
	d3.select(".infos_supp_titre")
	  .text("Saros "+ e['Saros Number'].toString());
	  
	//On repasse en 1 seule colomnes  
	d3.select(".infos_supp_multiple_columns")
	  .text("")
	  .style("column-count","1");
	
	//Ajout de la ligende. Un .saros_item est une grid de 6 colomnes	
	var saros_item = d3.select(".infos_supp_multiple_columns")
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
	 .attr("stroke",function(d)
				{
					//Si meme saros
					if(d["Saros Number"]===e["Saros Number"])
					{
						var color_selected = "rgb(0,31,63)";
						
						//Ajout des cercles sur les axes
						svg.append("ellipse").attr("cx","8").attr("cy",date_scale(d['Calendar Date']).toString()).attr("rx","0.5").attr("ry","1.4").style("fill",color_selected);
						svg.append("ellipse").attr("cx","36").attr("cy",duration_scale(d['Central Duration']).toString()).attr("rx","0.5").attr("ry","1.4").style("fill",color_selected);
						svg.append("ellipse").attr("cx","64").attr("cy",magnitude_scale(d['Eclipse Magnitude']).toString()).attr("rx","0.5").attr("ry","1.4").style("fill",color_selected);
						svg.append("ellipse").attr("cx","92").attr("cy",path_scale(d['Path Width (km)']).toString()).attr("rx","0.5").attr("ry","1.4").style("fill",color_selected);
						
						//Ajout d'un saros_item
						var saros_item = d3.select(".infos_supp_multiple_columns")
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
	d3.select(".infos_supp_titre")
	  .text("Saros");
	
	//On repasse au texte par defaut 
	d3.select(".infos_supp_multiple_columns")
	  .text("Survoler une éclipse solaire");
	  
	
	//On supprime les saros_items  
	d3.selectAll(".saros_item").remove();
	 
	
	//On supprime les cercles 
	d3.selectAll("ellipse").remove();
	
	//On remet les polyline par defaut 
	d3.selectAll("polyline").attr("stroke","rgb(180,180,180)")
}

//AFFICHAGE LISTE DES ECLIPSES
//Creation des items
var items = eclipse_liste_container.selectAll("div").data(data)
						   .enter()
						   .append("div")
						   .attr("class","eclipse_liste_item")
						   .on("mouseover",function(e){show_saros(e);})
						   .on("mouseout",function(){hide_saros()})


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
   
	   
	   
	   
// AFFICHAGE DU GRAPHE DES SAROS

//Les echelles
var date_scale=d3.scaleTime()
     				.domain(d3.extent(data, function(d) {return d['Calendar Date'];}))
					.range([2,92]);
					      
    
var duration_scale=d3.scaleTime()
				.domain(d3.extent(data, function(d) {return d['Central Duration'];}))
				.range([2,92]); 
				
				
var magnitude_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Eclipse Magnitude'];}))
				.range([2,92]); 
				
				
var path_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Path Width (km)'];}))
				.range([2,92]); 
				

//Affichage des traits				
svg.selectAll("polyline")
	 .data(data)
	 .enter()
	 .append("polyline")
	 .attr("fill","none")
	 .attr("stroke","rgb(200,200,200)")
	 .attr("stroke-width","0.4")
	 .on("mouseover",function(e){show_saros(e);})
	 .on("mouseout",function(){hide_saros()})
	 .attr("points",function(d){return "8,"+date_scale(d['Calendar Date']).toString()+" 36,"+duration_scale(d['Central Duration']).toString()+" 64,"+magnitude_scale(d['Eclipse Magnitude']).toString()+" 92,"+path_scale(d['Path Width (km)']).toString()});
	 
	 
	 
//Affichage des axes
svg.append("line")
   .attr("x1","8")
   .attr("x2","8")
   .attr("y1","2")
   .attr("y2","98")
   .attr("stroke","black")
   .attr("stroke-width","0.4");
svg.append("polygon")
   .attr("points","7,95 8,100 9,95")
   .attr("stroke","none")
   .attr("fill","black");

svg.append("line")
   .attr("x1","36")
   .attr("x2","36")
   .attr("y1","2")
   .attr("y2","98")
   .attr("stroke","black")
   .attr("stroke-width","0.4"); 
svg.append("polygon")
   .attr("points","35,95 36,100 37,95")
   .attr("stroke","none")
   .attr("fill","black");
   
svg.append("line")
   .attr("x1","64")
   .attr("x2","64")
   .attr("y1","2")
   .attr("y2","98")
   .attr("stroke","black")
   .attr("stroke-width","0.4");
svg.append("polygon")
   .attr("points","63,95 64,100 65,95")
   .attr("stroke","none")
   .attr("fill","black");
   
svg.append("line")
   .attr("x1","92")
   .attr("x2","92")
   .attr("y1","2")
   .attr("y2","98")
   .attr("stroke","black")
   .attr("stroke-width","0.4");
svg.append("polygon")
   .attr("points","91,95 92,100 93,95")
   .attr("stroke","none")
   .attr("fill","black");

  
});