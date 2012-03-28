$(function () {
    $("#login").click(function (e) {
        e.preventDefault();
        var user = $("#username").val();
        var password = $("#password").val();
        var connectorObject = new Magitfun(user, password);
        connectorObject.login(function (a) {
            if (a == "succses") {
                $.mobile.changePage("home.html", {
                    transition:'flip',
                    type: "post",
                    data:{cookie:connectorObject.getCookie()}
                });
            } else {
                navigator.notification.vibrate(250);
                navigator.notification.alert("Wrong Username or Password", null, "MissBehaive", "I'm Sorry!");
            }
        })
    });
});
