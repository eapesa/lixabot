var nconf = require("nconf");
var cons = require("consolidate");
var express = require("express");

var app = express();

var user = require("./manage_rooms");

nconf.use("file", {
    file: "./config.json"
});

app.configure(function(){
    app.use("/", express.static(__dirname));
	app.use(express.bodyParser());
	app.use(app.router);
});

app.get("/", function(reqP, resP){
	cons.swig("./media/v2/main.html",{},function(err,html){
		resP.writeHead(200, {"Content-Type" : "text/html"});
		resP.end(html);
	});
});

app.post("/rooms", function(reqP, resP){
    var room_jid = reqP.body.room_jid;
    var room_name = reqP.body.room_name;
    
    var reply = {
        "status_code" : 200,
        "message" : "OK"
    };
    user.create_room(room_jid, room_name, function(){
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

app.get("/allrooms", function(reqP, resP){
    var reply = {
        "status_code" : 200,
        "message" : "OK"
    };
    user.discover_rooms(function(rooms){
        resP.end(rooms);
    });
});

app.get("/rooms/:roomid", function(reqP, resP){
    resP.json(200, "Inside room " + reqP.params.roomid);
});

app.listen(nconf.get("app:port"), nconf.get("app:host"));var nconf = require("nconf");
