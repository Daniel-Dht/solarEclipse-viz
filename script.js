//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    SELECTION ET TAILLE DES SVG
//////////////////////////////////////////////////
//////////////////////////////////////////////////

var svg_saros=d3.select(".svg_saros");
var svg_map=d3.select(".svg_map");
var eclipse_liste_container=d3.select(".eclipse_liste_container");


//Taille des svg
var svg_width=(document.getElementsByClassName("svg_container")[0].offsetWidth);
var svg_height=0.9*(document.getElementsByClassName("svg_container")[0].offsetHeight);
svg_saros.attr("viewBox","0 0 "+svg_width.toString()+" "+svg_height.toString());
svg_map.attr("viewBox","0 0 "+svg_width.toString()+" "+svg_height.toString());



//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    LECTURE JEU DE DONNEES
//////////////////////////////////////////////////
//////////////////////////////////////////////////

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


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    FONCTIONS AFFICHAGE DU SAROS
//////////////////////////////////////////////////
//////////////////////////////////////////////////

var formatDate = d3.timeFormat("%d/%m/%Y");
var formatHeure = d3.timeFormat("%H:%M");
var formatDuree = d3.timeFormat("%M'%S''");

function show_saros(e)
{
	//Surligne dans la liste
	items.style("background-color",function(d)
									{
										if(d['Catalog Number']==e['Catalog Number']){return "rgb(230,230,230)";}
										else{return "none";}
									})
	
	
	//Titre : Saros et son numéro
	d3.select(".infos_supp_titre_saros")
	  .text("Saros "+ e['Saros Number'].toString())
	  .style("font-size","0.9em");
	  
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
	saros_item.append("span").html("<i>Largeur (km)</i>");
	  
	
	//Parcourt des polylines
	d3.selectAll("g")
	 .selectAll("path")
	 .attr("stroke-width",function(d){if(d["Catalog Number"]===e["Catalog Number"]){return "3.0";}})
	 .attr("stroke",function(d,i)
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
						if(i==0)
						{
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
						}
						
						
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
	//Enleve le surlignage dans la liste
	items.style("background-color","rgba(0,0,0,0)")
	
	//On repasse au texte par defaut
	d3.select(".infos_supp_titre_saros")
	  .text("Saros")
	  .style("font-size","2em");
	
	//On repasse au texte par defaut 
	d3.select(".infos_supp_multiple_columns_saros")
	  .html("Le saros est une période de 18 ans, 11 jours, 7 heures et 43 minutes.<br/>Si une éclipse solaire se produit à un instant donné, une éclipse similaire aura lieu un saros plus tard car la configuartion relative Soleil-Terre-Lune sera quasiment identique. Il y a en tout 204 séries de saros.<br/><br/><em>Survolez une éclipse pour visualiser son saros.</em>");
	  
	
	//On supprime les saros_items  
	d3.selectAll(".saros_item").remove();
	 
	
	//On supprime les cercles 
	d3.selectAll(".svg_saros circle").remove();
	
	//On remet les polyline par defaut 
	d3.selectAll("g").selectAll("path").attr("stroke","rgba(200,200,200,0.1)")
}


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    AFFICHAGE LISTE ECLIPSES VOLET GAUCHE
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//AFFICHAGE LISTE DES ECLIPSES
//Creation des items

var locked_saros_catalog_number=0;

function lock_elt(d,from_list)
{
	// from_list : booleen qui dit si le clic a été fait sur un elt de la liste (true) ou alors depuis un GE ou un path du saros(false)
	//// GESTION DU LOCK/UNLOCKS
	//cas ou rien n'est locked : on lock l'element
	if(locked_saros_catalog_number==0)
	{
		locked_saros_catalog_number=d['Catalog Number'];
		//Bordure du lock
		items.transition().duration(250).style("border-right",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "3px solid rgb(0,31,63)";}
									else {return "0px solid rgba(0,0,0,0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(-1.7%)";}
									else {return "scale(1.0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(0px)";}
									else {return "scale(1.0)";}
								});
								
		//Affichage du bon saros
		hide_saros();
		show_saros(d);
		//Affichage de la trajectoire sur la map
		GE_onemouseleave();
		GE_onemouseover(d['Catalog Number']-9442)
	}
	//cas où on change d'element à lock
	else if(locked_saros_catalog_number!=d['Catalog Number'])
	{
		locked_saros_catalog_number=d['Catalog Number'];
		//Bordure du lock
		items.transition().duration(250).style("border-right",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "3px solid rgb(0,31,63)";}
									else {return "0px solid rgba(0,0,0,0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(-1.7%)";}
									else {return "scale(1.0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(0px)";}
									else {return "scale(1.0)";}
								});
								
		//Affichage du bon saros
		hide_saros();
		show_saros(d);
		//Affichage de la trajectoire sur la map
		GE_onemouseleave();
		GE_onemouseover(d['Catalog Number']-9442)
	}
	//Sinon : on veut unlock l'elementel
	else
	{
		locked_saros_catalog_number=0;
		//Bordure du lock
		items.transition().duration(250).style("border-right",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "3px solid rgb(0,31,63)";}
									else {return "0px solid rgba(0,0,0,0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(-1.7%)";}
									else {return "scale(1.0)";}
								})
			 .transition().duration(250).style("transform",function(e)
								{
									if(e['Catalog Number']==locked_saros_catalog_number){return "translate(0px)";}
									else {return "scale(1.0)";}
								});
								
		//Affichage du bon saros
		hide_saros();
		show_saros(d);
		//Affichage de la trajectoire sur la map
		GE_onemouseleave();
		GE_onemouseover(d['Catalog Number']-9442)
		//Gestion de la couleur de fond de l'item
		if(from_list==false){items.style("background-color","rgb(250,250,250)")}
	}
}

var items = eclipse_liste_container.selectAll("div").data(data)
						   .enter()
						   .append("div")
						   .attr("class","eclipse_liste_item")
						   .on("mouseenter",function(e){if(locked_saros_catalog_number!=0){return;} show_saros(e);GE_onemouseover(e['Catalog Number']-9442);})
						   .on("mouseleave",function(){if(locked_saros_catalog_number!=0){return;} hide_saros();GE_onemouseleave();})
						   .on("click",function(d){lock_elt(d,true)})


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
								   
								   
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CHOIX DU PARAMETRE A AFFICHER
//////////////////////////////////////////////////
//////////////////////////////////////////////////
	   
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
												d3.select(".choosen_param i").text("Largeur (km)");
												
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
											
//Par defaut : paramètre largeur:
d3.select(".choosen_param i").text("Largeur (km)")
var paramScale = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Path Width (km)']})).range([0,70]);
eclipse_liste_item_param_barre.style("visibility","visible");
eclipse_liste_item_param_span.text(function(d){return d['Path Width (km)'].toString()});
eclipse_liste_item_param_barre.style("width",function(d){return paramScale(d['Path Width (km)']).toString().substring(0,4)+"%"});

											
											


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    GESTION DE LA PERIODE SELECTIONNEE
//////////////////////////////////////////////////
//////////////////////////////////////////////////

//Affichage d'une partie des données seulement  
function show_only_date(mini_year,maxi_year)
{
	var convertToDate=d3.timeParse("%d/%m/%Y");
	var date_min=convertToDate("01/01/"+mini_year.toString());
	var date_max=convertToDate("01/01/"+(maxi_year+1).toString());
	
	items.style("display",function(d)
								{
									if(d['Calendar Date']>date_min && d['Calendar Date']<date_max){return "grid";}
									else{return "none";}
								});
} 
function show_only_type(type)
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

function show_only_type_and_date(type,mini_year,maxi_year)
{
	var convertToDate=d3.timeParse("%d/%m/%Y");
	var date_min=convertToDate("01/01/"+mini_year.toString());
	var date_max=convertToDate("01/01/"+(maxi_year+1).toString());
	
	
	if(type=="P" || type=="A" || type=="T" || type=="H")
	{
		items.style("display",function(d)
								{
									if(d['Eclipse Type'].substring(0,1)==type && d['Calendar Date']>date_min && d['Calendar Date']<date_max){return "grid";}
									else{return "none";}
								}
								);
	}
	else
	{
		items.style("display",function(d)
								{
									if(d['Calendar Date']>date_min && d['Calendar Date']<date_max){return "grid";}
									else{return "none";}
								});
	}
	
	svg_GE.selectAll('circle')

		.style('visibility', function(c,i){
			d = data[i];
			if((d['Eclipse Type'].substring(0,1)==type || type=="ALL") && d['Calendar Date']>date_min && d['Calendar Date']<date_max){
				return "visible";
			}
			else{
				return "hidden";
			}
		})
} 


var selected_type="ALL";
d3.select(".type_P").on("click",function(){selected_type="P";show_only_type_and_date("P",min_year,max_year);});
d3.select(".type_A").on("click",function(){selected_type="A";show_only_type_and_date("A",min_year,max_year);});
d3.select(".type_T").on("click",function(){selected_type="T";show_only_type_and_date("T",min_year,max_year);});
d3.select(".type_H").on("click",function(){selected_type="H";show_only_type_and_date("H",min_year,max_year);});
d3.select(".type_ALL").on("click",function(){selected_type="ALL";show_only_type_and_date("ALL",min_year,max_year);});

//Slider date
var min_year=1970;
var max_year=2070;
$(".date_slider").ionRangeSlider({
        type: "double",
		skin: "round",
        grid: true,
        min: 1970,
        max: 2070,
        from: 1970,
        to: 2070,
		onChange : function(data){min_year=data.from_pretty;
								  max_year=data.to_pretty;
								  max_year=parseInt(max_year.substring(0,1)+max_year.substring(2,5));
								  min_year=parseInt(min_year.substring(0,1)+min_year.substring(2,5));
								  
								  show_only_type_and_date(selected_type,min_year,max_year);
								  show_period_data(min_year,max_year);
								  show_box_data(min_year,max_year);
								  show_treemap_data(min_year,max_year);}
    });

	
	
	
	
	
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CREATION DU GRAPHE SAROS
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// AFFICHAGE DU GRAPHE DES SAROS

//Les echelles
var date_scale=d3.scaleTime()
     				.domain(d3.extent(data, function(d) {return d['Calendar Date'];}))
					.range([0.08*svg_height,0.92*svg_height]);
					      
    
var duration_scale=d3.scaleTime()
				.domain(d3.extent(data, function(d) {return d['Central Duration'];}))
				.range([0.08*svg_height,0.92*svg_height]); 
				
				
var magnitude_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Eclipse Magnitude'];}))
				.range([0.08*svg_height,0.92*svg_height]); 
				
				
var path_scale=d3.scaleLinear()
				.domain(d3.extent(data, function(d) {return d['Path Width (km)'];}))
				.range([0.08*svg_height,0.92*svg_height]); 
				

//Affichage des traits				
var saros_svg_g=svg_saros.selectAll("g")
	 .data(data)
	 .enter()
	 .append("g");
	
saros_svg_g.append("path")	
	 .attr("fill","none")
	 .attr("stroke","rgba(200,200,200,0.1)")
	 .attr("stroke-width","2.0")
	 .on("mouseover",function(e){if(locked_saros_catalog_number!=0){return;} show_saros(e);})
	 .on("mouseout",function(){if(locked_saros_catalog_number!=0){return;} hide_saros()})
	 .attr("d",function(d){return "M "+(0.08*svg_width).toString()+","+date_scale(d['Calendar Date']).toString()+" "
								 +"C "+(0.22*svg_width).toString()+","+date_scale(d['Calendar Date']).toString()+" "
								      +(0.22*svg_width).toString()+","+duration_scale(d['Central Duration']).toString()+" "
									  +(0.36*svg_width).toString()+","+duration_scale(d['Central Duration']).toString()}
									  );
saros_svg_g.append("path")	
	 .attr("fill","none")
	 .attr("stroke","rgba(200,200,200,0.1)")
	 .attr("stroke-width","2.0")
	 .on("mouseover",function(e){if(locked_saros_catalog_number!=0){return;} show_saros(e);})
	 .on("mouseout",function(){if(locked_saros_catalog_number!=0){return;} hide_saros()})
	 .attr("d",function(d){return "M "+(0.36*svg_width).toString()+","+duration_scale(d['Central Duration']).toString()+" "
								 +"C "+(0.50*svg_width).toString()+","+duration_scale(d['Central Duration']).toString()+" "
								      +(0.50*svg_width).toString()+","+magnitude_scale(d['Eclipse Magnitude']).toString()+" "
									  +(0.64*svg_width).toString()+","+magnitude_scale(d['Eclipse Magnitude']).toString()}
									  );
saros_svg_g.append("path")	
	 .attr("fill","none")
	 .attr("stroke","rgba(200,200,200,0.1)")
	 .attr("stroke-width","2.0")
	 .on("mouseover",function(e){if(locked_saros_catalog_number!=0){return;} show_saros(e);})
	 .on("mouseout",function(){if(locked_saros_catalog_number!=0){return;} hide_saros()})
	 .attr("d",function(d){return "M "+(0.64*svg_width).toString()+","+magnitude_scale(d['Eclipse Magnitude']).toString()+" "
								 +"C "+(0.78*svg_width).toString()+","+magnitude_scale(d['Eclipse Magnitude']).toString()+" "
								      +(0.78*svg_width).toString()+","+path_scale(d['Path Width (km)']).toString()+" "
									  +(0.92*svg_width).toString()+","+path_scale(d['Path Width (km)']).toString()}
									  );

	 
//Affichage des axes
svg_saros.append("line")
   .attr("x1",(0.08*svg_width).toString())
   .attr("x2",(0.08*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","rgb(0, 31, 63)")
   .attr("stroke-width","2.4");
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
					+" "
					+(0.08*svg_width).toString()
					+","
					+(0.975*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","rgb(0, 31, 63)");

svg_saros.append("line")
   .attr("x1",(0.36*svg_width).toString())
   .attr("x2",(0.36*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","rgb(0, 31, 63)")
   .attr("stroke-width","2.4"); 
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
					+" "
					+(0.36*svg_width).toString()
					+","
					+(0.975*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","rgb(0, 31, 63)");
   
svg_saros.append("line")
   .attr("x1",(0.64*svg_width).toString())
   .attr("x2",(0.64*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","rgb(0, 31, 63)")
   .attr("stroke-width","2.4");
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
					+" "
					+(0.64*svg_width).toString()
					+","
					+(0.975*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","rgb(0, 31, 63)");
   
svg_saros.append("line")
   .attr("x1",(0.92*svg_width).toString())
   .attr("x2",(0.92*svg_width).toString())
   .attr("y1",(0.02*svg_height).toString())
   .attr("y2",(0.98*svg_height).toString())
   .attr("stroke","rgb(0, 31, 63)")
   .attr("stroke-width","2.4");
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
					+" "
					+(0.92*svg_width).toString()
					+","
					+(0.975*svg_height).toString()
					+" ")
   .attr("stroke","none")
   .attr("fill","rgb(0, 31, 63)");
   


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CREATION DE LA MAP
//////////////////////////////////////////////////
//////////////////////////////////////////////////


// layers:
var svg_continent = svg_map.append('g');

var svg_path = svg_map.append('g');
var svg_GE = svg_map.append('g');

var graticule = d3.geoGraticule();


var projection = d3.geoKavrayskiy7()
	.scale(115*svg_width/769)
	.translate([svg_width / 2, svg_height / 2])
	.precision(.1)
	.rotate([-11,0]);

var formatDate_Ymd = d3.timeFormat("%Y-%m-%d");


// affichage des GE de chaque eclipses sur la map

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
		.style("fill", "rgb(245,245,245)");  

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


function showPath(id, eclipsePath) {
	var d = data[id];
	var date = formatDate_Ymd(d['Calendar Date']);

	path = eclipsePath.cartographicDegrees[date];

	if(path == undefined) {
		//On cache tout
		for(var i=0;i<svg_path.selectAll("circle").size();i++)
		{
			svg_path.select("circle:nth-child("+i.toString()+")")
					.attr("fill","rgba(0,0,0,0)");
		}
		
		return false;
	}
	
	var points=[]
	for(var i=0; i< path.length; i+=2){        
		var point = [path[i], path[i+1]];
		var proj = projection(point);
		points.push(proj);
	}
	
	var nb_circles=svg_path.selectAll("circle").size();
	var nb_points=points.length;
	
	if(nb_points>=nb_circles)
	{
		//On bouge les cercles deja présents
		for(var i=0;i<nb_circles;i++)
		{
			svg_path.select("circle:nth-child("+i.toString()+")")
					.attr("cx",points[i][0]) 
					.attr("cy",points[i][1])
					.attr("r",1)
					.attr("fill","green");
		}
		
		//On crée les cercles manquants
		for(var i=nb_circles; i< nb_points; i+=1)
		{        
			svg_path.append("circle")
				.attr("cx",points[i][0]) 
				.attr("cy",points[i][1])
				.attr("r",1)
				.attr("fill","green");
		}
	}
	else
	{
		//On bouge les cercles deja présents
		for(var i=0;i<nb_points;i++)
		{
			svg_path.select("circle:nth-child("+i.toString()+")")
					.attr("cx",points[i][0]) 
					.attr("cy",points[i][1])
					.attr("r",1)
					.attr("fill","green");
		}
		
		for(var i=nb_points;i<nb_circles;i++)
		{
			svg_path.select("circle:nth-child("+i.toString()+")")
					.attr("fill","rgba(0,0,0,0)");
		}
				
	}
	return true;
};

function showOnePathOnMap(id){
	
	d3.json("https://raw.githubusercontent.com/Daniel-Dht/solarEclipse-viz/master/all_paths.json", function(eclipsePath){	
				
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



function showGEonMap(){
	data.forEach(function(d,i)
	{       
		var point = [d['Longitude'], d['Latitude']]
		var proj = projection(point)
		//console.log(point);
		svg_GE.append('circle')
			.attr("cx",proj[0]) 
			.attr("cy",proj[1])
			.attr("r", 0.05*path_scale(d['Path Width (km)']))
			.style("fill","green")
			.style('opacity','0.5')
	}); 
};

function GE_interaction(){
	svg_GE.selectAll('circle')
		.on("mouseenter", function(d1,i1) {	
			if(locked_saros_catalog_number!=0){return;}		
			GE_onemouseover(i1);
		})
		.on("mouseleave", function() { 
			if(locked_saros_catalog_number!=0){return;}
			GE_onemouseleave();
		})
		.on("click",function(d,i){scrollTo(i+9442)});
}

function GE_onemouseover(i1){
	// hide all + show path
	path_exist = showOnePathOnMap(i1);
	// console.log("2->", path_exist)
	// if(!path_exist){
	// 	d3.select(".infos_supp_multiple_columns_map").html('éclipse sans trajectoires')
	// }
	

	svg_GE.selectAll('circle')
		.style('fill', function(d2,i2){						
			if(i1==i2){
				return "green";                
			} else { 
				return "rgba(0,0,0,0)";
			}						
		})	
}


function GE_onemouseleave(){
	//d3.select(".infos_supp_multiple_columns_map").html('Infos sur la map')
	//svg_path.selectAll("circle").remove();
	//svg_path.html("");
	
	//On cache les points
	for(var i=0;i<svg_path.selectAll("circle").size();i++)
		{
			svg_path.select("circle:nth-child("+i.toString()+")")
					.attr("fill","rgba(0,0,0,0)");
		}
	
	var convertToDate=d3.timeParse("%d/%m/%Y");
	var date_min=convertToDate("01/01/" +  min_year.toString());
	var date_max=convertToDate("01/01/" + (max_year+1).toString());

	svg_GE.selectAll('circle').style('fill', function(c,i){
			var d = data[i];
			var type_selected = d['Eclipse Type'].substring(0,1) == selected_type || selected_type=="ALL"
			var date_in_selection = d['Calendar Date']>date_min && d['Calendar Date']<date_max
			if(type_selected && date_in_selection){
				return "green";
			} else{
				return "rgba(0,0,0,0)";
			}
		});
}

showContinents();
showGEonMap();
GE_interaction();
show_only_type_and_date(selected_type,min_year,max_year);


//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CREATION DE LA TREEMAP
//////////////////////////////////////////////////
//////////////////////////////////////////////////


treemap_svg=d3.select(".treemap_svg");

var treemap_svg_size=0.87*(document.getElementsByClassName("infos_supp_mat_left")[0].offsetHeight);

var treemap_svg_width = (document.getElementsByClassName("infos_supp_mat_left_titles")[0].offsetWidth)
					   +(document.getElementsByClassName("infos_supp_mat_left_min_vals")[0].offsetWidth)
					   +(document.getElementsByClassName("infos_supp_mat_left_max_vals")[0].offsetWidth)
					   +0.87*(document.getElementsByClassName("infos_supp_mat_left")[0].offsetHeight);
					   

treemap_svg.style("width",treemap_svg_width);
treemap_svg.style("height",treemap_svg_size);
treemap_svg.attr("viewBox","0 0 "+treemap_svg_width.toString()+" "+treemap_svg_size.toString());



function show_treemap_data(mini_year,maxi_year)
{
	//Nb eclipses
	var nb_eclipses_P=0;
	var nb_eclipses_A=0;
	var nb_eclipses_T=0;
	var nb_eclipses_H=0;
	
	for(var i=0 ; i<data.length ;i=i+1)
	{
		var year=parseInt(data[i]['Calendar Date'].toString().substring(11,15));
		var type=data[i]['Eclipse Type'].toString().substring(0,1);
		
		if(year>=mini_year && year<=maxi_year)
		{
			if(type=="P"){nb_eclipses_P+=1;}
			if(type=="A"){nb_eclipses_A+=1;}
			if(type=="T"){nb_eclipses_T+=1;}
			if(type=="H"){nb_eclipses_H+=1;}
		}
	}
	
	//Calcul de la treemap
	var data_treemap={
	"name":"Root",
	"children":[{"name":"◐","value":nb_eclipses_P},
					{"name":"⦿","value":nb_eclipses_A},
					{"name":"⬤","value":nb_eclipses_T},
					{"name":"◍","value":nb_eclipses_H}]
	}
	
	var root = d3.hierarchy(data_treemap);
	var treemapLayout = d3.treemap();
	treemapLayout
	  .size([treemap_svg_width, treemap_svg_size])
	  .paddingOuter(10)
	  .paddingInner(2)
	  .tile(d3.treemapSquarify.ratio(1));
	 
	root.sum(function(d) {
	  return d.value;
	});

	treemapLayout(root);
	
	treemap_svg.html("");

	treemap_svg.selectAll('rect')
	  .data(root.descendants())
	  .enter()
	  .append('rect')
	  .attr('x', function(d) { return d.x0; })
	  .attr('y', function(d) { return d.y0; })
	  .attr('width', function(d) { return d.x1 - d.x0; })
	  .attr('height', function(d) { return d.y1 - d.y0; })
	  .attr('fill', function(d,i) {if(i==0){return "white";} return "rgb(0,31,63)";});
	  

	treemap_svg.selectAll('text')
	  .data(root.descendants())
	  .enter()
	  .append('text')
	  .text(function(d,i) 
			{
				if(i==0){return "";}
				if(d.data.value==0) {return "";}
				return d.data.name + " " +d.data.value.toString();
			})
	  .attr("x",function(d) { return d.x0+2;})
	  .attr("y",function(d,i) { if(i==4){return d.y0+9;} return d.y0+13;})
	  .attr("font-size",function(d,i) {if(i==4){return "9";} return "12";})
	  .attr("fill","rgba(255,255,255,0.9)");

}

show_treemap_data(1970,2070);




//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CREATION PETITES STATS PERIODE
//////////////////////////////////////////////////
//////////////////////////////////////////////////

function show_period_data(mini_year,maxi_year)
{
	//Periode
	d3.select(".infos_supp_mat_middle_period").text(mini_year.toString()+" - "+maxi_year.toString());
	//Duree
	var intervalle=maxi_year-mini_year+1;
	d3.select(".infos_supp_mat_middle_nb_years").text(function(){
													if(intervalle>1){return intervalle.toString()+" ans";}
													else {return intervalle.toString()+" an"}
													});
	//Nb eclipses
	var nb_eclipses=0;
	for(var i=0 ; i<data.length ;i=i+1)
	{
		var year=parseInt(data[i]['Calendar Date'].toString().substring(11,15));
		if(year>=mini_year && year<=maxi_year){nb_eclipses=nb_eclipses+1;}
	}
	d3.select(".infos_supp_mat_middle_nb_eclipses").text(function(){
													if(nb_eclipses>1){return nb_eclipses.toString()+" éclipses";}
													else {return nb_eclipses.toString()+" éclipse"}
													});
													
	//Taux d'eclipses
	d3.select(".infos_supp_mat_middle_eclipses_rate").text((nb_eclipses/intervalle).toString().substring(0,4)+" éclipses/an");
}

show_period_data(1970,2070);




//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    CREATION DIAGRAMME MOUSTACHE
//////////////////////////////////////////////////
//////////////////////////////////////////////////

box_svg=d3.select(".box_svg");

var box_svg_size=0.87*(document.getElementsByClassName("infos_supp_mat_left")[0].offsetHeight);
box_svg.style("width",treemap_svg_size);
box_svg.style("height",treemap_svg_size);
box_svg.attr("viewBox","0 0 100 100");

// ligne 1
box_svg.append("line")
	   .attr("x1","0")
	   .attr("x2","100")
	   .attr("y1",(100/6).toString())
	   .attr("y2",(100/6).toString())
	   .attr("stroke","rgb(0,31,63)")
	   .attr("stroke-width","0.8");
// ligne 2   
box_svg.append("line")
	   .attr("x1","0")
	   .attr("x2","100")
	   .attr("y1",(3*100/6).toString())
	   .attr("y2",(3*100/6).toString())
	   .attr("stroke","rgb(0,31,63)")
	   .attr("stroke-width","0.8");
// ligne 3
box_svg.append("line")
	   .attr("x1","0")
	   .attr("x2","100")
	   .attr("y1",(5*100/6).toString())
	   .attr("y2",(5*100/6).toString())
	   .attr("stroke","rgb(0,31,63)")
	   .attr("stroke-width","0.8");

var stats_data={"Duree":{"mu":85,"sigma":4},
				"Ratio":{"mu":38,"sigma":12},
			    "Longueur":{"mu":53,"sigma":20}};
				
function update_box_plot(stats)
{
	//on clean ce qu'il y a deja
	box_svg.selectAll("circle").remove();
	box_svg.selectAll(".big_line").remove();
	box_svg.selectAll(".limit").remove();
	
	//On ajoute la moyenne
	//Duree
	box_svg.append("circle")
			.attr("cx",stats.Duree.mu.toString()) 
			.attr("cy",(100/6).toString())
			.attr("r",3)
			.style("fill","rgb(0,31,63)");
	//Ratio
	box_svg.append("circle")
			.attr("cx",stats.Ratio.mu.toString()) 
			.attr("cy",(3*100/6).toString())
			.attr("r",3)
			.style("fill","rgb(0,31,63)");
	//Longueur
	box_svg.append("circle")
			.attr("cx",stats.Longueur.mu.toString()) 
			.attr("cy",(5*100/6).toString())
			.attr("r",3)
			.style("fill","rgb(0,31,63)");

	//On ajoute l'ecart-type (ligne centrale)
	//Duree
	box_svg.append("line")
			.attr("class","big_line")
			.attr("x1",(stats.Duree.mu-stats.Duree.sigma).toString())
		   .attr("x2",(stats.Duree.mu+stats.Duree.sigma).toString())
		   .attr("y1",(100/6).toString())
		   .attr("y2",(100/6).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","2.5");
	//Ratio
	box_svg.append("line")
			.attr("class","big_line")
			.attr("x1",(stats.Ratio.mu-stats.Ratio.sigma).toString())
		   .attr("x2",(stats.Ratio.mu+stats.Ratio.sigma).toString())
		   .attr("y1",(3*100/6).toString())
		   .attr("y2",(3*100/6).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","2.5");
	//Longueur
	box_svg.append("line")
			.attr("class","big_line")
			.attr("x1",(stats.Longueur.mu-stats.Longueur.sigma).toString())
		   .attr("x2",(stats.Longueur.mu+stats.Longueur.sigma).toString())
		   .attr("y1",(5*100/6).toString())
		   .attr("y2",(5*100/6).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","2.5");
		   
		   
	//On ajoute l'ecart-type (bornes)
	//Duree
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Duree.mu-stats.Duree.sigma).toString())
		   .attr("x2",(stats.Duree.mu-stats.Duree.sigma).toString())
		   .attr("y1",(100/6+3).toString())
		   .attr("y2",(100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Duree.mu+stats.Duree.sigma).toString())
		   .attr("x2",(stats.Duree.mu+stats.Duree.sigma).toString())
		   .attr("y1",(100/6+3).toString())
		   .attr("y2",(100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
	//Ratio
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Ratio.mu-stats.Ratio.sigma).toString())
		   .attr("x2",(stats.Ratio.mu-stats.Ratio.sigma).toString())
		   .attr("y1",(3*100/6+3).toString())
		   .attr("y2",(3*100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Ratio.mu+stats.Ratio.sigma).toString())
		   .attr("x2",(stats.Ratio.mu+stats.Ratio.sigma).toString())
		   .attr("y1",(3*100/6+3).toString())
		   .attr("y2",(3*100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
	//Longueur
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Longueur.mu-stats.Longueur.sigma).toString())
		   .attr("x2",(stats.Longueur.mu-stats.Longueur.sigma).toString())
		   .attr("y1",(5*100/6+3).toString())
		   .attr("y2",(5*100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
	box_svg.append("line")
			.attr("class","limit")
			.attr("x1",(stats.Longueur.mu+stats.Longueur.sigma).toString())
		   .attr("x2",(stats.Longueur.mu+stats.Longueur.sigma).toString())
		   .attr("y1",(5*100/6+3).toString())
		   .attr("y2",(5*100/6-3).toString())
		   .attr("stroke","rgb(0,31,63)")
		   .attr("stroke-width","1.5");
}


var formatDureeStats = d3.timeFormat("%M:%S");
function convert_min_sec(duree)
{
	var duration = formatDureeStats(duree);
	var float_duration=parseFloat(duration.substring(0,2))+parseFloat(duration.substring(3,5))/60;
	return float_duration;
}

var scale_stat_duree = d3.scaleLinear().domain(d3.extent(data,function(d){return convert_min_sec(d['Central Duration'])})).range([0,100]);
var scale_stat_longueur = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Path Width (km)']})).range([0,100]);
var scale_stat_ratio = d3.scaleLinear().domain(d3.extent(data,function(d){return d['Eclipse Magnitude']})).range([0,100]);

function show_box_data(mini_year,maxi_year)
{
	//Nb eclipses
	var nb_eclipses=0;
	var moy_duree=0;
	var moy_longueur=0;
	var moy_ratio=0;
	for(var i=0 ; i<data.length ;i=i+1)
	{
		var year=parseInt(data[i]['Calendar Date'].toString().substring(11,15));
		if(year>=mini_year && year<=maxi_year)
		{
			nb_eclipses=nb_eclipses+1;
			moy_duree+=convert_min_sec(data[i]['Central Duration']);
			moy_longueur+=data[i]['Path Width (km)'];
			moy_ratio+=data[i]['Eclipse Magnitude'];
		}
	}
	moy_duree=moy_duree/nb_eclipses;
	moy_longueur=moy_longueur/nb_eclipses;
	moy_ratio=moy_ratio/nb_eclipses;
	
	var etype_duree=0;
	var etype_longueur=0;
	var etype_ratio=0;
	for(var i=0 ; i<data.length ;i=i+1)
	{
		var year=parseInt(data[i]['Calendar Date'].toString().substring(11,15));
		if(year>=mini_year && year<=maxi_year)
		{
			etype_duree+=Math.pow((convert_min_sec(data[i]['Central Duration'])-moy_duree),2);
			etype_longueur+=Math.pow((data[i]['Path Width (km)']-moy_longueur),2);
			etype_ratio+=Math.pow((data[i]['Eclipse Magnitude']-moy_ratio),2);
		}
	}
	if(nb_eclipses<2)
	{
		etype_duree=0;
		etype_longueur=0;
		etype_ratio=0;
	}
	else
	{
		etype_duree=Math.sqrt(etype_duree/(nb_eclipses-1));
		etype_longueur=Math.sqrt(etype_longueur/(nb_eclipses-1));
		etype_ratio=Math.sqrt(etype_ratio/(nb_eclipses-1));
	}
	
	var stats_period={"Duree":{"mu":scale_stat_duree(moy_duree),"sigma":0.5*scale_stat_duree(etype_duree)},
				"Ratio":{"mu":scale_stat_longueur(moy_longueur),"sigma":0.5*scale_stat_longueur(etype_longueur)},
			    "Longueur":{"mu":scale_stat_ratio(etype_ratio),"sigma":0.5*scale_stat_ratio(etype_ratio)}};
				
	
	update_box_plot(stats_period);	
}

show_box_data(1970,2070);



//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    GESTION SWITCH : MAP <-> SAROS
//////////////////////////////////////////////////
//////////////////////////////////////////////////

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
		
		//show_only_type_and_date("ALL",1970,2070);
	}
	else 
	{
		svg_container_saros.style("display","none");
		infos_supp_saros.style("display","none");
		svg_container_map.style("display","block");
		infos_supp_map.style("display","grid");
		
		map_button.style("color","rgb(0,31,63)");
		saros_button.style("color","rgb(200,200,200)");
		switch_button.style("justify-content","flex-start");
		
		show_only_type_and_date("ALL",min_year,max_year);
	}
}

map_button.on("click",function(){switch_to("map");});
saros_button.on("click",function(){switch_to("saros");});
var switch_button=d3.select(".switch").on("click",function()
												{
													if(svg_container_saros.style("display")=="block"){switch_to("map");}
													else{switch_to("saros");}
												});
//infos_supp_saros.style("display","none");
// Par défaut : map
switch_to("map");




//////////////////////////////////////////////////
//////////////////////////////////////////////////
//    GESTION SCROLL DANS LISTE ITEM
//////////////////////////////////////////////////
//////////////////////////////////////////////////

function scrollTo(catal_number)
{
	//La div a scroller
	var ecl_list=document.getElementsByClassName("eclipse_liste_container")[0];
	//Retrouver quel est lea place de la div
	var ind=0;
	items.attr("id",function(d,i)
					{
						if(d['Catalog Number']==catal_number) { ind=i; lock_elt(d,false); }
						return "";
					});
	var ecl_item=document.getElementsByClassName("eclipse_liste_item")[ind+1];
	//Puis on scroll
	ecl_list.scrollTop=(ecl_item.offsetTop-ecl_list.offsetTop-100);
}



});