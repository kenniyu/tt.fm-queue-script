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
var rickroll_index = 0;
var idle_message_index = 0;
var last_message_time = new Date();

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
		temp_user_hash[user_id] = {"name": user_hash[user_id]["name"], "leave_time": 0, "last_active": new Date()};
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
		// took out sanity check
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
		temp_user_hash[user_id] = {"name": user_hash[user_id]["name"], "leave_time": 0, "last_active": new Date()-180000};
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
	var input_message = "÷÷÷÷÷÷÷÷÷÷÷Commands÷÷÷÷÷÷÷÷÷÷÷ [] w? [] w+ [] w- [] w++ [] -mods [] -plays [] -promote [] -pull [#] [] -remove [#] [][][][] [] -votekick [username] [][][][][][][][][][][][][][] Type -help [command] for more info on a command (ie. -help w?)";
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
}

function get_help(options){
	var text = options["text"];
	var command = text.substring(6, text.length);
	if (available_commands[command]){
		var input_message = available_commands[command][1];
	}
	else if (available_commands[command+" "]){
		var input_message = available_commands[command+" "][1];
	}
	else{
		var input_message = "";
	}
	deliver_chat(input_message);
}

function join_instructions(user_id){
	var username = get_user_name(user_id, true);
	if (visited_users.indexOf(user_id) == -1){
		// for newcomers
		visited_users.push(user_id);
		var input_message = "Hey " + username + ", welcome to our room!  Please check our room info, or type -help";
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
	$('.modal > .close-x').trigger('click');
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
	var user_id = options['user_id'];
	if (user_id in user_hash){
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

function mod_remove_from_queue(options){
	var user_id = options['user_id'];
	// can only remove someone who is a dj
	var text = options['text'];
	var index = text.substring(8, text.length);
	var input_message = "";
	if (!isNaN(index) && index <= my_queue.length && index > 0){
		console.log(get_user_name(user_id, true) + ' can remove user at index '+index);
		var removed_user_id = my_queue[index-1];
		my_queue.splice(index-1, 1);
		input_message += "Removed " + get_user_name(removed_user_id, false) + " from the queue :[";
		deliver_chat(input_message);
	}
}

function remove_from_queue(options){
	var user_id = options["user_id"];
	var type = options["type"];
	if (type == undefined || type == "manual"){
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

function shift_in_queue(options){
	var user_id = options["user_id"];
	var username = get_user_name(user_id, true);
	var index = my_queue.indexOf(user_id);
	if (index > -1 && index < my_queue.length-1){
		my_queue.splice(index, 1);
		my_queue.splice(index + 1, 0, user_id);
		show_queue(options);
	}
}

function remove_from_afk(user_id){
	var index = afk_djs.indexOf(user_id);
	if (index > -1){
		afk_djs.splice(index, 1);
	}
}

function remove_dj(user_id, steal){
	if (steal){
		if (dj_steal_hash[user_id] == undefined || dj_steal_hash == 3){
			dj_steal_hash[user_id] = 1;
		}
		else{
			dj_steal_hash[user_id] += 1;
		}
		if (dj_steal_hash[user_id] == 3){
			// boot
			boot(user_id);
		}
		else{
			my_room_manager.callback('remove_dj', user_id);
		}
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
			while(!(my_queue[0] in user_hash)){
				my_queue.splice(0,1);
			}
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
			remove_dj(user_id, true);
		}
	}
	deliver_chat(input_message);
}

function catch_rem_dj(user_id){
	if (dj_steal_hash[user_id] == 3){
		// this guy was removed because he was trying to steal an open spot. don't do anything
		dj_steal_hash[user_id] = 0;
	}
	else{
		// this guy left the decks, and is no longer a dj
		var username = get_user_name(user_id, true);
		var input_message = username + " stepped down from the decks. ";
		// detect if it was an accident
		if (reserve(user_id) == true){
			input_message += "That might have been an accident, so let's reserve it for a minute :]";
		}
		else{
			// otherwise
			set_dj_play_count(user_id, 0, false);
			// there's an open spot, so call alert next dj
			refresh_dj_hash();
			alert_next_dj();
		}
		deliver_chat(input_message);
	}
}

function reserve(user_id){
	return false;
	// if (dj_play_hash[user_id] != undefined && dj_play_hash[user_id]["count"] < 2){
	// 	return true;
	// }
	// else{
	// 	return false;
	// }
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
				room_vote_manager = {"type": "promote", "target": user_id, "yes": 0, "threshold": get_kick_threshold(), "voters": []};
				var input_message = room_vote_manager["threshold"] + " more votes needed to promote " + get_user_name(room_vote_manager["target"], true) + " to front of the line.  Type -yes to vote :]";
			}
		}
		else{
			show_existing_vote("promote");
		}
		deliver_chat(input_message);
	}
}

function vote_remove(options){
	if (room_vote_manager["type"] == undefined){
		var user_id = options['user_id'];
		// can only remove someone who is a dj
		var text = options['text'];
		var target_dj_spot = parseInt(text.substring(6, text.length)) || 0;
		if (target_dj_spot > 0 && target_dj_spot <= 5){
			var target_user_id = dj_hash[target_dj_spot-1];
			var target_user_name = get_user_name(target_user_id, true);
			room_vote_manager = {"type": "remove", "target": target_user_id, "yes": 0, "threshold": get_kick_threshold(), "voters": []};
			var input_message = room_vote_manager["threshold"] + " more votes needed to remove " + get_user_name(room_vote_manager["target"], true) + " from the decks.  Type -yes to vote :]";
			deliver_chat(input_message);
		}
	}
	else{
		show_existing_vote("remove");
	}
}

function vote_kick(options){
	if (room_vote_manager["type"] == undefined){
		var user_id = options['user_id'];
		var text = options['text'];
		// parse text
		var target_username = text.substring(10, text.length);
		var target_user_id = 0;
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
				room_vote_manager = {"type": "kick", "target": target_user_id, "yes":0, "threshold": get_kick_threshold(), "voters": []};
				var input_message = room_vote_manager["threshold"] + " more votes needed to kick " + get_user_name(room_vote_manager["target"], true) + " from the room.  Type -yes to vote kick :]";
				deliver_chat(input_message);
			}
		}
	}
	else{
		show_existing_vote("kick");
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
		else if (room_vote_manager["type"] == "remove"){
			var input_message = "Removal vote cancelled for " + get_user_name(room_vote_manager["target"], false);
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
					promote({"user_id": room_vote_manager["target"]});
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
				else if (room_vote_manager["type"] == "remove"){
					username = get_user_name(room_vote_manager["target"], true);
					remove_dj(room_vote_manager["target"], false);
					var input_message = "Removing " + username + " :[";
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
				else if (room_vote_manager["type"] == "remove"){
					var input_message = votes_left + " more "+ (votes_left == 1 ? "vote" : "votes") + " needed to remove " + get_user_name(room_vote_manager["target"], true) + " from the decks.  Type -yes to vote :]";
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
				remove_from_queue({"user_id": user_id, "type": "deregister"});
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
	else if (room_vote_manager["type"] == "remove"){
		var input_message = "There is already " + (attemped_vote_type == "remove" ? "another" : "a") + " removal in process for "+ get_user_name(room_vote_manager["target"], true) + ".";
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
	'w++': [shift_in_queue, "w++ : Moves yourself down one spot in waitlist"],
	'-mods': [show_mods, "-mods : Lists available mods"],
	'-promote': [vote_promote, "-promote : Promotes yourself to front of waitlist (requires votes)"],
	'-plays': [show_plays, "-plays : Shows DJ play count on deck"],
	'-votekick ': [vote_kick, "-votekick [username]: Kicks user [username] (requires votes)"],
	'-pull ': [vote_remove, "-pull [#]: Pulls DJ in spot [#] off the deck (requives votes)"],
	'-remove ': [mod_remove_from_queue, "-remove [#]: Removes user in queue spot [#] (must be mod)"],
	'-help': [queue_instructions, ''],
	'-help ':[get_help, ''],
	'-rickroll ': [rickroll, ''],
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
		if (available_commands[text]){
			var funct = available_commands[text][0];
			funct(options);
		}
		else if (available_commands[text.split(" ")[0]+" "]){
			var funct = available_commands[text.split(" ")[0]+" "][0];
			funct(options);
		}
		set_active_users(user_id);
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
		console.log('new song');
	}
});

function set_active_users(user_id){
	// m is message event listener
	if (user_id in temp_user_hash){
		temp_user_hash[user_id]["last_active"] = new Date();
	}
}

function get_active_users(){
	var active_users = [];
	var current_time = new Date();
	for (user_id in temp_user_hash){
		if (current_time - temp_user_hash[user_id]["last_active"] <= 180000){
			active_users.push(user_id);
		}
	}
	return active_users;
}

function get_kick_threshold(){
	var active_users_count = get_active_users().length;
	if (active_users_count <= 5){
		return 3;
	}
	else{
		return parseInt(0.5*active_users_count);
	}
}

function rickroll(options){
	var user_id = options["user_id"];
	var text = options["text"];
	var rickrolled_username = text.substring(10, text.length);
	if (rickrolled_username.length == 0){
		var messages = ["never gonna give you up", "never gonna let you down", "never gonna run around and desert you", "never gonna make you cry", "never gonna say goodbye", "never gonna tell a lie and hurt you"];
	}
	else{
		var messages = ["never gonna give "+rickrolled_username+" up", "never gonna let "+rickrolled_username+" down", "never gonna run around and desert "+rickrolled_username, "never gonna make "+rickrolled_username+" cry", "never gonna say goodbye", "never gonna tell a lie and hurt "+rickrolled_username];
	}
	var input_message = get_user_name(user_id, true) + "'s " + messages[rickroll_index%6];
	rickroll_index++;
	deliver_chat(input_message);
}

function prevent_idle(){
	// currently 8 messages
	var current_time = new Date();
	if (current_time - last_message_time >= 600000){
		// speaks every 600000 ms, or 600 seconds, or 10 minutes
		var messages = ["w?", "-plays"];
		deliver_chat(messages[idle_message_index%(messages.length)]);
		idle_message_index++;
		last_message_time = current_time;
	}
}

// log messages
var handleMessage = function(m) { console.log(m); }
turntable.addEventListener("message", handleMessage);

var soundstartMessage = function(m) { console.log(m); }
turntable.addEventListener("trackstart", soundstartMessage);

// intervals
setInterval("temp_user_hash_leave_timer()", 10000);
setInterval("update_dj_play_count()", 10000);
setInterval("prevent_idle()", 60000);