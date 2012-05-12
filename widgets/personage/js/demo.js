$ (function ()  {

  var text = ("<h1> The Beatles</h1>" +
              "The Beatles were an English rock band formed in Liverpool in 1960," +
              " and one of the most commercially successful and critically acclaimed acts in the history of popular music." +
              " The group's best-known lineup consisted of <span about=\"http://dbpedia.org/resource/John_Lennon\" typeof= \"Person\"> John Lennon </span> (rhythm guitar, vocals)," +
              " <span about=\"http://dbpedia.org/resource/Paul_McCartney\" typeof=\"Person\"> Paul McCartney </span> (bass guitar, vocals)," +
              " <span about=\"http://dbpedia.org/resource/George_Harrison\" typeof=\"Person\"> George Harrison </span>(lead guitar, vocals)" +
              " and <span about=\"http://dbpedia.org/resource/Ringo_Starr\" typeof=\"Person\"> Ringo Starr </span>(drums, vocals). Rooted in skiffle and 1950s rock and roll," +
              " the group later worked in many genres ranging from pop ballad s to psychedelic rock," +
              " often incorporating classical and other elements in innovative ways." +
              " Their enormous popularity first emerged as \"Beatlemania\";" +
              " as their songwriting grew in sophistication by the late 1960s," +
              " they came to be perceived by many fans and cultural observers as" +
              " an embodiment of the ideals shared by the era's sociocultural revolutions.");
	replaceText(text);
	urlImage = 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Fabs.JPG/600px-The_Fabs.JPG';
	replaceImage (urlImage);

	//Instantiate VIE and load entities
	var entities = [
		'http://dbpedia.org/resource/John_Lennon',
		'http://dbpedia.org/resource/George_Harrison',
		'http://dbpedia.org/resource/Ringo_Starr',
		'http://dbpedia.org/resource/Paul_McCartney'
		];
	var myVIE = window.myVIE = new VIE();
	myVIE.use(new myVIE.DBPediaService());
	myVIE
	.load({entity: entities})
	.using('dbpedia')
	.execute()
	.done(function(){
	});

	//initialize face tagger 
	$('#sample_img').viePersonage({
		FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd",
		myVIE: myVIE
	});
	//activate draggables
	var persons = $('#content').children('[typeof="Person"]');
	$(persons).each(function(){
		entityDrag(this);
	});

	$(persons).each(function() {
        	$(this).hover(
			function()  { 
		            console.log ("this" + this);
        		    var about = $(this).attr('about');
        	            var person_entity= myVIE.entities.get(about);
        		    console.log (person_entity);
	        	    if (person_entity) {
        	        	var annotatatedIMG = person_entity.get ('annotatedIMG');
	                	var imgElement= $('[tid = "' + annotatedIMG + '"]');
		                $(imgElement).css("{border: 1 px solid navy }"); 
        		    }
		        }, 
			function() { 
				var about = $(this).attr('about');
				var person_entity= myVIE.entites.get(about);
				console.log (person_entity);
				if (person_entity) {
					var annotatatedIMG = person_entity.get ('annotatedIMG');
					var imgElement= $('[tid = "' + annotatedIMG + '"]');
					$(imgElement).css("{border: 0 px}");
				}; 
			}   
		)
	});
	
	$('[tid]').livequery('hover',function(){
			var tid = $(this).attr('tid');
			var x = $(this).attr('fx');
			var y = $(this).attr('fy');
			var h = $(this).attr('fheight');
			var w = $(this).attr('fwidth');
			var photo_url = $(this).attr('fsrc');
			var fragment_id = (h && w && x && y && photo_url)? (photo_url + '#xywh=percent:' + x + ',' + y + ',' + w + ',' + h): tid;
			var entity = myVIE.entities.get(fragment_id);
			if(entity){
				var subject = entity.get('_base: about');
			}
	});

});

function replaceText(text) {
	$("#content").html(text);
};

function replaceImage(urlImage) {
	$("#sample_img").attr('src', urlImage);
};

function entityDrag(element){
	$(element).draggable({
		stop: function(){
			$(this).css({
				left: '',
				top: ''
			});
		}
	});
	
	
	
}