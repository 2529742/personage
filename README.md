personage
=========

Personage is a [VIE](http://viejs.org) widget that allows to annotate depicted persons with schema.org structures.
It creates a VIE entity for the entire image;
and also creates separate VIE entitie(s) for fragment(s) of the image corresponding to the person(s) detected.
Both image- and fragment-related entities are of the http://schema.org/ImageObject VIE type.

The widget also includes a functionality for tagging the detected fragments using existing semantic markup on the page:
e.g. the page contains the text with a hidden markup
<span about="http://dbpedia.org/resource/John_Lennon" typeof="Person"> John Lennon </span>

you can drag this text ("John Lennon") and drop it on the appropriate detected fragment of the image. 
This creates a semantic relation between two entities: person and image objects.

Another functionality allows to highlight the text and and the image, which are semanticaly related (like described above):
every time the cursor hovers over the text or the fragment - both get highlighted.


The demo utilizes "skybiometry": a service for face detection and face recogntion.

Example
=======

1. Load the dependency scripts in the following order:

		<!-- jQuery and jQuery UI -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.js"></script>
		<!-- VIE dependencies: uderderscore, backbone, rdfquery; and wigdet-specific script: livequery -->
		<script type="text/javascript" src="underscore.js"></script>	
		<script type="text/javascript" src="backbone.js"></script>
		<script type="text/javascript" src="jquery.rdfquery.js"></script>
		<script type="text/javascript" src="jquery.livequery.js"></script>
		<!-- VIE: VIE library and the widget -->
		<script type="text/javascript" src="vie-2.1.0.js"></script>
	  	<script type="text/javascript" src="vie.widget.personage.js"></script>

and create a new script for your code:

		<script type="text/javascript">
		//...your code...
		</script>
	
2. Write there a function that would call the widget:
    
		function startAnnotation(){
	   		//initialize face tagger 
	    	    	$('#photos').viePersonage({ //call the widget on the container with the images or on a particular image
	    			services: { //face detection services
	    				skybiometry: {
	    					use: true,	// flag to indicate that this service will be used for face detection (if there are many)
	    					api_key: "YOUR_API_KEY",
	    					api_secret: "YOUR_API_SECRET"
	    				}
	    			},
	    			myVIE: myVIE, //your VIE instance
	    			done: imageResults, // callback function to process the resulted image fragment entities
	    			//drag-and-drop and hightlight functionality for existing semantic markup on the page:
	    			draggable: none, // a filter for activating draggables, e.g. for all markup with persons use draggable: [Person]
	    			highlight: true // use/not use highlighting
    		    	});
 		}

3. Write another function to process the results:

		function imageResults(entities){
		  	for(var f = 0; f < entities.length; f++){
		  		var fragment = entities[f];
	  			console.log(fragment);
	  		}
 		}

4. Call the startAnnotation function whenever you need, e.g. on the button click:

		<button id="start" onclick="startAnnotation()">Start image annotation</button>
