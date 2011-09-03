var kick_threshold = 3;			// # of users required for vote kick to pass
var promote_threshold = 3;		// # of users required for vote promote to pass

function get_first_tt_obj(){
	for (var object in turntable){
		return object;
	}
}

function get_room_manager(){
	for (var window_var in window){
	    if (window[window_var]["become_dj"] != undefined){
			return window[window_var];
		}
	}
}

var first_tt_obj = get_first_tt_obj();
var my_room_manager = get_room_manager();
var my_sound_manager = {};
var my_chat = "";

var visited_users = [];
var dj_steal_hash = [];
var dj_play_hash = {};

var afk_djs = [];
var my_queue = [];
var countdown_ticks = 1;
var room_vote_manager = {};
var auto_banned = [];
var countdown_interval_id = false;

var user_hash = turntable[first_tt_obj]["users"];
var dj_hash = turntable[first_tt_obj]["djIds"];

function refresh_dj_hash(){
	dj_hash = turntable[first_tt_obj]["djIds"];
}
function refresh_user_hash(){
	user_hash = turntable[first_tt_obj]["users"];
}

var temp_user_hash = {};
function set_temp_user_hash(){
	for (var user_id in user_hash){
		temp_user_hash[user_id] = {"name": user_hash[user_id]["name"], "leave_time": 0};
	}
}
set_temp_user_hash();

function init_dj_play_hash(){
	for (var user_id in user_hash){
		dj_play_hash[user_id] = {"user_name": user_hash[user_id]["name"], "count": 0, "play_duration": 0, "marked": false};
	}
}

function set_dj_play_count(user_id, play_count, marked){
	dj_play_hash[user_id] = {"user_name": user_hash[user_id]["name"], "count": play_count, "play_duration": 0, "marked": marked};	
}

function update_dj_play_count(){
	var user_id = my_room_manager["current_dj"][0];
	var play_duration = my_sound_manager["position"];
	dj_play_hash[user_id]["play_duration"] = play_duration;
	if (play_duration > 60000 && dj_play_hash[user_id]["marked"] == false){
		dj_play_hash[user_id]["marked"] = true;
		dj_play_hash[user_id]["count"] += 1;
		// sanity check, all djs to the left of current dj must have play counts >= current_dj's play count
		for (var a=0; a<dj_hash.indexOf(user_id); a++){
			var temp_user_id = dj_hash[a];
			if (dj_play_hash[temp_user_id]["count"] < dj_play_hash[user_id]["count"]){
				dj_play_hash[temp_user_id]["count"] = dj_play_hash[user_id]["count"];
			}
		}
	}
	
}
init_dj_play_hash();


function update_temp_user_hash(user_id, type){
	if (type == "add"){
		// only add if not already in temp_user_hash
		for (var id in temp_user_hash){
			if (user_id == id){
				temp_user_hash[user_id]["leave_time"] = 0;
				return;
			}
		}
		temp_user_hash[user_id] = {"name": user_hash[user_id]["name"], "leave_time": 0};
	}
	else{
		// remove from temp_user_hash
		delete temp_user_hash[user_id];
	}
}

function set_mod(user_id){
	my_room_manager.callback("add_moderator", user_id);
}

function countdown(){
	if (countdown_ticks == 6){
		// first in line
		var input_message = get_user_name(my_queue[0], false) + " is afk. ";
		var afk_user_id = my_queue[0];
		my_queue.splice(0, 1);
		
		if (afk_djs.indexOf(afk_user_id) == -1){
			// wasnt afk before, so insert at position 1
			afk_djs.push(afk_user_id);
			my_queue.splice(1, 0, afk_user_id);
		}
		else{
			// was already afk, so insert at end if queue length is > 3
			if (my_queue.length > 3){
				my_queue.push(afk_user_id);
			}
		}
		stop_countdown();
		alert_next_dj();
	}
	else{
		var username = get_user_name(my_queue[0], false);
		var input_message = username + ", you have " + (90 - countdown_ticks*15) + " seconds left to step up to the decks!";
		countdown_ticks++;
	}
	deliver_chat(input_message);
}

function stop_countdown(){
	countdown_ticks = 1;
	clearInterval(countdown_interval_id);
	countdown_interval_id = false;
}

function show_mods(){
	var all_mods = my_room_manager["moderators"];
	var present_mods = [];
	for (var a=0; a<my_room_manager["moderators"].length; a++){
		var user_id = my_room_manager["moderators"][a];
		if (user_hash[user_id] != undefined){
			present_mods.push(all_mods[a]);
		}
	}

	if (present_mods.length == 0){
		var input_message = "No mods!";
	}
	else{
		var input_message = "Mods: ";
		for (var a=0; a<present_mods.length; a++){
			var user_id = present_mods[a];
			input_message += get_user_name(user_id, true);
			if (a != present_mods.length - 1){
				input_message += ", ";
			}
		}
	}
	deliver_chat(input_message);
}

function is_mod(user_id){
	return (my_room_manager["moderators"].indexOf(user_id) > -1);
}

function queue_instructions(){
	var input_message = "÷÷÷÷÷÷÷÷÷÷÷Commands÷÷÷÷÷÷÷÷÷÷÷ [][] w? [] w+ [] w- [] -plays [] -promote [][] [][] -mods [] -votekick [username] [][][][][] Type -help [command] for more info on a command (ie. -help w?)";
	deliver_chat(input_message);
}
function deliver_chat(input_message){
	// bot text can interrupt your current message. save chat before sending bot message
	my_chat = $('.input-box > input').val();
	// deliver bot chat
	$('.input-box > input').val(input_message);
	$('.input-box').trigger('submit');
	// continue chatting
	$('.input-box > input').val(my_chat);
	last_message_time = new Date();
}

function get_help(text){
	var command = text.substring(6, text.length);
	var input_message = (available_commands[command]) ? available_commands[command][1] : "";
	deliver_chat(input_message);
}

function join_instructions(user_id){
	var username = get_user_name(user_id, true);
	if (visited_users.indexOf(user_id) == -1){
		// for newcomers
		visited_users.push(user_id);
		if (is_dj(username) == -1){
			var input_message = "Hey " + username + "!  Welcome to our room :]  ";
			if (dj_hash.length == 5){
				input_message += "It looks like there's no room for you on the decks yet, so get in line!  Just type w+.  ";
			}
			else if (dj_hash.length < 5 && my_queue.length > 0){
				input_message += "There's an open spot right now, but it's reserved for "+ get_user_name(my_queue[0], false) + ".  Don't worry though, just type w+ to get on the waitlist.  ";
			}
			else{
				input_message += "There's an open spot on deck, so hop on!  ";
			}
			input_message += "For more instructions, type -help";
		}
		deliver_chat(input_message);
	}
}

function is_dj(username){
	var dj_index = -1;
	var user_id = get_user_id(username, true);
	for (var index in dj_hash) {
		if (user_id == dj_hash[index]){
			// user is a dj
			dj_index = index;
			break;
		}
	}
	return dj_index;
}

function boot(user_id){
	my_room_manager.callback('boot_user', user_id);
	$('.bootReasonField.text').val("booted? possible reasons might include spamming, jumping the line too many times, etc... just join again :]");
	$('.ok-button.centered-button').trigger('click');
}

function check_ban(user_id){
	if (auto_banned.indexOf(user_id) > -1){
		// boot
		boot(user_id);
	}
	else{
		join_instructions(user_id);
	}
}

function promote(options){
	var username = options['user_id'];
	var user_id = get_user_id(username, true);
	if (user_id != -1){
		var index = my_queue.indexOf(user_id);
		if (index > -1){
			// user was already in queue, so remove
			my_queue.splice(index, 1);
		}
		my_queue.unshift(user_id);
	}
}

function get_user_id(username, strict){
	var user_id = -1;
	var current_name = "";
	if (strict == true){
		for (var index in user_hash) {
			current_name = user_hash[index]["name"];
			if (current_name == username){
				// user found, get id
				user_id = index;
				break;
			}
		}
	}
	else{
		// use temp hash
		for (var index in temp_user_hash) {
			current_name = temp_user_hash[index]["name"];
			if (current_name == username){
				// user found, get id
				user_id = index;
				break;
			}
		}
	}
	return user_id;
}

function get_user_name(user_id, strict){
	if (strict == true){
		return user_hash[user_id]["name"];		
	}
	else{
		return temp_user_hash[user_id]["name"];		
	}
}

function show_queue(options){
    var user_id = options['user_id'];
	var queue_length = my_queue.length;
	var input_message = "";
	var username = get_user_name(user_id, true);
	if (dj_hash.length < 5 && is_dj(username) == -1 && my_queue.length == 0){
		var input_message = "There's an open spot "+username+".  Step up!";
	}
	else{
		if (queue_length == 0){
			var input_message = "No one's in line."
			if (!is_dj(username)){
				input_message += "Add yourself by typing w+ !";
			}
		}
		else{
			var input_message = queue_length + " in line: ";
			for (var a=0; a<my_queue.length; a++){
				input_message += get_user_name(my_queue[a], false);
				if (a != my_queue.length - 1){
					input_message += ", ";
				}
			}
		}
	}
	deliver_chat(input_message);
}

function add_to_queue(options){
	var user_id = options['user_id'];
	var username = get_user_name(user_id, true);
	if (dj_hash.length < 5 && is_dj(username) == -1 && my_queue.length == 0){
		var input_message = "There's an open spot "+username+". Step up!";
	}
	else{
		if (is_dj(username) > -1){
			var input_message = username + ", you are already on deck! :]"
		}
		else{
			if (my_queue.indexOf(user_id) == -1){
				my_queue.push(user_id);
			}
			var user_queue_index = my_queue.indexOf(user_id);
			if (user_queue_index == 0){
				var input_message = username + ", you are number 1 in line";
			}
			else{
				var input_message = username + ", you are number " + (user_queue_index+1) + " in line, right behind " + get_user_name(my_queue[user_queue_index-1], false);
			}
		}
	}
	deliver_chat(input_message);
}

function remove_from_queue(user_id, type){
	if (type == "manual"){
		var username = get_user_name(user_id, true);
		var index = my_queue.indexOf(user_id);
		if (index != -1){
			if (index == 0 && countdown_interval_id != false){
				my_queue.splice(index, 1);
				stop_countdown();
				alert_next_dj();
			}
			else{	
				my_queue.splice(index, 1);
			}
			var input_message = "Removed " + username + " from the waitlist :[ ";
			if (my_queue.length == 0){
				input_message += "No one left in waitlist!";
			}
			else{
				input_message += "Next up: " + get_user_name(my_queue[0], false);
			}
			deliver_chat(input_message);
		}
	}
	else if (type == "deregister"){
		var index = my_queue.indexOf(user_id);
		var username = get_user_name(user_id, false);
		
		if (index != -1){
			my_queue.splice(index, 1);
		}
		var input_message = "Removed " + username + " from the waitlist for leaving the room for more than 15 minutes :[";
		deliver_chat(input_message);
	}
}

function remove_from_afk(user_id){
	var index = afk_djs.indexOf(user_id);
	if (index > -1){
		afk_djs.splice(index, 1);
	}
}

function remove_dj(user_id){
	if (dj_steal_hash[user_id] == undefined){
		dj_steal_hash[user_id] = 1;
	}
	else{
		dj_steal_hash[user_id] += 1;
	}
	if (dj_steal_hash[user_id] == 3){
		// boot
		dj_steal_hash[user_id] = 0;
		boot(user_id);
	}
	else{
		my_room_manager.callback('remove_dj', user_id);
	}
}

function alert_next_dj(){
	// prereqs: < 5 djs and > 0 people on queue and no one is being called
	if (dj_hash.length < 5 && countdown_interval_id == false){
		// only alert people if someone hasn't been alerted
		if (my_queue.length > 0){
			// there are people in the queue to alert
			var username = get_user_name(my_queue[0], false);
			var input_message = username + ", we have a spot reserved for you, please step up!  You have 90 seconds left.";
			stop_countdown();
			countdown_interval_id = setInterval("countdown()", 15000);
		}
		else{
			// no one is in the queue
			var input_message = "We have an open spot on deck. Feel free to step up :]";
		}
		deliver_chat(input_message);
	}
}

function personalized_dj_msg(user_id){
	var username = get_user_name(user_id, true);
	var message = username + " stepped up to DJ!";
	return message;
}

function catch_add_dj(user_id){
	var username = get_user_name(user_id, true);
	if (my_queue.length == 0){
		var input_message = personalized_dj_msg(user_id);
		// reset their steal count
		dj_steal_hash[user_id] = 0;
		refresh_dj_hash();
	}
	else{
		if (my_queue.indexOf(user_id) == 0){
			// start message
			var input_message = personalized_dj_msg(user_id);
			// remove them from queue
			var index = my_queue.indexOf(user_id);
			my_queue.splice(index, 1);
			// reset their steal count
			dj_steal_hash[user_id] = 0;
			// clear countdown
			stop_countdown();
			// remove them from afk
			remove_from_afk(user_id);
			// alert the next dj
			alert_next_dj();
		}
		else{
			var input_message = username + ", it's not your turn to DJ yet! Check your spot in line by typing w? :]";
			remove_dj(user_id);
		}
	}
	deliver_chat(input_message);
}

function catch_rem_dj(user_id){
	if (dj_steal_hash[user_id] > 0){
		// this guy was removed because he was trying to steal an open spot. don't do anything
	}
	else{
		// this guy left the decks, and is no longer a dj
		var username = get_user_name(user_id, true);
		var input_message = username + " stepped down from the decks. ";
		deliver_chat(input_message);
		set_dj_play_count(user_id, 0, false);
		// there's an open spot, so call alert next dj
		refresh_dj_hash();
		alert_next_dj();
	}
}

function vote_promote(options){
	var user_id = options['user_id'];
	// can only be promoted if not a dj and there isn't any room on deck and if there are more than 1 people on waitlist.
	if (is_dj(get_user_name(user_id, true)) == -1 && (dj_hash.length + my_queue.length > 5)){
		if (room_vote_manager["type"] == undefined){
			if (my_queue[0] == user_id){
				var input_message = get_user_name(user_id, true) + ", you are already at the front of the line :]";
			}
			else{
				room_vote_manager["type"] = "promote";
				room_vote_manager["target"] = user_id;
				room_vote_manager["yes"] = 0;
				room_vote_manager["threshold"] = promote_threshold;
				room_vote_manager["voters"] = [];
				var input_message = room_vote_manager["threshold"] + " more votes needed to promote " + get_user_name(room_vote_manager["target"], true) + " to front of the line.  Type -yes to vote :]";
			}
		}
		else{
			show_existing_vote("promote");
		}
		deliver_chat(input_message);
	}
}

function vote_kick(options){
	var user_id = options['user_id'];
	var text = options['text'];
	// parse text
	target_username = text.substring(10, text.length);
	target_user_id = 0;
	for (var user_id in user_hash){
		if (target_username.toLowerCase() == user_hash[user_id]["name"].toLowerCase()){
			target_user_id = user_id;
		}
	}	
	if (target_user_id != 0){
		// found user to kick
		if (room_vote_manager["type"] != undefined){
			// show current vote process
			show_existing_vote("kick");
		}
		else{
			room_vote_manager["type"] = "kick";
			room_vote_manager["target"] = target_user_id;
			room_vote_manager["yes"] = 0;
			room_vote_manager["threshold"] = kick_threshold;
			room_vote_manager["voters"] = [];
			var input_message = room_vote_manager["threshold"] + " more votes needed to kick " + get_user_name(room_vote_manager["target"], true) + " from the room.  Type -yes to vote kick :]";
			deliver_chat(input_message);
		}
	}
}


function vote_stop(options){
	var user_id = options['user_id'];
	if (is_mod(user_id) && room_vote_manager != {}){
		// user stopping vote is mod and there is a vote going on
		if (room_vote_manager["type"] == "promote"){
			var input_message = "Promotion vote cancelled for " + get_user_name(room_vote_manager["target"], false);
		}
		else if (room_vote_manager["type"] == "kick"){
			var input_message = "Votekick cancelled for " + get_user_name(room_vote_manager["target"], false);
		}
		room_vote_manager = {};
		deliver_chat(input_message);
	}
}

function process_vote(options){
	var user_id = options['user_id'];
	var choice = options['text'];
	if (room_vote_manager != {}){
		// process vote if there is one going on
		if (room_vote_manager["voters"].indexOf(user_id) == -1){
			room_vote_manager["yes"] += 1;
			room_vote_manager["voters"].push(user_id);
			if (room_vote_manager["yes"] >= room_vote_manager["threshold"]){
				if (room_vote_manager["type"] == "promote"){
					promote(get_user_name(room_vote_manager["target"]));
					var input_message = "Vote passed for " + get_user_name(room_vote_manager["target"], true) + "! ";
					var queue_length = my_queue.length;
					input_message += queue_length + " in line: ";
					for (var a=0; a<my_queue.length; a++){
						input_message += get_user_name(my_queue[a], false);
						if (a != my_queue.length - 1){
							input_message += ", ";
						}
					}
				}
				else if (room_vote_manager["type"] == "kick"){
					username = get_user_name(room_vote_manager["target"], true);
					boot(room_vote_manager["target"]);
					var input_message = "Votekick passed for " + username + "!";
				}
				room_vote_manager = {};
			}
			else{
				var votes_left = room_vote_manager["threshold"] - room_vote_manager["yes"];
				if (room_vote_manager["type"] == "promote"){
					var input_message = votes_left + " more "+ (votes_left == 1 ? "vote" : "votes") + " needed to promote " + get_user_name(room_vote_manager["target"], true) + " to front of the line.  Type -yes to vote :]";
				}
				else if (room_vote_manager["type"] == "kick"){
					var input_message = votes_left + " more "+ (votes_left == 1 ? "vote" : "votes") + " needed to kick " + get_user_name(room_vote_manager["target"], true) + " from the room.  Type -yes to vote :]";
				}
			}
			deliver_chat(input_message);
		}
	}
	else{
		
	}
}

function deregister_user(user_id){
	// if user is not in queue, just remove him from user_hash
	if (my_queue.indexOf(user_id) == -1){
		delete temp_user_hash[user_id];
	}
	else{
		// hes on queue, so set temp user hash new time
		temp_user_hash[user_id]["leave_time"] = new Date();
	}
	refresh_user_hash();
	refresh_dj_hash();
}

function temp_user_hash_leave_timer(){
	// loops through temp user hash to find users who left
	var current_time = new Date();
	for (var user_id in temp_user_hash){
		var leave_time = temp_user_hash[user_id]["leave_time"];
		if (leave_time != 0){
			if (current_time - leave_time > 900000){
				// remove this user from queue and temp hash
				remove_from_queue(user_id, "deregister");
				delete temp_user_hash[user_id];
				stop_countdown();
				alert_next_dj();
			}
		}
	}
}

function show_existing_vote(attempted_vote_type){
	if (room_vote_manager["type"] == "promote"){
		var input_message = "There's already " + (attempted_vote_type == "promote" ? "another" : "a") + " promotion in process for "+ get_user_name(room_vote_manager["target"], true) + ".";
	}
	else if (room_vote_manager["type"] == "kick"){
		var input_message = "There is already " + (attemped_vote_type == "kick" ? "another" : "a") + " kick in process for "+ get_user_name(room_vote_manager["target"], true) + ".";
	}
	deliver_chat(input_message);
}

function show_plays(options){
	var user_id = options['user_id'];
	if (dj_hash.length > 0){
		var input_message = "";
		for (var a=0; a<5; a++){
			if (dj_hash[a] != undefined){
				input_message += dj_play_hash[dj_hash[a]]["count"];
			}
			else{
				input_message += "_";
			}
			if (a != 5 - 1){
				input_message += " . ";
			}
		}
	}
	else{
		var input_message = "No one's playing right now, so you should DJ for us " + get_user_name(user_id, true) + "!";
	}
	deliver_chat(input_message);
}


var available_commands = {
  'w?': [show_queue, "w? : Shows waitlist"],
  'w+': [add_to_queue, "w+ : Adds yourself to waitlist"],
  'w-': [remove_from_queue, "w- : Removes yourself from waitlist"],
  '-mods': [show_mods, "-mods : Lists available mods"],
  '-promote': [vote_promote, "-promote : Promotes yourself to front of waitlist (requires votes)"],
  '-plays': [show_plays, "-plays : Shows DJ play count on deck"],
  '-votekick': [vote_kick, "-votekick [username]: Kicks user [username] (requires votes)"],
  '-help': [queue_instructions, ''],
  '-help ':[get_help, ''],
  '-stopvote': [vote_stop, ''],
  '-yes': [process_vote, '']  
};

turntable.addEventListener("trackstart", function(c){
	// set up sound manager
	my_sound_manager = c["sound"];
	my_sound_manager["current_dj"] = my_room_manager["current_dj"][0];
});

turntable.addEventListener("message", function(m){ 
	var command = m["command"];
	if (command == "speak"){
		var user_id = m["userid"];
		var text = m["text"].toLowerCase();
		var options = {'user_id':user_id, 'text':text};
		var funct = available_commands[text][0];
		if(funct) { 
			funct(options); 
		}
	}
	else if (command == "add_dj"){
		var user_id = m["user"][0]["userid"];
		catch_add_dj(user_id);
	}
	else if (command == "rem_dj"){
		var user_id = m["user"][0]["userid"];
		catch_rem_dj(user_id);
	}
	else if (command == "registered"){
		var user_id = m["user"][0]["userid"];
		check_ban(user_id);
		refresh_user_hash();
		update_temp_user_hash(user_id, "add");
		set_dj_play_count(user_id, 0, false);
	}
	else if (command == "deregistered"){
		var user_id = m["user"][0]["userid"];
		deregister_user(user_id);
	}
	else if (command == "new_moderator"){
		show_mods();
	}
	else if (command == "rem_moderator"){
		show_mods();
	}
	else if (command == "newsong"){
		dj_play_hash[my_sound_manager["current_dj"]]["marked"] = false;
	}
});

setInterval("temp_user_hash_leave_timer()", 10000);
setInterval("update_dj_play_count()", 10000);

var handleMessage = function(m) { console.log(m); }
turntable.addEventListener("message", handleMessage);

var soundstartMessage = function(m) { console.log(m); }
turntable.addEventListener("trackstart", soundstartMessage);