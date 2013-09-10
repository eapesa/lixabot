function disco_rooms(){
    $.getJSON("/rooms", function(data){
        $.each(data, function(i, field){
            console.log(data);
            $("#list_rooms").append("<option>" + field.name.split(" ")[0] + " : " + field.jid + "</option>");
        });
    });
}
$(document).ready(function(){
    $("#list_rooms").empty();
    $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
	disco_rooms();
    
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
			$("#div_done").html(data.message);
            $("#txt_jid").val("");
            $("#txt_name").val("");
            $("#list_rooms").empty();
            $("#list_rooms").append("<option style='text-align:center;'>---List of Rooms---</option>");
			disco_rooms();
		});
    });
	$("#btn_delete").click(function(){
        var room_jid = $("#txt_jid2").val();
		$.ajax({
			url: "/rooms/" + room_jid,
			type: "DELETE"
		}).
		done(function(data){
            console.log(data);
			$("#div_done").html(data.message);
            $("#txt_jid2").val("");
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
});