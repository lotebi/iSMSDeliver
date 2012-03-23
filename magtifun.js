/**
 * Created by JetBrains WebStorm.
 * User: lukasa
 * Date: 3/23/12
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */

function magitfun(user, password) {
    var cookie;
    var credits;
    var gel;
    var history;

    this.login = function (succ) {
        var jqxhr = $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/index.php?page=11&lang=ge',
            data:{act:1, user:user, password:password},
            cache:false,
            crossDomain:true,
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', '');
            },
            success:function (data) {
                console.log(jqxhr.getAllResponseHeaders());
                cookie = jqxhr.getResponseHeader('Set-Cookie').split(';')[0];
                verifyLogin(succ);
                parseCreditsAndGel(data);
            }
        });
    };

    this.sendSms = function (recipients, msgBody, succ) {
        var recipient = recipients.split(',');
        for (var i = 0; i < recipient.length; i++) {
            $.ajax({
                type:"POST",
                url:'http://www.magtifun.ge/scripts/sms_send.php',
                data:{recipients:recipient[i], message_body:msgBody},
                beforeSend:function (xhr) {
                    xhr.setRequestHeader('Cookie', cookie);
                },
                success:function (data) {
                    succ(data);
                }
            });
        }
    };

    this.getContacts = function (succ) {
        $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/index.php?page=5&lang=ge',
            data:{act:1, user:user, password:password},
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', cookie);
            },

            success:function (data) {
                var regex = /Array\(.+?\)/g;
                var contacts = data.match(regex);

                if (contacts) {
                    for (var i = 0; i < contacts.length; i++) {
                        var s = contacts[i].match(/\("(.*?)"\)/);
                        contacts[i] = s[1].split(/"\s*,\s*"/);
                    }
                }
                succ(contacts);
            }

        });
    };

    this.getBalance = function (succ) {
        $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/index.php?page=1&lang=ge',
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', cookie);
            },
            success:function (data) {
                parseCreditsAndGel(data);
                succ(credits, gel);
            }
        });
    };

    this.getHistory = function (succ) {
        $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/index.php?page=10&lang=ge',
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', cookie);
            },
            success:function (data) {
                parseHistory(data);
                succ(history);
            }
        });
    };

    var parseHistory = function (data) {
        history = new Array();
        var children = $($(data).find("#message_list").children());
        for (var i = 0; i < children.length; i++) {
            var rec = {};
            rec.msgID = $($(data).find("#message_list").children())[i].id
            rec.msgText = children[i].find(".msg_text").html();

            children[i].find(".message_list_recipient > .red").each(function (index, element) {
                if ($(element).text().replace(/[^\+\d]/g, "")) {
                    rec.number = $(element).text().replace(/[^\+\d]/g, "");
                } else {
                    children[i].find(".message_list_recipient > .gray").each(function (index, element) {
                        if ($(element).text().replace(/[^\+\d]/g, "")) {
                            rec.number = $(element).text().replace(/[^\+\d]/g, "");
                            if (index == children[i].find(".message_list_recipient > .gray").length) {
                                rec.status = children[i].find(".message_list_recipient > .gray")[index - 1];
                            } else {
                                rec.status = children[i].find(".message_list_recipient > .gray")[index + 1];
                            }
                        }
                    })
                }
            });
            rec.date = new Date();
            var monthYear = children[i].find(".msg_date").find(".date_month").text().split("<br>");
            var dateTime = children[i].find(".date_time").text().split(":");
            rec.date.day = children[i].find(".msg_date").find(".xlarge").text();
            rec.date.month = monthYear[0];
            rec.date.year = monthYear[1];
            rec.date.houre = dateTime[0];
            rec.date.minutes = dateTime[1];
            rec.date.seconds = dateTime[2];
            history.push(rec);
        }
    };

    var parseCreditsAndGel = function (data) {
        //credits = $(data).find(".dark").filter(".english").filter("span").filter(".xxlarge").html();
        $(document).find(".dark").filter(".english").filter("span").each(function (index, element) {
            var spans = $(element);
            if (spans.hasClass("xxlarge")) {
                credits = spans.html();
            } else {
                gel = spans.html();
            }
        })
    };

    var verifyLogin = function (succ) {
        $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/scripts/profile_check.php',
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', cookie);
            },
            success:function (data) {
                succ(data);
            }
        });
    };

}