$ (function ()  {
	var text = ("<h1> The Beatles </h1>" +
              "The Beatles were an English rock band formed in Liverpool in 1960," +
              "and one of the most commercially successful and critically acclaimed acts in the history of popular music." +
              "The group's best-known lineup consisted of John Lennon (rhythm guitar, vocals)," +
              "Paul McCartney (bass guitar, vocals), George Harrison (lead guitar, vocals)" +
              "and Ringo Starr (drums, vocals). Rooted in skiffle and 1950s rock and roll," +
              "the group later worked in many genres ranging from pop ballads to psychedelic rock," +
              "often incorporating classical and other elements in innovative ways." +
              "Their enormous popularity first emerged as \"Beatlemania\";" +
              "as their songwriting grew in sophistication by the late 1960s," +
              "they came to be perceived by many fans and cultural observers as" +
              "an embodiment of the ideals shared by the era's sociocultural revolutions.");
	replaceText(text);
	urlImage = 'http://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Fabs.JPG/600px-The_Fabs.JPG';
	replaceImage (urlImage);
	//initialize face tagger 
	$('#sample_img').viePersonage({FACE_API_KEY: "16fc0307893bfc78a015c141c6e584bd"});
  
	//Instantiate VIE and load entities
	var entities = 'http://dbpedia.org/page/John_Lennon';
	var myVIE = window.myVIE = new VIE();
	myVIE.use(new myVIE.DBPediaService());
	myVIE
	.load({entity: entities})
	.using('dbpedia')
	.execute()
	.done(function(){
		alert('done!');
	});
});

function replaceText(text) {
  $("#content").html(text);
};

function replaceImage(urlImage) {
  $("#sample_img").attr('src', urlImage);
};
