$ (function ()  {

  var text = ("<h2> The Beatles</h2>" +
              "<section>The Beatles were an English rock band formed in Liverpool in 1960," +
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
              " an embodiment of the ideals shared by the era's sociocultural revolutions.</section><br/>");
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
	var content = $('article');
    var myVIE = window.myVIE = new VIE();
    myVIE.use(new myVIE.StanbolService, 'stanbol');
    myVIE
	.analyze({
        element: content
    })
    .using('stanbol')
    .execute()
    .done(function(){
    });
    //activate draggables
    var persons = $('article').find('[typeof="Person"]');
    $(persons).each(function(){
        entityDrag(this);
    });
	
	persons
	.attr("title", "You can drag the entity and drop it on the image tag to create a semantic relation between the Person and it's image annotation.")
	.tipTip();

	$('#start')
	.attr("title", "Press the button to start the face detection an the image annotation.")
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
	return images;
}

function startAnnotation(){
    //initialize face tagger 
    $('#photos').viePersonage({
        FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd",
		FACE_API_SECRET: "36358726496a759433291efe408da188",
        myVIE: myVIE
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