function disco_rooms(){
    $.getJSON("/rooms/all", function(data){
        $.each(data, function(i, field){
            console.log(data);
            $("#list_rooms").append("<option>" + field.jid + ":" + field.name.split(" ")[0] + "</option>");
        });
    });
}
$(document).ready(function(){
    $("#div_createform").hide();
    $("#list_rooms").empty();
    $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
	disco_rooms();
    
    $("#div_bcreate").hover(function(){
        $("#div_createform").fadeIn(500);
    }, function(){
        $("#div_createform").fadeOut(500);
    });
    
    $("#btn_create").click(function(){
        var jid = $.trim($('#txt_jid').val());
        var name = $.trim($('#txt_name').val());
        var desc = $.trim($('#txt_desc').val());
        if ((jid === null) || (jid === "") || (name === null) || (name === "") || (desc === null) || (desc === "")){
            alert("Empty textbox(es) is(are) not allowed. Containing of white spaces only is also not allowed.");
        }else{
    		$.ajax({
    			url: "/rooms",
    			type: "POST",
    			data: JSON.stringify({
    				room_jid: jid,
                    room_name: name,
                    room_desc: desc
    			}),
    			contentType: "application/json",
    			dataType: "json"
    		}).done(function(data){
                console.log(data);
                $("#txt_jid").val("");
                $("#txt_name").val("");
                $("#txt_desc").val("");
                $("#list_rooms").empty();
                $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
    			disco_rooms();
    		});
        }
    });
	$("#btn_delete").click(function(){
        var room_jid = $("#list_rooms").val();
        if ((room_jid === null) || (room_jid === "")){
            alert("Select room to delete");
        }else{
    		$.ajax({
    			url: "/rooms/" + room_jid.split("@")[0],
    			type: "DELETE"
    		}).
    		done(function(data){
                console.log(data);
                $("#list_rooms").empty();
                $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
    			disco_rooms();
    		});
        }
	});
    $("#btn_disco").click(function(){
        $("#list_rooms").empty();
        $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
		disco_rooms();
    });
    $("#btn_manage_room").click(function(){
        var room_jid = $("#list_rooms").val();
		window.location.href = "/chatroom/" + room_jid.split("@")[0];
    });
});
