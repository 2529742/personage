$ (function ()  {
    //Instantiate VIE and load entities
    var entities = [
        'http://dbpedia.org/resource/John_Lennon',
        'http://dbpedia.org/resource/George_Harrison',
        'http://dbpedia.org/resource/Ringo_Starr',
        'http://dbpedia.org/resource/Paul_McCartney'
    ];
	var content = $('article');
    var myVIE = window.myVIE = new VIE();
    myVIE.use(new myVIE.StanbolService, 'stanbol');
    myVIE
	.analyze({
        element: content
    })
    .using('stanbol')
    .execute()
    .done(function(results){
	//visualize extracted persons
			var pers = results.filter(function(e){return (e.get('entityhub:entityRank')>0.5)&&(e.isof('dbpedia:Person'));}); //Filter found entities to be only persons
			for(var p in pers){
				var person = pers[p];
				var person_name = person.get('name').filter(function(n){debugger; return n['@language']=='en';}).toString();
				var about = person.getSubjectUri();
				var person_div = $('<div class="person-entity" about="' + about + '"><h5>' + person_name + '<h5><div class="person-entity-image"></div>');

				$('#persons').append(person_div);
			}
		
    });
    
	$('#start')
	.attr("title", "Click on the button to start face detection and image annotation.")
	.tipTip();
});


function startAnnotation(){
    //initialize face tagger 
    $('#photos').viePersonage({
        FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd",
		FACE_API_SECRET: "36358726496a759433291efe408da188",
        myVIE: myVIE,
		done: imageResults
    });
}
 function imageResults(entities){
	for(var f = 0; f < entities.length; f++){
		var fragment = entities[f];
		var fragment_id = fragment.getSubjectUri();
		var fragment_div = $('<div class="person-entity" about="' + fragment_id + '"><h5>Fragment' + f + '<h5><div class="person-entity-image"></div>');
		$('#fragments').append(fragment_div);
	}
 }