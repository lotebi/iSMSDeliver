var connectorObject;
var history;
var contactsRemote;
var contactsLocal = new Array();
var transitions = new Array();
transitions.push("pop");
transitions.push("flip");
transitions.push("slide");
transitions.push("slideup");
transitions.push("slidedown");

$(function () {
        $("#login").click(function (e) {
            e.preventDefault();
            $.mobile.showPageLoadingMsg();
            var user = $("#username").val();
            var password = $("#password").val();
            connectorObject = new Magitfun(user, password);
            connectorObject.login(function (a) {
                if (a == "succses") {
                    $.mobile.changePage($("#pageHome"), {transition:getRandTransition()});
                    refreshBalance();
                    grabContacts();
                    grabHistory(2);
                } else {
                    navigator.notification.vibrate(250);
                    navigator.notification.alert("Wrong Username or Password", null, "MissBehaive", "I'm Sorry!");
                }
            })
        });

        $("#refresh").click(function (e) {
            e.preventDefault();
            $.mobile.showPageLoadingMsg();
            refreshBalance();
            grabHistory(2);
        });

        $("#send").click(function (e) {
            e.preventDefault();
            $.mobile.showPageLoadingMsg();
            if ($("#maxMessages").css("visibility") == "hidden") {
                var recipient = $("#recipients").val();
                var msgbody = $("#msgBody").val();
                connectorObject.sendSms(recipient, msgbody, function (a) {
                    $("#recipients").val("");
                    $("#msgBody").val("");
                    refreshBalance();
                    grabHistory(2);
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
            navigator.notification.alert("Ra About ?? Button Dainaxe da daclicke?", null, "Kai roja Xar?", "Xo xo gavedii");
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
            $.mobile.showPageLoadingMsg();
            generateContacts("", true);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#localContacts").click(function (e) {
            e.preventDefault();
            $.mobile.showPageLoadingMsg();
            generateContacts(contactsLocal, false);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#providerContacts").click(function (e) {
            e.preventDefault();
            $.mobile.showPageLoadingMsg();
            generateContacts(contactsRemote, false);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });

        //----------------------------Local Contacts-----------------------------------
        document.addEventListener("deviceready", function () {
            $.mobile.touchOverflowEnabled = true;
            function onSuccess(contacts) {
                for (var i = 0; i < contacts.length; i++) {
                    var deviceContact = contacts[i];
                    var aContact = new Object();
                    aContact.name = deviceContact.name.formatted;
                    aContact.number = new Array();
                    for (var j = 0; j < deviceContact.phoneNumbers.length; j++) {
                        aContact.number.push(deviceContact.phoneNumbers[j].value);
                    }
                    contactsLocal.push(aContact);
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

function refreshBalance() {
    connectorObject.getBalance(updateCreditsGel);
}

function grabContacts() {
    connectorObject.getContacts(function (a) {
            contactsRemote = new Array();
            for (var i = 0; i < a.length; i++) {
                var aContact = a[i];
                var normContact = new Object();
                normContact.name = new String();
                normContact.number = new Array();
                for (var j = 1; j < aContact.length; j++) {
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

function grabHistory(page) {
    connectorObject.getHistory(function (historys) {
        history = historys;
        generateHistory();
        normalizeHistory();
        resendListener();
        $.mobile.hidePageLoadingMsg();
    }, page);
}

function mergeContacts() {
    var contacts = new Array();
    for (var j = 0; j < contactsRemote.length; j++) {
        contacts.push(contactsRemote[j]);
    }
    for (var i = 0; i < contactsLocal.length; i++) {
        contacts.push(contactsLocal[i]);
    }
    return contacts;
}

function generateContacts(contacts, merge) {
    if (merge) {
        contacts = mergeContacts();
    }
    sortContacts(contacts);
    $(".contacts-view").html('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >');
    var firtChar = '';
    for (var i = 0; i < contacts.length; i++) {
        var aContact = contacts[i];
        if (aContact.name[0].toUpperCase() != firtChar) {
            firtChar = aContact.name[0].toUpperCase();
            $(".contacts-view > [data-role='listview']").append('<li data-role="list-divider">' + firtChar + '</li>');
        }
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
            $(".contacts-view > [data-role='listview']").append(appendContact);

        } else {
            $(".contacts-view > [data-role='listview']").append('<li><a href="#" id="' + aContact.number[0].replace(/[^\+\d]/g, "") +
                '" class="contactName">' + aContact.name + '</a></li>');
        }
    }
    $(".contacts-view").append('</ul>');
    $(".contacts-view").trigger('create');
    contactsListener();
    $.mobile.hidePageLoadingMsg();
}

function generateHistory() {
    var previousDate;
    var groupCounter = 0;
    var workingElement = $(".content-history > .ui-listview");
    workingElement.html("");
    for (var i = 0; i < history.length; i++) {
        var aHistory = history[i];
        if (previousDate == undefined || aHistory.date.getDate() != previousDate.getDate()) {
            previousDate = aHistory.date;
            var group = previousDate.toDateString().split(" ");
            var tmpGroup = group[0] + "," + group[1] + " " + group[2] + ", " + group[3];
            var appendHeader = '<li data-role="list-divider">' + tmpGroup +
                '<span class="ui-li-count">' + groupCounter + "</span></li>";
            workingElement.append(appendHeader);
            groupCounter = 0;
        }
        groupCounter++;
        var appendMsg;
        if (aHistory.status == 'მიწოდებულია') {
            appendMsg = '<li><h3 style="color: blue;">' + searchNumber(aHistory.number) + '</h3>' +
                '<span>' + aHistory.msgText + '</span>' +
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
        workingElement.append(appendMsg);

    }
    workingElement.listview("refresh");
    $.mobile.hidePageLoadingMsg();

}

function searchNumber(num) {
    if (num.indexOf('599564266') > -1)
        return "Luka Dodelia";
    var contacts = mergeContacts();
    for (var i = 0; i < contacts.length; i++) {
        var aContact = contacts[i];
        for (var j = 0; j < aContact.number.length; j++) {
            if (aContact.number[j].indexOf(num) > -1) {
                return aContact.name;
            }
        }
    }
    return num;
}

function normalizeHistory() {
    var counters = $(".ui-li-count");
    for (var i = 0; i < counters.length; i++) {
        if (i + 1 != counters.length) {
            $(counters[i]).text($(counters[i + 1]).text());
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
    $("#credit").text(credits);
    $("#gel").text(gel);
}

function getRandTransition() {
    return transitions[getRandomArbitrary(0, transitions.length)];
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function historyByID(id) {
    for (var i = 0; i < history.length; i++) {
        if (history[i].msgID == id) {
            return history[i];
        }
    }
    return undefined;
}

function sortContacts(contacts) {
    contacts.sort(function (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        else if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        else
            return 0;
    });
}