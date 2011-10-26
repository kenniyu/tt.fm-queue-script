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

var last_message_time = new Date();
var idle_message_index = 0;

var visited_users = ["4e51cf844fe7d02a322232c2", "4e25bb1ca3f751094b025966", "4e0e64ed4fe7d074cd01819c", "4dd88513e8a6c44b34000022", "4e266e92a3f751094a06e449", "4e1e0fae4fe7d05116015c04", "4e1c8e8e4fe7d031520dbf8d", "4e37347ba3f75118ba0a5c47", "4e42fc50a3f7511486005f1c", "4e38ab0ba3f751782501775b", "4e3019fc4fe7d015eb09ad58", "4e34d81d4fe7d03c6b04951c", "4e4f2c65a3f751044e1f274b", "4e30b06ea3f7512c8c0c3bb0", "4e2897a54fe7d03ea000fb80", "4e503fcc4fe7d02a3b1e9e0b", "4dffd843a3f75104e405fa2d", "4e482f7b4fe7d02a430b6522", "4e4a06e5a3f75104590f886d", "4e4aa67aa3f751044810f40e", "4e435211a3f75114980228f7", "4e5153ca4fe7d02a2f210415", "4e50647ca3f751043f210eee", "4e4fdfe04fe7d02a321e657e", "4e4edcec4fe7d02a2c1d32e9", "4e52eb1fa3f75104562810c5", "4e0646ef4fe7d05e0f00e44a", "4e52eebc4fe7d02a4126d61a", "4e18e3fa4fe7d056da066192", "4e4969c7a3f75104520cf0c8", "4e3c82cd4fe7d05780043337", "4e4d85d14fe7d02a2c193ca4", "4e520d3c4fe7d02a3823cf5e", "4e52fcfc4fe7d02a38267ac6", "4e232e83a3f751699801dd55", "4e3b39624fe7d05c3307bf9f", "4e531a904fe7d02a3826f0f9", "4e53198ca3f751044b26498c", "4e2364fda3f751211c0012d6", "4e278ac9a3f751245e041c8c", "4e4f2411a3f751043f1e556c", "4e4e02b94fe7d02a3f1b201c", "4e51fe494fe7d02a3523f7cd", "4e540dc6a3f75104562b0a36", "4e3afa3e4fe7d05c3a06569e", "4e4b3b87a3f751043f13c7e7", "4e53f1e4a3f751044b281913", "4df805604fe7d04a1f097acf", "4e3ae3d34fe7d05c3e058632", "4e530ff3a3f751044227682f", "4e529cb94fe7d02a3b234133", "4e3f6bc04fe7d01d3101862d", "4e53ea4aa3f751044b27ff9a", "4e54296d4fe7d02a3f2a4b35", "4e0cf0ad4fe7d076af17d2ec", "4e52bf1e4fe7d02a3f25bea2", "4e2d9d8c4fe7d0158610e3f9", "4e18e1a6a3f75133a606ddfc", "4de8fb034fe7d0517b0dd5cb", "4e4d9fb8a3f75104521867e3", "4e4b92a3a3f751045213283a", "4e498cff4fe7d02a410e5fb5", "4e20f3194fe7d0538f000829", "4e5070d2a3f751044b1fe070", "4e20d7f2a3f7512e50009bdb", "4e44d3014fe7d02a3502f2a3", "4e53d4a64fe7d02a2924cb66", "4e526c1f4fe7d02a4124eefa", "4e4577994fe7d02a29044ba8", "4e42f51ba3f75114830061e3", "4e1a1adb4fe7d07ff9014e9f", "4e2ee18fa3f7512c800481e8", "4e24782ba3f751434b01cdad", "4e00d1c6a3f75104e40a96ca", "4e52f150a3f751044b2578d5", "4e53888d4fe7d02a3f280d94", "4e529848a3f751043f2591e1", "4e4fc694a3f75104581f7523", "4e337d464fe7d03c6b01b684", "4e544f224fe7d02a412ae254", "4e542ae44fe7d02a412a6ad5", "4e4d436ba3f751044e18c2d1", "4e5446a14fe7d02a322903bf", "4e48a0834fe7d02a410c6c93", "4dfbd9294fe7d0250b002ee7", "4e3ebdb1a3f75169c108c65d", "4e545c4da3f75104582a0c65", "4e545e71a3f751043f2afef3", "4e51c2a1a3f751045625013b", "4e5070b14fe7d02a3f20d8e6", "4e516fd5a3f751043f22e779", "4e545b094fe7d02a412b1b99", "4e541da24fe7d02a2c28afca", "4e2d1759a3f75151370f719b", "4e5402914fe7d02a2f281fb4", "4e51bb51a3f7510448230e82", "4e533cfaa3f7510448276140", "4dfed708a3f75104e3025223", "4e5266d3a3f7510452223256", "4e28b6b94fe7d0158000ae87", "4e0cbc484fe7d076b214334a", "4e552b984fe7d02a3b29fcdc", "4e54ade9a3f751045228c4cd", "4e5557d44fe7d05d7a0014cc", "4e55548fa3f75149cd000f07", "4e4a84874fe7d02a2c10ba03", "4e2e1e49a3f7512c780256de", "4e07c717a3f7517dcf060458", "4e3360ff4fe7d03c73010035", "4e5565d64fe7d05d86006f87", "4e231dbd4fe7d01dc3019bbf", "4e556bea4fe7d05d90005d99", "4e4eccff4fe7d02a291aa3da", "4e01feb04fe7d0775e000000", "4e54c55fa3f751044b2a5f72", "4e548e72a3f751044529083f", "4e43d65d4fe7d05d3002a39e", "4e5569c8a3f75149c6005515", "4e0c8781a3f751467a126284", "4e5449b54fe7d02a3f2acc12", "4e5571344fe7d05d81008a14", "4e5571c2a3f75149df0078d6", "4e41774aa3f7517bc603bb18", "4e540d0a4fe7d02a3f29aa9f", "4e1561dfa3f751698c0094bb", "4e27b35f4fe7d0282f0563db", "4e548b614fe7d02a382b0a96", "4e533d29a3f751043f2808be", "4e50aef34fe7d02a41221b9e", "4e54d47ca3f751044b2a64f7", "4e250730a3f751094b00883c", "4e5645f3a3f75149cd021abd", "4e5649cba3f75149cd0220b1", "4e5471b0a3f75104562c8206", "4e540e7da3f75104582912d0", "4e4b0a81a3f751044511495f", "4e567ede4fe7d05d7c024abb", "4dfa12464fe7d056bb0ab408", "4e1fd629a3f75107c00d5f9b", "4e5662264fe7d05d82023936", "4e3a4cb4a3f751255303ccd3", "4e09635aa3f7517d030b275c", "4e5097f24fe7d02a3f214699", "4e28aba1a3f75151450098d2", "4e3dfaec4fe7d05774079207", "4e5294d6a3f751045824b4ac", "4e0f9e06a3f7516721067807", "4e0fc9a64fe7d074d708d298", "4e514d70a3f7510458223d18", "4e559e794fe7d05d7601171d", "4e51764b4fe7d02a412320e4", "4e565bffa3f75149d002afd0", "4dfbe644a3f7513ec8007296", "4e21d210a3f7517398025626", "4e54f8804fe7d02a322a46a6", "4e1648cea3f751697807e325", "4e56c6efa3f75149ca038252", "4e55e6b34fe7d05d8201be0e", "4e56f4e1a3f751750000711a", "4e56ede8a3f75174fa005412", "4e3afca4a3f7512548064791", "4e5401814fe7d02a3f295df6", "4e51bc654fe7d02a3b21e90a", "4e53cd834fe7d02a2c275101", "4e5553924fe7d05d760013e9", "4e554cc54fe7d02a3b2a724b", "4e0ab0b5a3f751467c026677", "4e065841a3f7517dd201762f", "4e56f5c7a3f7517507007c3a", "4e481f0ba3f75104560b4367", "4e3a2704a3f751254f0394d8", "4e2c838ca3f75151450f0edc", "4e3633f7a3f75118a7073d5d", "4e3a0bbca3f7512548031a83", "4e16114ba3f751697f05497b", "4e4b1591a3f751045912a336", "4e0d1dc7a3f7514669197e90", "4e55b5ad4fe7d05d8f014a05", "4e0e1462a3f7517dd103a676", "4e52bd8fa3f751044b24a1a1", "4e2642274fe7d05f2b06aa9d", "4e4d350aa3f7510442186e7a", "4e559b5b4fe7d05d7a00f993", "4e4025304fe7d01d320329f1", "4e51e1ea4fe7d02a3f23cb47", "4dffe7c5a3f75104de07025b", "4e35be59a3f75118a106d2d7", "4e21e1d314169c70d300049f", "4e14c0f5a3f75102d6033216", "4e51f0f44fe7d02a4124776f", "4e23ab434fe7d030b0018f04", "4e3ad6174fe7d05c2a04a675", "4e0d4332a3f751466f1acc29", "4e44be70a3f7510452022839", "4e487e1fa3f75104480c10fe", "4e4f37424fe7d02a3f1eafe8", "4e3a1eada3f751254f037a0e", "4e5338824fe7d02a2923c952", "4dfac2df4fe7d05025000596", "4e56cc644fe7d05d7a03cbf6", "4e56a27aa3f75149d9031ab2", "4e48b57c4fe7d02a3f0c0eff", "4e0ce3a94fe7d076ac17d33d", "4e3b7e0c4fe7d0578e006c83", "4e25d656a3f7510946037124", "4e4372bea3f7511494023712", "4e4fe8ada3f75104481f7690", "4e547d15a3f75104592b24fa", "4e25bae0a3f751094602ba95", "4e55e08aa3f75149d401c3fa", "4e40650da3f7517bd4012de5", "4e1b6fa2a3f75163000712bc", "4e0cbd8da3f751467a159a13", "4e52942aa3f751044e257277", "4e4c1ef74fe7d02a2f157f68", "4e21e1cd14169c70d10005e4", "4e56d323a3f7517509000647", "4e1e77e0a3f75107c704d908", "4e175a7c4fe7d0665b112935", "4e55b2afa3f75149d4014d6c", "4e183ec3a3f75133b503e8f1", "4e1a9306a3f75163030216ae", "4e3608404fe7d03c7906fd36", "4e3debd14fe7d057770743b0", "4e5734db4fe7d05309013391", "4e1b3545a3f75162f003d3d7", "4dff87bfa3f75104e7044349", "4e572f0b4fe7d0531600e969", "4e2b22bc4fe7d0158f0a4b2a", "4e3d028da3f75169c105b007", "4e04cac0a3f751760201e6ee", "4e3b649b4fe7d0577400158b", "4e573b144fe7d0530e01730a", "4e4ae8bfa3f751044212b2df", "4e306ee74fe7d015d90a260e", "4e13d6434fe7d0124f09acce", "4e56cf014fe7d05d7a03cd38", "4e25e9dfa3f751093b03fc2b", "4e0a5ef94fe7d0107814044b", "4e477f244fe7d02a410a04f9", "4e4772344fe7d02a3509a90f", "4e4d893ea3f751043f199d96", "4e3aebb94fe7d05c3e05b3f9", "4e51ce084fe7d02a2f228870", "4e1b8856a3f75162f50750ce", "4e56ed0aa3f7517509003e0f", "4e5308e34fe7d02a3b24bf2d", "4e4ff486a3f7510442206bdb", "4e545511a3f751043f2ad7b7", "4e5752904fe7d05309016fee", "4e41f5eba3f7517bc805bba8", "4e3f7b6f4fe7d01d2601c252", "4e55d54da3f75149c601b582", "4e09623aa3f7517d110b0b53", "4df9298b4fe7d056ba0603bc", "4e4d616b4fe7d02a3b17917f", "4e1bf8894fe7d031450a7919", "4e51dabb4fe7d02a4324c427", "4e531a26a3f751043f2781c5", "4e57023ba3f7517504009de0", "4e1050364fe7d074d00b5824", "4e45a15aa3f7510445052bb8", "4e432d4ca3f75114890116e9", "4e2138f3a3f75173930144f6", "4dfb7328a3f7515c5701b01f", "4e583c4a4fe7d05312040e08", "4e4c48b94fe7d02a2c16537d", "4e257a594fe7d05f3601b5de", "4debd60a4fe7d017ac010d49", "4e434db7a3f7511498020f1d", "4e44ad6ca3f751045902cf02", "4e04f964a3f751760304355b", "4e4be173a3f75104451319ab", "4e4d5fd24fe7d02a41194e64", "4e25dd144fe7d05f2b03eabb", "4e029d8c4fe7d0613902888c", "4e18baada3f75133ae05bde2", "4e5847254fe7d0530603f0cf", "4e3359ed4fe7d03c7600f1b0", "4e57c06c4fe7d05317024700", "4e581d154fe7d05312038d2d", "4e508e6c4fe7d02a3b1f5bb4", "4e49621fa3f75104580d68b0", "4e52a371a3f751043f25b0dd", "4e55966c4fe7d05d8100fdc5", "4e5405a24fe7d02a38292126", "4e3f78bba3f7512f1c01b112", "4e5a6669a3f7517501070ad7", "4e3a13e34fe7d05c3e030417", "4e498ac3a3f75104560e93ef", "4e17fa70a3f75133b402ae57", "4e141a9d4fe7d012520b0b96", "4e51a7634fe7d02a4123a141", "4e597482a3f75174fb064d43", "4e59e1204fe7d05309074fab", "4e02744d4fe7d0613801a617", "4e545a43a3f7510445283f72", "4e0241b5a3f751791b001494", "4e5b58d64fe7d006060080e7", "4dfd231a4fe7d0250b0366ad", "4dfef8594fe7d028c402de5c", "4e5dbdda4fe7d044ad027327", "4e25ca094fe7d05f3a02cd70", "4e1920caa3f75133a6083130", "4e5e7c504fe7d0449c046409", "4e5fe31c4fe7d044960a1b4c", "4e602f85a3f7514e0f18d585", "4e41ea3d4fe7d02e54055a8d", "4e605143a3f7514e0509e0da", "4e6051164fe7d044ad08f57b", "4e477d844fe7d02a3b093419", "4e6058b8a3f7514e0b08537f", "4e05c6194fe7d00b64093c20", "4e5eb02ba3f7514e0f137487", "4e1e08f04fe7d05125014635", "4e2d0ab9a3f75151370f5007", "4e1e7fca4fe7d0511f05456e", "4e5e9d254fe7d044a70461f7", "4e4f23c4a3f751044e1f0c89", "4e05be6ba3f7514bf7013205", "4e575487a3f7517501016042", "4e4702a94fe7d02a32090714", "4e6060884fe7d044ae0b91e5", "4e47278aa3f751043f0989b5", "4e604029a3f7514e01091fe2", "4e6056054fe7d0449c097264", "4e4f4c7f4fe7d02a291c2833", "4e36e3c24fe7d03c6808f077", "4e1d2701a3f75162f51207a8", "4e0020014fe7d028c4082324", "4e606ff1a3f7514df509e78a", "4e544972a3f75104592a58d8", "4e576a2fa3f7517504016986", "4e5beaaba3f7513e8b017e70", "4e40eb11a3f7517bc802aa5c", "4df0ef2e4fe7d06317119c49", "4e5dc427a3f7514e0e07925f", "4e5ff7414fe7d0449c084952", "4e607cf44fe7d044ae0bc799", "4e5f0c3da3f7514e0f152813", "4e604dfa4fe7d044b00a2ce7", "4e5f86f94fe7d044a607e53d", "4e0a25074fe7d0107b0fcfe3", "4e4ffe8b4fe7d02a321ea431", "4e29348ba3f751513402ec70", "4e4769094fe7d02a320a2723", "4e5fed4fa3f7514dfb0747e0", "4e4b60284fe7d02a41141e24", "4e2755ef4fe7d0283002816c", "4e5af5664fe7d045fc000707", "4e35bf6ea3f75118bb068b57", "4e6301eba3f7514df81213b2", "4e6445964fe7d042ea01169c", "4e64429e4fe7d042d5014672", "4e149a12a3f75102cd00f0d2", "4e21b29aa3f751738d01fa3f", "4e6267684fe7d044b00e7299", "4ded03174fe7d00428016095", "4e5c08a0a3f7513e7101ddd7", "4e644c8ba3f7513f4b012ed5", "4e4893fea3f75104520bb4de", "4e6331824fe7d0449610594d", "4e6190c3a3f7514dfb0c2ffd", "4e2847e3a3f7512466066e6e", "4df8fe404fe7d056bf037121", "4e408fc94fe7d02e5e014a5f", "4e4b3235a3f7510448133cf7", "4e30e4874fe7d015e30d684b", "4e62f6a54fe7d044ad0d554f", "4e63b1034fe7d067540007c7", "4e021956a3f751039d0095fd", "4e4021a84fe7d01d2b0298e8", "4e5e8d63a3f7514e0d062e15", "4e34f2154fe7d03c6204dd36", "4df97eed4fe7d056c308b3bc", "4e03d7b94fe7d0613a09ba34", "4e5f065f4fe7d044a5055952", "4e1a74114fe7d03145013cef", "4e6027d44fe7d044a7097ac4", "4ddae91de8a6c47b520000df", "4e1f01e24fe7d05116069bbf", "4e634f62a3f7514dfb0eac35", "4e5da070a3f7514dfb01c452", "4e60a4bca3f7514e0d0c9f2a", "4e16abfba3f75169750b9a6e", "4e1948ffa3f75133bc094a23", "4e3790b84fe7d03c760c7de2", "4e600f554fe7d044a709208d", "4e3377274fe7d03c7d01a97e", "4e3ac8414fe7d05c3204f778", "4e037657a3f751792105f35f", "4e6447a5a3f7513f3e010806", "4e628fc34fe7d0449911ff0c", "4e2bc9894fe7d0157d0ca5e9", "4e2f9cbda3f7512c8f086667", "4e64834f4fe7d042db0211c9", "4e4d98524fe7d02a3519d552", "4e631986a3f7514e0e12e7bd", "4e5cb786a3f7513e710321c3", "4e1dc6e1a3f75162f3151986", "4e308b46a3f7512c750b75a1", "4e4adb2c4fe7d02a4312b807", "4e0ed838a3f751671e0418e0", "4e43dd9ca3f751148002cce6", "4e4e217e4fe7d02a411c1530", "4e4b51cc4fe7d02a38129d34", "4dfe7a1f4fe7d028c601710d", "4e6579faa3f7513f3b030962", "4e6bc989a3f7512ea806a30d", "4e14572c4fe7d01255099253", "4e57f9314fe7d0530602ea4e", "4e348d944fe7d03c80041816", "4e172ac9a3f75169720c60b5", "4e24a574a3f751434e02f9d3", "4e6ce3aaa3f7512eb0089a28", "4e6e6e21a3f75112c3016a57", "4e3c0df64fe7d0578d01c0cf", "4e5bf3764fe7d005fa01a0c3", "4e56c5d04fe7d05d8203b74a", "4e7031da4fe7d045be0c5d27", "4e6da7a94fe7d045be002391", "4e6823e04fe7d01d9603bbaa", "4e7030f9a3f75112ad0bdc0a", "4e0babae4fe7d076b70b6d1b", "4e270ca94fe7d0282f00aa96", "4e6599984fe7d055d90007c8", "4e6fc2fe4fe7d045b007a46f", "4e4da3f84fe7d02a3f19e909", "4e7035cf4fe7d045bf0d2546", "4ddc025be8a6c45f6f000398", "4e7033774fe7d045c919613e", "4e64285da3f7513f4b00cf00", "4e0ebaf14fe7d074d3036a87", "4dea70c94fe7d0517b1a3519", "4e1f131ea3f75107c006cfa4", "4e068991a3f7517dd702669f", "4e5bd1afa3f7513e83014dab", "4e6f9dbfa3f75112b0073ac1", "4e6fded2a3f75112bb087acb", "4e497b4e4fe7d02a350de1b5", "4e7040224fe7d045c60e1650", "4e6fb0c0a3f75112b406a181", "4e70f0eaa3f75112b412337d", "4e0b513ba3f7514674057a37", "4e40a70ca3f7517bd501dc2a", "4e2edf194fe7d015e503e26d"];

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
		temp_user_hash[user_id] = {"name": user_hash[user_id]["name"], "leave_time": 0, "last_active": new Date()};
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
	var input_message = "÷÷÷÷÷÷÷÷÷÷÷Commands÷÷÷÷÷÷÷÷÷÷÷ [] w? [] w+ [] w- [] w++ [] -mods [] -plays [] -promote [] -remove [#] [][][][][][][][][][][][] [] -votekick [username] [][][][][][][][][][][][][][] Type -help [command] for more info on a command (ie. -help w?)";
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
		var target_dj_spot = parseInt(text.substring(8, text.length)) || 0;
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
	'-remove ': [vote_remove, "-remove [#]: Removes DJ in spot [#] (requives votes)"],
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
	set_active_users(m);
});

function set_active_users(m){
	// m is message event listener
	var user_id = m["userid"] || m["user"][0]["userid"];
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

setInterval("temp_user_hash_leave_timer()", 10000);
setInterval("update_dj_play_count()", 10000);
setInterval("prevent_idle()", 60000);	// check self idle every minute

function prevent_idle(){
	// currently 8 messages
	var current_time = new Date();
	if (current_time - last_message_time >= 600000){
		// speak every 20 minutes
		var messages = ["hey", "how's everyone doing?", "lol", "wsuuhh", "w?", "-plays", "-help", ":]"];
		deliver_chat(messages[idle_message_index%(messages.length)]);
		idle_message_index++;
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

// function refresh_queue(){
// 	for (user_id in my_queue){
// 		if (!(user_id in my_queue)){
// 			
// 		}
// 	}
// }

var handleMessage = function(m) { console.log(m); }
turntable.addEventListener("message", handleMessage);

var soundstartMessage = function(m) { console.log(m); }
turntable.addEventListener("trackstart", soundstartMessage);
