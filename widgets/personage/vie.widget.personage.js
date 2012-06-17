(function($, undefined) {
    $.widget('view.viePersonage', {
        _create: function () {
            FaceClientAPI.init(this.options.FACE_API_KEY);
            return this;
        },
       
    _init: function () {
            var self = this;
			var v = self.options.myVIE;
            if(v.types.get("owl:Thing") && v.types.get("annotatedIMG")){
                v.types.get("owl:Thing").attributes.add("annotatedIMG", ["ImageObject"]);
            }

			/* var img_id = [];
			$(self.element).find('img').each(function(){
				img_id.push($(this).attr('id'));
			}); 
			this.tagFace(img_id,this.annotate_faces,v); */
			var img_src = [];
			$(self.element).find('img').each(function(){
				$(this).wrap('<div class="tags" style="position: relative; display: inline-block;">');
				img_src.push($(this).attr('src'));
			});
			this.getTags(img_src, this.annotate_faces, v, self);
            //activate droppables
            $('[tid]').livequery(function(){
                $(this).droppable({
                    drop: function(event,ui) {
						var tid = $(this).attr('tid');
						var fragment_id = self.parseFragmentId(this);
						fragment_id = '<' + fragment_id + '>';
                        var draggable = ui.draggable;
                        var draggable_about = $(draggable).attr('about');
						draggable_about = (draggable_about && !window.VIE.Util.isUri(draggable_about))? '<' + draggable_about + '>': draggable_about;
                        var tag_text = $(draggable).text();
                        var destination = $('[tid="' + tid + '"] > .f_tag_caption > span');
                        $('[tid="' + tid + '"] > .f_tag_caption > span')
                        .text(tag_text);
                        var personEntity = v.entities.get(draggable_about);
                        if(personEntity){
                            personEntity.setOrAdd('annotatedIMG',fragment_id);
                        }
                        var mediaEntity = v.entities.get(fragment_id);
                        if(mediaEntity){
                            mediaEntity.setOrAdd('schema:about',draggable_about);
                        }
                    }
                });
				$(this).hover(
					function(){
						$(this).addClass('f_tag_trans_hover');
						var fragment_id = self.parseFragmentId(this);
						var mediaEntity = myVIE.entities.get(fragment_id);
						if(mediaEntity){
							var about = mediaEntity.get('schema:about');
							if(about){
								about = about.isEntity? about.getSubjectUri(): about;
								$('[about="' + about + '"]').addClass('hover');
							}
						}
					},
					function(){
						$(this).removeClass('f_tag_trans_hover');
						var fragment_id = self.parseFragmentId(this);
						var mediaEntity = myVIE.entities.get(fragment_id);
						if(mediaEntity){
							var about = mediaEntity.get('schema:about');
							if(about){
								about = about.isEntity? about.getSubjectUri(): about;
								$('[about="' + about + '"]').removeClass('hover');
							}
						}
					}
				);
            });
       },
	//Face.com tagging  widget
    tagFace: function(img_id, callback, v) {
		var selector = "#" + img_id.join(",#");
        FaceTagger.load(selector, {
            click_add_tag: false,
            resizable: true,
            facebook: true,
            fade: true,
            tags_list: true,
            add_tag_button: true,
            demo_mode: true,
            success: function(img, response){
				response = (response instanceof Object)? response: JSON.parse(response);
                var photos = response.photos? response.photos: [];
                for(var i = 0; i < photos.length; i++){
                    var photo = photos[i];
                    callback(photo,v);
                }
            }
        });
    },
	
	getTags: function(img_src, callback, v, self){
		var tags = {};
		var urls = img_src.join(',');
		$.ajax({
			url: 'http://api.face.com/faces/detect.json',
			type: 'POST',
			data: {
				api_key: this.options.FACE_API_KEY,
				api_secret: this.options.FACE_API_SECRET,
				urls: urls,
				attributes: 'all'
			},
			success: function(response){
						response = (response instanceof Object)? response: JSON.parse(response);
						var photos = response.photos? response.photos: [];
						for(var i = 0; i < photos.length; i++){
							var photo = photos[i];
							callback(photo,v,self);
						}
					 }
		});
	},
    
	renderTag: function(entityTag, parentEl){
		var tagView = Backbone.View.extend({
			className: "f_tag",
            initialize: function(){
				this.render();
			},
			render: function(){
				var $el = $(this.el);
				var mediaEntity = this.model;
                $el.attr('tid', mediaEntity.get('tid'));
				$el.attr('fx', mediaEntity.get('x'));
				$el.attr('fy', mediaEntity.get('y'));
				$el.attr('fheight', mediaEntity.get('schema:height'));
				$el.attr('fwidth', mediaEntity.get('schema:width'));
				var parent_url = mediaEntity.get('parentImage');
				parent_url = parent_url.isEntity? parent_url.getSubjectUri(): parent_url;
				$el.attr('fsrc', parent_url);
                var container = $("<div class='f_tag_caption'><span>Tag me</span></div>");
                $el.append(container);
				var h = mediaEntity.get('schema:height');
				var w = mediaEntity.get('schema:width');
				var left = parentEl.width()*(mediaEntity.get('x') - w/2)/100;
				var top = parentEl.height()*(mediaEntity.get('y') - h/2)/100;
				$el.css({
					position: 'absolute',
					top: top,
					left: left,
					width: w+'%',
					height: h+'%',
					display: 'block'
				});
				parentEl.append($el);
			}
		});
		return new tagView({model:entityTag, parentEl:parentEl});
	},
    
    annotate_faces: function(photo,v, self) {
        var photo_url = photo.url;
        var tags = photo.tags;
		var parentEl = $(self.element).find('[src="' + photo_url + '"]').parent();
		var imageSubject = '<' + photo_url + '>';
		var imageEntity = undefined;
		if(v.entities.get(imageSubject)){
			imageEntity = v.entities.get(imageSubject);
		}
		else{
			v.entities.add({'@type': '<http://schema.org/ImageObject>', '@subject': imageSubject});
			imageEntity = v.entities.get(imageSubject);
		}
		var results = [];
        for(var t in tags){
            var tag = tags[t];
            var tid = tag.tid;
            var h = tag.height;
            var w = tag.width;
            var x = tag.center? tag.center.x: undefined;
            var y = tag.center? tag.center.y: undefined;
            var fragment_id  = (h && w && x && y)? (photo_url + '#xywh=percent:' + x + ',' + y + ',' + w + ',' + h): tid;
			var fragment_subject = '<' + fragment_id + '>';
            var type = '<http://schema.org/ImageObject>';
            if(fragment_id){
                v.entities.add({'@type':type, '@subject': fragment_subject});    
            }
            var mediaEntity = myVIE.entities.get(fragment_subject);
			results.push(mediaEntity);
            if(mediaEntity){
                mediaEntity.setOrAdd('schema:height',h);
                mediaEntity.setOrAdd('schema:width',w);
                mediaEntity.setOrAdd('x',x);
                mediaEntity.setOrAdd('y',y);
                mediaEntity.setOrAdd('tid', tid);
                mediaEntity.setOrAdd('parentImage',photo_url);
				mediaEntity.setOrAdd('schema:image',fragment_id);
				if(imageEntity){
					imageEntity.setOrAdd('decomposition',fragment_subject);
				}
				self.renderTag(mediaEntity, parentEl);
            }
        }
		self.options.done(results);
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
	   FACE_API_SECRET: undefined,
       myVIE: undefined,
	   done: function(entities){}
    }
    });
})(jQuery);