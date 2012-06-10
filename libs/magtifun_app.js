var connectorObject, mHistory, contactsRemote, contactsLocal = [], contactsMerged, transitions = [];
transitions.push("pop");
transitions.push("flip");
transitions.push("slide");
transitions.push("slideup");
transitions.push("slidedown");

$(function () {
        $("#login").click(function (e) {
            e.preventDefault();
            ldLoading();
            $("#username").val("lukasa");
            $("#password").val("dodelia1993");
            var user = $("#username").val();
            var password = $("#password").val();
            connectorObject = new Magitfun(user, password);
            connectorObject.login(function (a) {
                if (a == "succses") {
                    $.mobile.changePage($("#pageHome"));
                    refreshCatpcha();
                    refreshBalance();
                } else {
                    navigator.notification.vibrate(250);
                    navigator.notification.alert("Wrong Username or Password", null, "MissBehaive", "I'm Sorry!");
                }
            })
        });

        $('#pageHome').live('pageshow', function () {
            ldLoading();
            grabContacts();
            grabHistory(2);
        });


        $("#refresh").click(function (e) {
            e.preventDefault();
            ldLoading();
            refreshBalance();
            refreshCatpcha();
            grabHistory(2);
        });

        $("#send").click(function (e) {
            e.preventDefault();
            ldLoading();
            if ($("#maxMessages").css("visibility") == "hidden") {
                var recipient = $("#recipients").val();
                var msgbody = $("#msgBody").val();
                var captcha = $("#captcha").val();
                connectorObject.sendSms(recipient, msgbody, captcha, function () {
                    $("#recipients").val("");
                    $("#msgBody").val("");
                    $("#captcha").val("");
                    refreshBalance();
                    refreshCatpcha();
                    grabHistory(2);
                    onMsgChange();
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
            $.mobile.changePage($("#pageLogin"));
        });
        $("#about").click(function (e) {
            e.preventDefault();
            navigator.notification.alert("Ra About ?? Button Dainaxe da daachire?", null, "Kai roja Xar?", "sxvagan movxvdi");
        });

        $("#navbarSms").click(function (e) {
            e.preventDefault();
            $(".contacts-view").html(" ");

            $(".content-sms").css("display", "block");
            $(".content-history").css("display", "none");
            $(".content-contacts").css("display", "none");
        });
        $("#navbarHistory").click(function (e) {
            e.preventDefault();
            $(".contacts-view").html(" ");

            $(".content-history").css("display", "block");
            $(".content-sms").css("display", "none");
            $(".content-contacts").css("display", "none");
        });
        $("#navbarContacts").click(function (e) {
            e.preventDefault();
            $(".contacts-view").html(" ");

            $(".content-contacts").css("display", "block");
            $(".content-sms").css("display", "none");
            $(".content-history").css("display", "none");

            $(".contacts-choose").css("display", "block");
            $(".contacts-view").css("display", "none");
        });

        $("#allContacts").click(function (e) {
            e.preventDefault();

            ldLoading();
            setTimeout(function () {
                generateContacts("", true)
            }, 100);


        });
        $("#localContacts").click(function (e) {
            e.preventDefault();

            ldLoading();
            setTimeout(function () {
                generateContacts(contactsLocal, false)
            }, 100);

            //$(".contacts-choose").css("display", "none");
            //$(".contacts-view").css("display", "block");
        });
        $("#providerContacts").click(function (e) {
            e.preventDefault();

            ldLoading();
            setTimeout(function () {
                generateContacts(contactsRemote, false);
            }, 100);

            //$(".contacts-choose").css("display", "none");
            //$(".contacts-view").css("display", "block");
        });

        //----------------------------Local Contacts-----------------------------------
        document.addEventListener("deviceready", function () {
            $.mobile.touchOverflowEnabled = true;
            function onSuccess(contacts) {
                for (var i = 0, length = contacts.length; i < length; i++) {
                    var deviceContact = contacts[i];
                    var aContact = {};
                    try {
                        aContact.name = deviceContact.name.formatted;
                        aContact.number = [];
                        for (var j = 0; j < deviceContact.phoneNumbers.length; j++) {
                            aContact.number.push(deviceContact.phoneNumbers[j].value);
                        }
                        contactsLocal.push(aContact);
                    } catch (e) {
                    }
                }

                sortContacts(contactsLocal);
            }

            function onError(contactError) {
                navigator.notification.alert("Something Bad Happened About Contacts\nMaybe You Should Start Again", null, "Tragedy", "understood");
                //console.log(contactError);
            }

            var options = new ContactFindOptions();
            options.filter = "";
            options.multiple = true;
            filter = ["displayName", "name", "phoneNumbers"];
            navigator.contacts.find(filter, onSuccess, onError, options);

        }, false);
        //----------------------------Local Contacts-----------------------------------


    }
);

function ldLoading() {
    $.mobile.showPageLoadingMsg("a", "Loading...", true);
}

function refreshBalance() {
    connectorObject.getBalance(updateCreditsGel);
}

function grabContacts() {
    connectorObject.getContacts(function (a) {
            contactsRemote = [];
            for (var i = 0, length = a.length; i < length; i++) {
                var aContact = a[i];
                var normContact = {};
                normContact.name = "";
                normContact.number = [];
                for (var j = 1, len = aContact.length; j < len; j++) {
                    var aValue = aContact[j];
                    if (j == 4) {
                        normContact.number.push(aValue);
                        break;
                    } else {
                        normContact.name = normContact.name + aValue + " ";
                    }
                }
                normContact.name = normContact.name.trim();
                contactsRemote.push(normContact);
            }
            sortContacts(contactsRemote);
        }
    )
}

function refreshCatpcha(){
	connectorObject.getCaptchaUrl(updateCaptcha);

}

function grabHistory(page) {
    connectorObject.getHistory(function (historys) {
        try {
            mHistory = historys;
            generateHistory();
            normalizeHistory();
            resendListener();
        } catch (e) {
            alert(e);
        }
        $.mobile.hidePageLoadingMsg();
    }, page);
}

function mergeContacts() {
    if (!contactsMerged) {
        contactsMerged = [];
        for (var j = 0, length = contactsRemote.length; j < length; j++) {
            contactsMerged.push(contactsRemote[j]);
        }
        for (var i = 0, len = contactsLocal.length; i < len; i++) {
            contactsMerged.push(contactsLocal[i]);
        }
        var ld = {};
        ld.name = "Luka Dodelia";
        ld.number = [];
        ld.number.push("599564266");
        contactsMerged.push(ld);
    }
    return contactsMerged;
}

function generateContacts(contacts, merge) {
    if (merge) {
        contacts = mergeContacts();
    }
    sortContacts(contacts);
    //$(".contacts-view").html('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >');
    var html = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >';
    var firtChar = '';
    for (var i = 0, length = contacts.length; i < length; i++) {
        try {
            var aContact = contacts[i];
            if (aContact.name != null && aContact.name[0].toUpperCase() != firtChar) {
                firtChar = aContact.name[0].toUpperCase();
                //$(".contacts-view > [data-role='listview']").append('<li data-role="list-divider">' + firtChar + '</li>');
                html += '<li data-role="list-divider">' + firtChar + '</li>';
            }
            if (aContact.number != null) {
                if (aContact.number.length > 1) {
                    var appendContact = '<li>' +
                        '<select name="select-choice-min" class="numberSelector"  data-native-menu="true" data-mini="true">';
                    appendContact += '<option>' + aContact.name + '</option>';
                    for (var l = 0; l < aContact.number.length; l++) {
                        appendContact += '<option value="' + aContact.number[l].replace(/[^\+\d]/g, "") + '">'
                            + aContact.number[l] + '</option>';
                    }
                    appendContact += '</select>' +
                        '</li>';
                    html += appendContact;
                } else {
                    html += '<li><a href="#" id="' + aContact.number[0].replace(/[^\+\d]/g, "") +
                        '" class="contactName">' + aContact.name + '</a></li>';
                }
            }
        } catch (e) {
        }
    }
    html += '</ul>';


    $(".contacts-choose").css("display", "none");
    $(".contacts-view").css("display", "block");
    $(".contacts-view").html(html);
    //$(".contacts-view").append('</ul>');
    $(".contacts-view").trigger('create');
    contactsListener();
    $.mobile.hidePageLoadingMsg();

}

function generateHistory() {
    var previousDate;
    var groupCounter = 0;
    var workingElement = $(".content-history > .ui-listview");
    var html = "";

    for (var i = 0, length = mHistory.length; i < length; i++) {
        var aHistory = mHistory[i];
        if (previousDate == undefined || aHistory.date.getDate() != previousDate.getDate()) {
            previousDate = aHistory.date;
            var group = previousDate.toDateString().split(" ");
            var tmpGroup = group[0] + "," + group[1] + " " + group[2] + ", " + group[3];
            //workingElement.append(appendHeader);
            html += '<li data-role="list-divider">' + tmpGroup +
                '<span class="ui-li-count">' + groupCounter + "</span></li>";
            groupCounter = 0;
        }
        groupCounter++;
        var appendMsg;
        if (aHistory.status == 'მიწოდებულია') {
            appendMsg = '<li><h3 style="color: blue;">' + searchNumber(aHistory.number) + '</h3>' +
                '<span>' + $('<div/>').text(aHistory.msgText).html() + '</span>' +
                '<p class="ui-li-aside">' +
                '<strong>' + aHistory.date.getHours().toString() + ":" + aHistory.date.getMinutes().toString() +
                ":" + aHistory.date.getSeconds().toString() + '</strong>' +
                '</p></li>';
        } else {
            appendMsg = '<li><a href="#" class="resendableMessage" id="' + aHistory.msgID + '">' +
                '<h3 style="color: blue;">' + searchNumber(aHistory.number) + '</h3>' +
                '<span>' + aHistory.msgText + '</span>' +
                '<p class="ui-li-aside">' +
                '<strong>' + aHistory.date.getHours().toString() + ":" + aHistory.date.getMinutes().toString() +
                ":" + aHistory.date.getSeconds().toString() + '</strong>' +
                '</p></a></li>';
        }
        //workingElement.append(appendMsg);
        html += appendMsg;

    }
    workingElement.html(html);
    workingElement.listview("refresh");
}

function searchNumber(num) {
    var contacts = mergeContacts();
    for (var i = 0, length = contacts.length; i < length; i++) {
        var aContact = contacts[i];
        for (var j = 0; j < aContact.number.length; j++) {
            if (aContact.number[j].replace(/[^\+\d]/g, "").indexOf(num.replace(/[^\+\d]/g, "")) > -1) {
                return aContact.name;
            }
        }
    }
    return num;
}

function normalizeHistory() {
    var dividers = $(".content-history > .ui-listview > li[data-role='list-divider']");

    for (var i = 0, len = dividers.length; i < len; i++) {
        var count = $(".content-history > .ui-listview > li").index(dividers[i]);
        if (i + 1 != len) {
            count = $(".content-history > .ui-listview > li").index(dividers[i + 1]) - 1 - count;
        } else {
            count = $(".content-history > .ui-listview > li").length - 1 - count;
        }
        $(dividers[i]).children(".ui-li-count").text(count);
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

function contactsListener() {
    $("a.contactName").click(function (e) {
        e.preventDefault();
        var num = $(this).attr("id");
        if (!$("#recipients").val())
            $("#recipients").val(num);
        else
            $("#recipients").val($("#recipients").val() + "," + num);
        $(this).parents('li').remove();
    });
    $(".numberSelector").bind("change", function (event, ui) {
        var number = $(this).find(":selected").val()
        if (!$("#recipients").val())
            $("#recipients").val(number);
        else
            $("#recipients").val($("#recipients").val() + "," + number);
        $(this).parents('li').remove();
    });
}

function resendListener() {
    $("a.resendableMessage").click(function (e) {
        e.preventDefault();
        resend($(this).attr("id"));
    });
}

function resend(msgID) {
    var histRec = historyByID(msgID);
    navigator.notification.confirm(
        histRec.msgText, // message
        function (button) {
            if (button == 2) {
                $("#recipients").val(histRec.number);
                $("#msgBody").val(histRec.msgText);
                $(".contacts-view").html(" ");
                //class="ui-btn-active"
                $("#navbarHistory").removeClass("ui-btn-active");
                $("#navbarSms").addClass("ui-btn-active");
                $(".content-sms").css("display", "block");
                $(".content-history").css("display", "none");
                $(".content-contacts").css("display", "none");
            }
        }
        , // callback to invoke with index of button pressed
        'Recipient: ' + histRec.number, // title
        'Cancel,Resend'          // buttonLabels
    );
}

function updateCreditsGel(credits, gel) {
    $("#gel").text(gel);
    $("#credit").text(credits);
}

function updateCaptcha(captcha) {
		$("#verif_img").attr("src", captcha);
}

function getRandTransition() {
    return transitions[getRandomArbitrary(0, transitions.length)];
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function historyByID(id) {
    for (var i = 0, length = mHistory.length; i < length; i++) {
        if (mHistory[i].msgID == id) {
            return mHistory[i];
        }
    }
    return undefined;
}

function sortContacts(contacts) {
    contacts.sort(function (a, b) {
        if (a.name && b.name && a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        else if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        else
            return 0;
    });
}