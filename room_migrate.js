turntable.addEventListener("message", function(m){ 
	var command = m["command"];
	if (command == "registered"){
		var input_message = "The room has migrated!  The URL is now http://turntable.fm/trance_n_progressive";
		$('.input-box > input').val(input_message);
		$('.input-box').trigger('submit');
	}
});