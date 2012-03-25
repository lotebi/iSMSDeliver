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
                $.mobile.changePage($("#pageHome"), {transition:getRandTransition()});
                magtifunobj.getBalance(updateCreditsGel);
            } else {
                navigator.notification.vibrate(250);
                navigator.notification.alert("Wrong Username or Password", null, "MissBehaive", "I'm Sorry!");
            }
        })
    });
    $("#send").click(function (e) {
        e.preventDefault();
        if ($("#maxMessages").css("visibility") == "hidden") {
            var recipient = $("#recipients").val();
            var msgbody = $("#msgBody").val();
            magtifunobj.sendSms(recipient, msgbody, function (a) {
                $("#recipients").val("");
                $("#msgBody").val("");
                magtifunobj.getBalance(updateCreditsGel);
            })
        } else {
            navigator.notification.alert("You exsided message character limit", null, "MissBehaive", "I'm Sorry!");
        }
    });

    $("#msgBody").keyup(onMsgChange);
    $("#msgBody").keydown(onMsgChange);
    $("#msgBody").bind("change", onMsgChange);

    $("#logout").click(function (e) {
        e.preventDefault();
        var transition = getRandTransition();
        $.mobile.changePage($("#pageLogin"), {transition:transition})
    });
    $("#about").click(function (e) {
        e.preventDefault();
        var transition = getRandTransition();
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
        magtifunobj.getHistory(function (historys) {
            var group;
            var groupCounter = 0;
            $(".ui-listview").html("");
            for (var i = 0; i < historys.length; i++) {
                var aHistory = historys[i];
                if (aHistory.date.toDateString().split(" ").join() != group) {
                    group = aHistory.date.toDateString().split(" ");
                    group = group[0] + "," + group[1] + " " + group[2] + ","+group[3];
                    var appendHeader = "<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li ui-li-divider ui-btn ui-bar-b ui-li-has-count ui-btn-up-undefined counterli\">" + group +
                        "<span class=\"ui-li-count ui-btn-up-c ui-btn-corner-all\">" + groupCounter + "</span></li>";
                    $(".ui-listview").append(appendHeader);
                    groupCounter = 0;
                } else {
                    groupCounter++;
                    var appendMsg = "<li data-theme=\"c\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-static ui-body-c ui-btn-up-c\">" +
                        "<div class=\"ui-btn-inner ui-li ui-li-static ui-body-c\">" +
                        "<div class=\"ui-btn-text\">" +
                        "<a href=\"\" class=\"ui-link-inherit\">" +
                        "<p class=\"ui-li-aside ui-li-desc\"><strong>" + aHistory.date.getHours() + ":" + aHistory.date.getMinutes() + ":" + aHistory.date.getSeconds() + "</strong></p>" +
                        "<h3 class=\"ui-li-heading\">" + aHistory.number + "</h3>" +
                        "<p class=\"ui-li-desc\"><strong>" + aHistory.msgText + "</strong></p>" +
                        "</a></div></div></li>";
                    $(".ui-listview").append(appendMsg);
                }
            }
        });
        normalizeHistory();
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

    function normalizeHistory() {
        var counters = $(".counterli > span");
        for (var i = 0; i < counters.length; i++) {
            if (i+1 != counters.length) {
                $(counters[i]).text($($(".counterli > span")[i + 1]).text())
            }
        }

    }

    function onMsgChange() {
        var currChars = $("#msgBody").val().length;
        if (currChars < 146) {
            $("#charCount").text(146 - currChars);
            $("#message").text(1);
            $("#maxMessages").css("visibility", "hidden");
        } else if (currChars > (146 + 146 + 146)) {
            $("#charCount").text((146 + 146 + 146) - currChars);
            $("#message").text(3);
            $("#maxMessages").css("visibility", "visible");
        } else if (currChars > (146 + 146)) {
            $("#charCount").text((146 + 146 + 146) - currChars);
            $("#message").text(3);
            $("#maxMessages").css("visibility", "hidden");
        } else if (currChars > 146) {
            $("#charCount").text((146 + 146) - currChars);
            $("#message").text(2);
            $("#maxMessages").css("visibility", "hidden");
        }
    }

    function updateCreditsGel(credits, gel) {
        $("#credit").text(credits);
        $("#gel").text(gel);
    }

    function getRandTransition() {
        return transitions[getRandomArbitrary(0, transitions.length)];
    }

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
});