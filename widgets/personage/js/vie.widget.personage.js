(function($, undefined) {
    $.widget('view.viePersonage', {
        _create: function () {
            FaceClientAPI.init(this.options.FACE_API_KEY);
            return this;
        },
       
    _init: function () {
            var self = this;
            var img_id = $(self.element).attr('id');
            var v = self.options.myVIE;
            this.tagFace(img_id,this.annotate_faces,v);
            if(v.types.get("owl:Thing")){
                v.types.get("owl:Thing").attributes.add("annotatedIMG", ["MediaObject"]);
            }
            //activate droppables
            $('[tid]').livequery(function(){
                $(this).droppable({
                    drop: function(event,ui) {
						var tid = $(this).attr('tid');
						var fragment_id = self.parseFragmentId(this);
                        var draggable = ui.draggable;
                        var draggable_about = $(draggable).attr('about');
                        var tag_text = $(draggable).text();
                        $('[tid="' + tid + '"] > .f_tag_caption > span')
                        .text(tag_text);
                        var personEntity = v.entities.get(draggable_about);
                        if(personEntity){
                            personEntity.setOrAdd('annotatedIMG',fragment_id);
                        }
                        var mediaEntity = v.entities.get(fragment_id);
                        if(mediaEntity){
                            mediaEntity.setOrAdd('about',draggable_about);
                        }
                    }
                });
				$(this).hover(
					function(){
						var fragment_id = self.parseFragmentId(this);
						var mediaEntity = myVIE.entities.get(fragment_id);
						if(mediaEntity){
							var about = mediaEntity.get('about');
							about = about.isEntity? about.getSubjectUri(): about;
							//var personEntity = v.entities.get(about);
							$('[about="' + about + '"]').addClass('hover');
						}
					},
					function(){
						var fragment_id = self.parseFragmentId(this);
						var mediaEntity = myVIE.entities.get(fragment_id);
						if(mediaEntity){
							var about = mediaEntity.get('about');
							about = about.isEntity? about.getSubjectUri(): about;
							//var personEntity = v.entities.get(about);
							$('[about="' + about + '"]').removeClass('hover');
						}
					}
				);
            });
       },

    tagFace: function(img_id, callback, v) {
        FaceTagger.load('#' + img_id, {
            click_add_tag: false,
            resizable: true,
            facebook: true,
            fade: true,
            tags_list: true,
            add_tag_button: true,
            demo_mode: true,
            success: function(img, response){
                var photos = response.photos? response.photos: [];
                for(var i = 0; i < photos.length; i++){
                    var photo = photos[i];
                    callback(photo,v);
                }
            }
        });
    },
        
    annotate_faces: function(photo,v) {
        var photo_url = photo.url;
        var tags = photo.tags;
        for(var t in tags){
            var tag = tags[t];
            var tid = tag.tid;
            var h = tag.height;
            var w = tag.width;
            var x = tag.center? tag.center.x: undefined;
            var y = tag.center? tag.center.y: undefined;
            var id  = (h && w && x && y)? (photo_url + '#xywh=percent:' + x + ',' + y + ',' + w + ',' + h): tid;
            var type = '<http://schema.org/MediaObject>';
            if(id){
                v.entities.add({'@type':type, '@subject': id});    
            }
            var mediaEntity = myVIE.entities.get(id);
            if(mediaEntity){
                mediaEntity.setOrAdd('height',h);
                mediaEntity.setOrAdd('width',w);
                mediaEntity.setOrAdd('x',x);
                mediaEntity.setOrAdd('y',y);
                mediaEntity.setOrAdd('image',photo_url);
            }
        }
    },
	
	parseFragmentId: function(element){
		var tid = $(element).attr('tid');
		var x = $(element).attr('fx');
		var y = $(element).attr('fy');
		var h = $(element).attr('fheight');
		var w = $(element).attr('fwidth');
		var photo_url = $(element).attr('fsrc');
		var fragment_id = (h && w && x && y && photo_url)? (photo_url + '#xywh=percent:' + x + ',' + y + ',' + w + ',' + h): tid;
		return fragment_id;
	},
        
    options: {
       FACE_API_KEY: undefined,
       myVIE: undefined
    }
    });
})(jQuery);