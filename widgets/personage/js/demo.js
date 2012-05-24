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

    //activate draggables
    var persons = $('#content').children('[typeof="Person"]');
    $(persons).each(function(){
        entityDrag(this);
    });
    
  //highlight photo on hover
    $(persons).each(function() {
        $(this).hover(
            function()  {
                var about = $(this).attr('about');
                var person_entity= myVIE.entities.get(about);
                if (person_entity) {
                    var imgElement = getImage(person_entity);
                    $(imgElement).addClass("f_tag_trans_hover");
                }
            }, 
            function()  { 
                var about = $(this).attr('about');
                var person_entity= myVIE.entities.get(about);
                if (person_entity) {
                    var imgElement = getImage(person_entity);
                    $(imgElement).removeClass("f_tag_trans_hover");
                }
            }
        )
    });
});

function getImage(person_entity){
	var fragment_id = person_entity.get ('annotatedIMG');
	var mediaEntity = myVIE.entities.get(fragment_id);
	var height = mediaEntity.get( 'schema:height');
	var width = mediaEntity.get('schema:width');
	var x = mediaEntity.get('x');
	var y = mediaEntity.get('y');
	var photo_url = mediaEntity.get('schema:image');
	photo_url = mediaEntity.isEntity? photo_url.getSubjectUri(): photo_url.replace(/<|>/,'');
	var imgElement = $('[fheight="'+ height + '"][fwidth="'+ width +'" ][fx="'+ x +'"][fy="'+ y +'"][fsrc="'+ photo_url+'"]');
	return imgElement;
}

function startAnnotation(){
    //initialize face tagger 
    $('#sample_img').viePersonage({
        FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd",
        myVIE: myVIE
    });
}
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
