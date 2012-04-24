(function($, undefined) {
    $.widget('view.viePersonage', {
       _create: function () {
            FaceClientAPI.init(this.options.FACE_API_KEY);
            return this;
       },
       
       _init: function () {
            this._tagFace();
       },

       _tagFace: function() {
            var self = this;
            FaceTagger.load("#" + $(self.element).attr('id'), {
                click_add_tag: false,
                resizable: true,
                facebook: true,
                fade: true,
                tags_list: true,
                add_tag_button: true,
                demo_mode: true
           });
        },
        
        options: {
           FACE_API_KEY: undefined
        }

    });
})(jQuery);