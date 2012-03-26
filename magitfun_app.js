$(function () {
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

        $("#login").click(function (e) {
            e.preventDefault();
            var user = $("#username").val();
            var password = $("#password").val();
            connectorObject = new Magitfun(user, password);
            connectorObject.login(function (a) {
                if (a == "succses") {
                    $.mobile.changePage($("#pageHome"), {transition:getRandTransition()});
                    refreshBalance();
                    grabHistory();
                    grabContacts();
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
                connectorObject.sendSms(recipient, msgbody, function (a) {
                    $("#recipients").val("");
                    $("#msgBody").val("");
                    refreshBalance();
                    updateHistory();
                    //connectorObject.getBalance(updateCreditsGel);
                })
            } else {
                navigator.notification.alert("You exsided message character limit", null, "MissBehaive", "I'm Sorry!");
            }
        });

        $("#msgBody").bind("change", onMsgChange);

        $("#logout").click(function (e) {
            e.preventDefault();
            var transition = getRandTransition();
            $.mobile.changePage($("#pageLogin"), {transition:transition})
        });
        $("#about").click(function (e) {
            e.preventDefault();
            var transition = getRandTransition();
            $.mobile.changePage($("#pageHome"), {transition:transition});
            $("#pageHome").trigger('create');
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

            $(".contacts-choose").css("display", "block");
            $(".contacts-view").css("display", "none");
        });

        $("#allContacts").click(function (e) {
            e.preventDefault();
            generateContacts("", true);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#localContacts").click(function (e) {
            e.preventDefault();
            generateContacts(contactsLocal);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#providerContacts").click(function (e) {
            e.preventDefault();
            generateContacts(contactsRemote);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });

        //----------------------------Local Contacts-----------------------------------

        function onSuccess(contacts) {
            for (var i = 0; i < contacts.length; i++) {
                var deviceContact = contacts[i];
                var aContact = new Object();
                aContact.name = deviceContact.name.formatted;
                aContact.number = new Object();
                for (var j = 0; j < deviceContact.phoneNumbers.length; j++) {
                    var type = deviceContact.phoneNumbers[j].type;
                    alert(type);
                    aContact.number[type] = deviceContact.phoneNumbers[j].value;
                    alert(aContact.number);
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

        //----------------------------Local Contacts-----------------------------------

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
                        normContact.number = -19;
                        for (var j = 1; j < aContact.length; j++) {
                            var aValue = aContact[j];
                            if (j == 4) {
                                var number = new Object();
                                number.provider = aValue;
                                normContact.number = number;
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

        function updateHistory() {
            connectorObject.updateHistory(function (newHistory) {
                var i;
                for (i = 0; i < history.length; i++) {
                    if (history[i].date = newHistory[i].date) {
                        break;
                    }
                }
                newHistory.slice(0, i);
                generateHistory(newHistory);
            });
        }

        function grabHistory() {
            connectorObject.getHistory(function (historys) {
                history = historys;
                generateHistory(history);
                normalizeHistory();
            });
        }

        function mergeContacts() {
            var contacts = new Array();
            for (var i = 0; i < contactsLocal.length; i++) {
                contacts.push(contactsLocal[i]);
            }
            for (var j = 0; i < contactsRemote.length.length; j++) {
                contacts.push(contactsLocal[j]);
            }
            sortContacts(contacts);
            return contacts;
        }

        function generateContacts(contacts, merge) {
            if (merge) {
                contacts = mergeContacts();
            }
            $(".contacts-view").append('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d"data-theme="d" data-divider-theme="d">');
            var firtChar = '';
            for (var i = 0; i < contacts.length; i++) {
                var aContact = contacts[i];
                if (aContact.name[0] != firtChar) {
                    firtChar = aContact.name[0];
                    $(".contacts-view").append('<li data-role="list-divider">' + firtChar + '</li>');
                }
                $(".contacts-view").append('<li><a href="#">' + aContact.name + '</a></li>');
            }
            $(".contacts-view").append("</ul>");
            $(".contacts-view").trigger('create');
        }

        function generateHistory(hist, update) {
            var group;
            var groupCounter = 0;
            if (!update) {
                $(".ui-listview").html("");
            }
            for (var i = 0; i < hist.length; i++) {
                var aHistory = history[i];
                if (aHistory.date.toDateString().split(" ").join() != group) {
                    group = aHistory.date.toDateString().split(" ");
                    var tmpGroup = group[0] + "," + group[1] + " " + group[2] + "," + group[3];
                    var appendHeader = '<li data-role="list-divider">' + tmpGroup +
                        '<span class="ui-li-count">' + groupCounter + "</span></li>";
                    $(".ui-listview").append(appendHeader);
                    groupCounter = 0;
                } else {
                    groupCounter++;
                    var appendMsg = '<h3>' + aHistory.number + '</h3>' +
                        '<p><strong>' + aHistory.number + '</strong></p>' +
                        '<p class="ui-li-aside"><strong>' + aHistory.date.getHours() + ":" + aHistory.date.getMinutes() + ":" + aHistory.date.getSeconds() + '</strong></p>';
                    if (!update) {
                        $(".ui-listview").append(appendMsg);
                    } else {
                        $(".ui-listview").prepend(appendMsg);
                    }
                }
            }
            $(".ui-listview").listview("refresh");
        }

        function normalizeHistory() {
            var counters = $(".counterli > span");
            for (var i = 0; i < counters.length; i++) {
                if (i + 1 != counters.length) {
                    $(counters[i]).text($($(".counterli > span")[i + 1]).text())
                }
            }
        }

        function contactByNumber(number) {
            var contacts = mergeContacts();
            for (var i = 0; i < contacts.length; i++) {
                var aContact = contacts[i];
                console.log(aContact);
                console.log("\n");
                console.log(number);
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

        function sortContacts(contacts) {
            contacts.sort(function (a, b) {
                if (a.name > b.name)
                    return 1;
                else if (a.name < b.name)
                    return -1;
                else
                    return 0;
            });
        }
    }
);