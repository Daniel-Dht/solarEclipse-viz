<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Eclipses solaires - visualisation</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css?family=Oswald|PT+Sans+Narrow&display=swap" rel="stylesheet">
  <script src="https://d3js.org/d3.v4.min.js"></script>
</head>


<body>

	<!-- Panneau de gauche avec le logo, la légende et la liste des eclipses -->
	<div class="left_panel">
	
		<!-- D'abord le logo-->
		<div class="logo">LOGO ECLIPSE VIZ</div>
		
		<!-- Puis la légende des symboles pour les types d'éclipses -->
		<div class="eclipse_type_legende">
			<!-- Eclipse partielle-->
			<div>
				<span class="eclipse_type_legende_symbol">&#9680;</span><span>Partielle</span>
			</div>
			<!-- Eclipse annulaire-->
			<div>
				<span class="eclipse_type_legende_symbol">&#10687;</span><span>Annulaire</span>
			</div>
			<!-- Eclipse totale-->
			<div>
				<span class="eclipse_type_legende_symbol">&#11044;</span><span>Totale</span>
			</div>
			<!-- Eclipse hybride-->
			<div>
				<span class="eclipse_type_legende_symbol">&#9677;</span><span>Hybride</span>
			</div>
		</div>
		
		<!-- Le titre des variables bien alignees -->
		<div class="eclipse_liste_item">
			<div class="eclipse_liste_item_date"><i>Date</i></div>
			<div class="eclipse_liste_item_heure"><i>Heure</i></div>
			<div class="eclipse_liste_item_type"><i>Type</i></div>
			<div class="eclipse_liste_item_param selector">
				<!-- Choix du param -->
				<span class="choosen_param"><i>Paramètre</i></span><span style="margin-left:30px;">&#9660;</span>
				<div class="choose_param">
					<div class="choose_param_ratio">Ratio</div>
					<div class="choose_param_longueur">Longueur</div>
					<div class="choose_param_duree">Durée</div>
					<div class="choose_param_gamma">Gamma</div>
				</div>
				
			</div>
		</div>
		
		<!-- La liste des eclipses, les variables bien alignees -->
		<div class="eclipse_liste_container">
		
			<!--
			//Les items 
			<div class="eclipse_liste_item">
				<div class="eclipse_liste_item_date">01/01/2019</div>
				<div class="eclipse_liste_item_heure">13:34</div>
				<div class="eclipse_liste_item_type">&#11044;</div>
				<div class="eclipse_liste_item_param">
					//La barre et le nombre
					<div class="barre">'</div>
					<span>1287</span>
				</div>
			</div>
			<div class="eclipse_liste_item">
				<div class="eclipse_liste_item_date">03/05/2020</div>
				<div class="eclipse_liste_item_heure">02:29</div>
				<div class="eclipse_liste_item_type">&#10687;</div>
				<div class="eclipse_liste_item_param">
					// La barre et le nombre
					<div class="barre" style="width:20%;">'</div>
					<span>247</span>
				</div>
			</div>
			-->
			
		</div>
		
	</div>
	
	
	
	<!-- Zone d'affchage à droite -->
	<div class="display">
		<!-- Bouton de switch entre Map et Saros -->
		<div class="switch_container">
			<!-- Symbole Map -->
			<span style="color:rgb(0,31,63);">&#128506;</span>
			<!-- switch bouton -->
			<div class="switch">
				<div class="switch_circle">-</div>
			</div>
			<!-- Symbole Saros -->
			<span style="color:rgb(200,200,200);">&#10561;</span>
		</div>
		
		<!-- La zone svg -->
		<div class="svg_container">
			<div class="axes_title">
				<span>Date</span>
				<span>Durée</span>
				<span>Ratio</span>
				<span>Longueur</span>
			</div>
			<svg></svg>
		</div>
		
		<!-- Quelques infos supplémentaires -->
		<div class="infos_supp">
			<!-- Le titre -->
			<div class="infos_supp_titre">Saros</div>
			<!-- Les infos sur plusieurs colonnes -->
			<div class="infos_supp_multiple_columns">
				Survoler une éclipse solaire
			</div>
		</div>
	</div>
	


<script src="script.js"></script>
</body>


</html>