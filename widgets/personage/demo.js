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
			var pers = results.filter(function(e){return (e.get('entityhub:entityRank')>0.5)&&(e.isof('dbpedia:Person'));}); //Filter found entities to be only persons
			for(var p in pers){
				var person = pers[p];
				var person_name = person.get('name').filter(function(n){debugger; return n['@language']=='en';}).toString();
				var about = person.getSubjectUri();
				var person_div = $('<div class="person-entity" about="' + about + '"><h5>' + person_name + '<h5><div class="person-entity-image"></div>');

				$('#persons').append(person_div);
			}
		
    });
    //activate draggables
    var persons = $('article').find('[typeof="Person"]');
    $(persons).each(function(){
        entityDrag(this);
    });
	
	persons
	.attr("title", "Drag-and-drop entity on an image tag. This will create a semantic relation between the entity and the image annotation.")
	.tipTip();

	$('#start')
	.attr("title", "Click on the button to start face detection and image annotation.")
	.tipTip();
  //highlight photo on hover
    $(persons).each(function() {
        $(this).hover(
            function()  {
				$(this).addClass('hover');
                var about = $(this).attr('about');
                var person_entity= myVIE.entities.get(about);
                if (person_entity) {
					var images = getImage(person_entity);
                    $(images).each(function(){
						$(this).addClass("f_tag_trans_hover");
					});
                }
            }, 
            function()  { 
				$(this).removeClass('hover');
                var about = $(this).attr('about');
                var person_entity= myVIE.entities.get(about);
                if (person_entity) {
                    var images = getImage(person_entity);
                    $(images).each(function(){
						$(this).removeClass("f_tag_trans_hover");
					});
                }
            }
        )
    });
});

function getImage(person_entity){
	var images = [];
	var fragment_id = person_entity.get('annotatedIMG');
	if(fragment_id){
		fragment_id = jQuery.isArray(fragment_id)? fragment_id: [fragment_id];
		for(var i = 0; i < fragment_id.length; i++){		
			var mediaEntity = myVIE.entities.get(fragment_id[i]);
			var height = mediaEntity.get( 'schema:height');
			var width = mediaEntity.get('schema:width');
			var x = mediaEntity.get('x');
			var y = mediaEntity.get('y');
			var photo_url = mediaEntity.get('parentImage');
			photo_url = mediaEntity.isEntity? photo_url.getSubjectUri(): photo_url.replace(/<|>/,'');
			var imgElement = $('[fheight="'+ height + '"][fwidth="'+ width +'" ][fx="'+ x +'"][fy="'+ y +'"][fsrc="'+ photo_url+'"]');
			images.push(imgElement);
		}
	}
	return images;
}

function startAnnotation(){
    //initialize face tagger 
    $('#photos').viePersonage({
        FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd",
		FACE_API_SECRET: "36358726496a759433291efe408da188",
        myVIE: myVIE,
		done: imageResults
    });
}
  function replaceText(text) {
    $("article").html(text);
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
 
 function imageResults(entities){
	for(var f = 0; f < entities.length; f++){
		var fragment = entities[f];
		var fragment_id = fragment.getSubjectUri();
		var fragment_div = $('<div class="person-entity" about="' + fragment_id + '"><h5>Fragment' + f + '<h5><div class="person-entity-image"></div>');
		$('#fragments').append(fragment_div);
	}
 }