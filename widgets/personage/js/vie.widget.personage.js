(function($, undefined) {
    $.widget('view.viePersonage', {
       _create: function () {
            FaceClientAPI.init(this.options.FACE_API_KEY);
            return this;
       },
       
       _init: function () {
			var self = this;
			var img_id = $(self.element).attr('id');
			this.tagFace(img_id,this.annotate_faces);
			//activate droppables
			$('[tid]').livequery(function(){
				$(this).droppable({
					drop: function(event,ui) {
						var tid = $(this).attr('tid');
						var draggable = ui.draggable;
						var draggable_about = $(draggable).attr('about');
						var tag_text = $(draggable).text();
						$('[tid="' + tid + '"] > .f_tag_caption > span')
						.text(tag_text)
						.trigger('keyup');
						var personEntity = myVIE.entities.get(draggable_about);
						if(personEntity){
							personEntity.setOrAdd('annotatedIMG',tid);
						}
						var mediaEntity = myVIE.entities.get(tid);
						if(mediaEntity){
							mediaEntity.setOrAdd('annotatedPerson',draggable_about);
						}
					}
				});
			});
       },

       tagFace: function(img_id, callback) {
            FaceTagger.load('#' + img_id, {
                click_add_tag: false,
                resizable: true,
                facebook: true,
                fade: true,
                tags_list: true,
                add_tag_button: true,
                demo_mode: true,
				success: function(img, response){
					var tags = response? (response.photos? response.photos[0].tags: undefined): undefined;
					callback(tags);
				}
           });
        },
		
		annotate_faces: function(tags) {
			for(var t in tags){
				var tag = tags[t];
				var tid = tag.tid;
				var type = '<http://schema.org/MediaObject>';
				myVIE.entities.add({'@type':type, '@subject': tid});	
			}
		},
        
        options: {
           FACE_API_KEY: undefined
        }

    });
})(jQuery);