var xmpp = require("node-xmpp");
var request = require("request");
var nconf = require("nconf");

nconf.use("file", {
    file: "./config.json"
});

function go_online(conn, cb){
    conn.on("online", function(){
        conn.send(new xmpp.Element("presence", { type: "available" }).c("show").t("chat")); 
        cb();
    });
}

exports.create_room = function(room_jid, room_name, cb){
    var conn = new xmpp.Client(nconf.get("account"));
    
    go_online(conn, function(){
        var room_presence = new xmpp.Element("presence", { 
            to: room_jid + "@muc.localhost/" + (nconf.get("account:jid")).split("@")[0] 
        }).c('x', { xmlns: 'http://jabber.org/protocol/muc' });
        
        var room_iq = new xmpp.Element('iq', { to: room_jid + "@muc.localhost", type: 'set' })
                .c("query", { xmlns : 'http://jabber.org/protocol/muc#owner'})
                .c("x", { xmlns:"jabber:x:data", type:"submit" })
                .c("field", { "var":'muc#roomconfig_roomname' })
                .c("value")
                .t(room_name);
        
        console.log("Creating room...");
        conn.send(new xmpp.Element("presence", { type: "available" }).c("show").t("chat")); 
        // Send new room's presence
        conn.send(room_presence);
        // Set room's name
        conn.send(room_iq);
        
        cb();
        conn.end();
    });
}

exports.delete_room = function(room_jid, cb){
    var conn = new xmpp.Client(nconf.get("account"));
    
    go_online(conn, function(){    
        var room_iq = new xmpp.Element('iq', { to: room_jid + "@muc.localhost", type: 'set' })
                .c("query", { xmlns : 'http://jabber.org/protocol/muc#owner'})
                .c("destroy");
    
        console.log("Destroying room...");
        conn.send(new xmpp.Element("presence", { type: "available" }).c("show").t("chat"));
        conn.send(room_iq);
        
        cb();
        conn.end();
    });
}

exports.discover_rooms = function(cb){
    var conn = new xmpp.Client(nconf.get("account"));
    go_online(conn, function(){
        var room_iq = new xmpp.Element('iq', { to: "muc.localhost", type: 'get' })
                .c("query", { xmlns : 'http://jabber.org/protocol/disco#items'});
    
        console.log("Discovering rooms...");
        conn.send(room_iq);
        conn.on("stanza", function(stanza){
            if (stanza.is("iq")){
                var query = stanza.getChild("query").getChildren("item");
                
                var i = 0;
                var array = [];
                query.forEach(function(q){
                    array.push({
                        "jid" : q.attrs.jid,
                        "name" : q.attrs.name
                    });
                });
                cb(JSON.stringify(array));
                conn.end();
            }
        });
        
        conn.on("error", function(stanza){
            console.log("[ERROR] ")
        });
    });
}