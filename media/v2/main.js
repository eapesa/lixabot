function disco_rooms(){
    $.getJSON("/allrooms", function(data){
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
        $("#div_createform").fadeIn(600, function(){
            $(this).slideDown();
        });
    }, function(){
        $("#div_createform").fadeOut(600, function(){
            $(this).slideUp();
        });
    });
    
    $("#btn_create").click(function(){
		$.ajax({
			url: "/rooms",
			type: "POST",
			data: JSON.stringify({
				room_jid: $("#txt_jid").val(),
                room_name: $("#txt_name").val()
			}),
			contentType: "application/json",
			dataType: "json"
		}).done(function(data){
            console.log(data);
            $("#txt_jid").val("");
            $("#txt_name").val("");
            $("#list_rooms").empty();
            $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
			disco_rooms();
		});
    });
	$("#btn_delete").click(function(){
        var room_jid = $("#list_rooms").val();
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
	});
    $("#btn_disco").click(function(){
        $("#list_rooms").empty();
        $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
		disco_rooms();
    });
    $("#btn_manage_room").click(function(){
        var room_jid = $("#list_rooms").val();
		$.ajax({
			url: "/rooms/" + room_jid.split("@")[0],
			type: "GET"
		}).
		done(function(data){
            console.log(data);
            $("#list_rooms").empty();
            $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
			disco_rooms();
		});
    });
});
