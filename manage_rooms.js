var request = require("request");
var nconf = require("nconf");
var xmpp = require("node-xmpp");

nconf.use("file", {
    file: "./config.json"
});

function go_online (conn, cb){
    conn.on("online", function(){
        conn.send(new xmpp.Element("presence", { type: "available" }).c("show").t("chat")); 
        cb();
    });
}

exports.create_room = function(room_jid, room_name, room_desc, cb){
    var conn = new xmpp.Client(nconf.get("account")); 
    go_online(conn, function(){
        var room_presence = new xmpp.Element("presence", { 
            to: room_jid + "@muc." + nconf.get("account:jid").split("@")[1] + "/" + (nconf.get("account:jid")).split("@")[0] 
        }).c('x', { xmlns: 'http://jabber.org/protocol/muc' });
        
        var room_iq = new xmpp.Element('iq', { to: room_jid + "@muc." + nconf.get("account:jid").split("@")[1], type: 'set' })
                .c("query", { xmlns : 'http://jabber.org/protocol/muc#owner'})
                .c("x", { xmlns:"jabber:x:data", type:"submit" });
                
        room_iq.c("field", { "var":'muc#roomconfig_roomname' })
               .c("value")
               .t(room_name);
               
       room_iq.c("field", { "var":'muc#roomconfig_roomdesc' })
              .c("value")
              .t(room_desc);
        
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
        var room_iq = new xmpp.Element('iq', { to: room_jid + "@muc." + nconf.get("account:jid").split("@")[1], type: 'set' })
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
        var room_iq = new xmpp.Element('iq', { to: "muc." + nconf.get("account:jid").split("@")[1], type: 'get' })
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

exports.get_member_list = function(room_jid, cb){
    var conn = new xmpp.Client(nconf.get("account"));
    go_online(conn, function(){
        var room_iq = new xmpp.Element('iq', { to: room_jid + "@muc." + nconf.get("account:jid").split("@")[1], type: 'get' })
                .c("query", { xmlns : 'http://jabber.org/protocol/disco#items'});
    
        console.log("Getting member list...");
        conn.send(room_iq);
        
        conn.on("stanza", function(stanza){
            if (stanza.is("iq")){
                var query = stanza.getChild("query").getChildren("item");
                
                var i = 0;
                var array = [];
                query.forEach(function(q){
                    array.push({
                        "name" : q.attrs.name
                    });
                });
                
                cb(JSON.stringify(array));
                conn.end();
            };
        });
    });
}