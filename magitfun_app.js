$(function () {
    var magtifunobj;
    var transitions = new Array();
    transitions.push("pop");
    transitions.push("flip");
    transitions.push("slide");
    transitions.push("slideup");
    transitions.push("slidedown");

    $("#login").click(function (e) {
        e.preventDefault();
        var user = $("#username").val();
        var password = $("#password").val();
        magtifunobj = new magitfun(user, password);
        magtifunobj.login(function (a) {
            if (a == "succses") {
                $.mobile.changePage($("#pageHome"), {transition:getRandTransition()})
            } else {
                navigator.notification.vibrate(250);
                navigator.notification.alert("Wrong Username or Password", null, "MissBehaive", "I'm Sorry!");
            }
        })
    });
    $("#send").click(function (e) {
        e.preventDefault();
        var recipient = $("#recipients").val();
        var msgbody = $("#msgBody").val();
        magtifunobj.sendSms(recipient, msgbody, function (a) {
            $("#recipients").val("");
            $("#msgBody").val("");
        })
    });

    $("#msgBody").keyup(function (e) {
        var currChars = $("#msgBody").val().length;
        if (currChars < 146) {
            $("#charCount").val(146 - currChars);
            $("#message").val(1);
            $("#maxMessages").css("visibility", "hidden");
        } else if (currChars > 146) {
            $("#charCount").val((146 + 146) - currChars);
            $("#message").val(2);
            $("#maxMessages").css("visibility", "hidden");
        } else if (currChars > (146 + 146)) {
            $("#charCount").val((146 + 146 + 146) - currChars);
            $("#message").val(3);
            $("#maxMessages").css("visibility", "hidden");
        } else if (currChars > (146 + 146 + 146)) {
            $("#message").val(3);
            $("#maxMessages").css("visibility", "visible");
        }
    });

    $("#logout").click(function (e) {
        e.preventDefault();
        var transition = getRandTransition();
        console.log(transition);
        $.mobile.changePage($("#pageLogin"), {transition:transition})
    });
    $("#about").click(function (e) {
        e.preventDefault();
        var transition = getRandTransition();
        console.log(transition);
        $.mobile.changePage($("#pageHome"), {transition:transition})
    });

    $("#navbarSms").click(function (e) {
        e.preventDefault();
        $(".content-sms").css("display", "block");
        $(".content-history").css("display", "none");
        $(".content-contacts").css("display", "none");
    });
    $("#navbarHistory").click(function (e) {
        e.preventDefault();
        $(".content-history").css("display", "block");
        $(".content-sms").css("display", "none");
        $(".content-contacts").css("display", "none");
    });
    $("#navbarContacts").click(function (e) {
        e.preventDefault();
        $(".content-contacts").css("display", "block");
        $(".content-sms").css("display", "none");
        $(".content-history").css("display", "none");
    });
    function getRandTransition() {
        return transitions[getRandomArbitrary(0, transitions.length)];
    }

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
});