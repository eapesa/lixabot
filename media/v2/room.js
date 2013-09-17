$(document).ready(function(){
    $.getJSON("/rooms/{{roomid}}",function(data){
        $.each(data, function(i, field){
            console.log(data);
            $("#list_users").append("<option>" + field.jid + ":" + field.name + "</option>");
        });
    });
});