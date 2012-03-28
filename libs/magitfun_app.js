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
            refreshBalance();
            updateHistory();
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
                    grabHistory(2);
                    //connectorObject.getBalance(updateCreditsGel);
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
            $.mobile.changePage($("#pageHome"), {transition:transition});
            $("#pageHome").trigger('create');
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
            generateContacts("", true);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#localContacts").click(function (e) {
            e.preventDefault();
            generateContacts(contactsLocal, false);
            $(".contacts-choose").css("display", "none");
            $(".contacts-view").css("display", "block");
        });
        $("#providerContacts").click(function (e) {
            e.preventDefault();
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
                    aContact.number = new Object();
                    for (var j = 0; j < deviceContact.phoneNumbers.length; j++) {
                        var type = deviceContact.phoneNumbers[j].type;
                        aContact.number[type] = deviceContact.phoneNumbers[j].value;
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

        function grabHistory(page) {
            connectorObject.getHistory(function (historys) {
                history = historys;
                generateHistory();
                normalizeHistory();
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
                $(".contacts-view > [data-role='listview']").append('<li><a href="#">' + aContact.name + '</a></li>');
            }
            $(".contacts-view").append('</ul>');
            $(".contacts-view").trigger('create');
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
                var appendMsg = '<li><h3 style="color: blue;">' + searchNumber(aHistory.number) + '</h3>' +
                    '<span>' + aHistory.msgText + '</span>' +
                    '<p class="ui-li-aside"><strong>' + aHistory.date.getHours() + ":" + aHistory.date.getMinutes() +
                    ":" + aHistory.date.getSeconds() + '</strong></p></li>';
                workingElement.append(appendMsg);

            }
            workingElement.listview("refresh");
        }

        function searchNumber(num){
            var contacts = mergeContacts();
            for(var i = 0;i <contacts;i++) {
                var aContact = contacts[i];
                console.log(aContact);
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
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                else if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                else
                    return 0;
            });
        }
    }
);