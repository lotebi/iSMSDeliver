function sortHistory(history) {
    history.sort(function (a, b) {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
    });
}
/**
 * Created by JetBrains WebStorm.
 * User: lukasa
 * Date: 3/23/12
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */

function Magitfun() {
    var cookie;
    var user;
    var password;
    var credits;
    var gel;
    var history;

    if (arguments.length == 2) {
        user = arguments[0];
        password = arguments[1];

    } else {
        cookie = arguments[0];

    }
    this.getCookie = function () {
        return cookie;
    };

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
                //console.log(jqxhr.getAllResponseHeaders());
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

    this.getHistory = function (succ, page) {
        $.ajax({
            type:"POST",
            url:'http://www.magtifun.ge/index.php?page=10&lang=ge',
            beforeSend:function (xhr) {
                xhr.setRequestHeader('Cookie', cookie);
            },
            success:function (data) {
                var pagesCount = $(data).find(".page_number,active,red,round_border,english").length - 1;
                if (page > -1) {
                    pagesCount = page;
                }
                history = new Array();
                parseHistoryPerPage(data);
                parseHistory(succ, 2, pagesCount + 1);
            }
        });
    };

    var parseHistory = function (succ, currIndex, lastIndex) {
        if (currIndex >= lastIndex) {
            sortHistory(history);
            succ(history);
        } else {
            $.ajax({
                type:"POST",
                url:'http://www.magtifun.ge/index.php?page=10&lang=ge',
                data:{cur_page:currIndex, fav_page:0},
                beforeSend:function (xhr) {
                    xhr.setRequestHeader('Cookie', cookie);
                },
                success:function (data) {
                    parseHistoryPerPage(data);
                    parseHistory(succ, ++currIndex, lastIndex);
                }
            });
        }
    };
    var parseHistoryPerPage = function (data) {
        var children = $(data).find("#message_list").children();
        for (var i = 0; i < children.length; i++) {
            var child = $(children[i]);
            var rec = {};
            rec.msgID = $($(data).find("#message_list").children())[i].id
            rec.msgText = child.find(".msg_text").text();

            child.find(".message_list_recipient > .red").each(function (index, element) {
                if ($(element).text().replace(/[^\+\d]/g, "")) {
                    rec.number = $(element).text().replace(/[^\+\d]/g, "");
                }
            });
            child.find(".message_list_recipient > .gray").each(function (index, element) {
                if ($(element).text().replace(/[^\+\d]/g, "")) {
                    rec.number = $(element).text().replace(/[^\+\d]/g, "");
                } else {
                    rec.status = $(element).text();
                    /*if (index == child.find(".message_list_recipient > .gray").length) {
                        rec.status = $(child.find(".message_list_recipient > .gray")[index - 1]).text();
                    } else {
                        rec.status = $(child.find(".message_list_recipient > .gray")[index + 1]).text();
                    }*/
                }

            });
            var monthYear = child.find(".msg_date").find(".date_month").html().split("<br>");
            var dateTime = child.find(".date_time").text().split(":");
            rec.date = new Date(monthYear[1], getMonth(monthYear[0]), child.find(".msg_date").find(".xlarge").text(), dateTime[0], dateTime[1], dateTime[2]);
            history.push(rec);
        }
    };

    var getMonth = function (month) {
        if (month == 'ინვ') {
            return 0;
        } else if (month == 'თებ') {
            return 1;
        } else if (month == 'მარ') {
            return 2;
        } else if (month == 'აპრ') {
            return 3;
        } else if (month == 'მაი') {
            return 4;
        } else if (month == 'ივნ') {
            return 5;
        } else if (month == 'ივლ') {
            return 6;
        } else if (month == 'აგვ') {
            return 7;
        } else if (month == 'სექ') {
            return 8;
        } else if (month == 'ოქტ') {
            return 9;
        } else if (month == 'ნოე') {
            return 10;
        } else if (month == 'დეკ') {
            return 11;
        }
    };

    var parseCreditsAndGel = function (data) {
        //credits = $(data).find(".dark").filter(".english").filter("span").filter(".xxlarge").text();
        $(data).find(".dark").filter(".english").filter("span").each(function (index, element) {
            var spans = $(element);
            if (spans.hasClass("xxlarge")) {
                credits = spans.text();
            } else {
                gel = spans.text();
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
                if (data != "not_logged_in") {
                    succ("succses");
                } else {
                    succ(data);
                }
            }
        });
    };

}