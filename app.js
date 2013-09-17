var nconf = require("nconf");
var cons = require("consolidate");
var express = require("express");
var xmpp = require("node-xmpp");

var user = require("./manage_rooms");

nconf.use("file", {
    file: "./config.json"
});

var app = express();

app.configure(function(){
    app.use("/", express.static(__dirname));
	app.use(express.bodyParser());
	app.use(app.router);
});

app.get("/", function(reqP, resP){
    var data = {
        "server" : nconf.get("account:host"), 
        "domain" : nconf.get("account:jid").split("@")[1]
    }
	cons.swig("./media/v2/main.html", data,function(err, html){
		resP.writeHead(200, {"Content-Type" : "text/html"});
		resP.end(html);
	});
});

app.post("/rooms", function(reqP, resP){
    var room_jid = reqP.body.room_jid;
    var room_name = reqP.body.room_name;
    var room_desc = reqP.body.room_desc;
    
    var reply = {
        "status_code" : 200,
        "message" : "OK"
    };
    
    user.create_room(room_jid, room_name, room_desc, function(){
        resP.json(200, JSON.stringify(reply));
    });
});

app.delete("/rooms/:roomid", function(reqP, resP){
    var roomid = reqP.params.roomid;
    var reply = {
        "status_code" : 200,
        "message" : "OK"
    };
    user.delete_room(roomid, function(){
        resP.json(200, JSON.stringify(reply));
    });
});

app.get("/rooms/:roomid", function(reqP, resP){
    var roomid = reqP.params.roomid;
    if (roomid === "all"){
        user.discover_rooms(function(rooms){
            resP.end(rooms);
        });
    }else{
        user.get_member_list(roomid, function(users){
            console.log(users);
            resP.end(users);
        });
    }
});

app.get("/chatroom/:roomid", function(reqP, resP){
    cons.swig("./media/v2/room.html", {"room_id" : reqP.params.roomid}, function(err, html){
		resP.writeHead(200, {"Content-Type" : "text/html"});
		resP.end(html);
    });
})

app.listen(nconf.get("app:port"), nconf.get("app:host"));var nconf = require("nconf");
