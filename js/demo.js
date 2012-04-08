FACE_API_KEY = "16fc0307893bfc78a015c141c6e584bd";

$(window).load(function () {
	FaceClientAPI.init(FACE_API_KEY);
	tagFace();
});
function tagFace(){
	FaceTagger.load("#sample_img", {
		click_add_tag: false,
		resizable: true,
		facebook: true,
		fade: true,
		tags_list: true,
		add_tag_button: true,
		demo_mode: true
	});
}