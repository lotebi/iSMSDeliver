function sortHistory(a){a.sort(function(a,d){return a.date>d.date?-1:a.date<d.date?1:0})}
function Magitfun(){var a,b,d,e,c,f;2==arguments.length?(b=arguments[0],d=arguments[1]):a=arguments[0];this.getCookie=function(){return a};this.login=function(c){var k=$.ajax({type:"POST",url:"http://www.magtifun.ge/index.php?page=11&lang=ge",data:{act:1,user:b,password:d},cache:false,crossDomain:true,beforeSend:function(a){a.setRequestHeader("Cookie","")},success:function(b){a=k.getResponseHeader("Set-Cookie").split(";")[0];l(c);i(b)}})};this.sendSms=function(b,c,d){for(var b=b.split(","),e=0;e<
b.length;e++)$.ajax({type:"POST",url:"http://www.magtifun.ge/scripts/sms_send.php",data:{recipients:b[e],message_body:c},beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){d(a)}})};this.getContacts=function(b){$.ajax({type:"POST",url:"http://www.magtifun.ge/index.php?page=5&lang=ge",beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){if(a=a.match(/Array\(.+?\)/g))for(var c=0;c<a.length;c++){var d=a[c].match(/\("(.*?)"\)/);a[c]=d[1].split(/"\s*,\s*"/)}b(a)}})};
this.getBalance=function(b){$.ajax({type:"POST",url:"http://www.magtifun.ge/index.php?page=1&lang=ge",beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){i(a);b(e,c)}})};this.getHistory=function(b,c){$.ajax({type:"POST",url:"http://www.magtifun.ge/index.php?page=10&lang=ge",beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){var d=$(a).find(".page_number,active,red,round_border,english").length-1;c>-1&&(d=c);f=[];j(a);g(b,2,d+1)}})};var g=function(b,c,
d){if(c>=d){sortHistory(f);b(f)}else $.ajax({type:"POST",url:"http://www.magtifun.ge/index.php?page=10&lang=ge",data:{cur_page:c,fav_page:0},beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){j(a);g(b,++c,d)}})},j=function(a){for(var b=$(a).find("#message_list").children(),c=0;c<b.length;c++){var d=$(b[c]),e={};e.msgID=$($(a).find("#message_list").children())[c].id;e.msgText=d.find(".msg_text").text();d.find(".message_list_recipient > .red").each(function(a,b){if($(b).text().replace(/[^\+\d]/g,
""))e.number=$(b).text().replace(/[^\+\d]/g,"")});d.find(".message_list_recipient > .gray").each(function(a,b){$(b).text().replace(/[^\+\d]/g,"")?e.number=$(b).text().replace(/[^\+\d]/g,""):e.status=$(b).text()});var g=d.find(".msg_date").find(".date_month").html().split("<br>"),h=d.find(".date_time").text().split(":");e.date=new Date(g[1],m(g[0]),d.find(".msg_date").find(".xlarge").text(),h[0],h[1],h[2]);f.push(e)}},m=function(a){if(a=="\u10d8\u10dc\u10d5")return 0;if(a=="\u10d7\u10d4\u10d1")return 1;
if(a=="\u10db\u10d0\u10e0")return 2;if(a=="\u10d0\u10de\u10e0")return 3;if(a=="\u10db\u10d0\u10d8")return 4;if(a=="\u10d8\u10d5\u10dc")return 5;if(a=="\u10d8\u10d5\u10da")return 6;if(a=="\u10d0\u10d2\u10d5")return 7;if(a=="\u10e1\u10d4\u10e5")return 8;if(a=="\u10dd\u10e5\u10e2")return 9;if(a=="\u10dc\u10dd\u10d4")return 10;if(a=="\u10d3\u10d4\u10d9")return 11},i=function(a){$(a).find(".dark").filter(".english").filter("span").each(function(a,b){var d=$(b);d.hasClass("xxlarge")?e=d.text():c=d.text()})},
l=function(b){$.ajax({type:"POST",url:"http://www.magtifun.ge/scripts/profile_check.php",beforeSend:function(b){b.setRequestHeader("Cookie",a)},success:function(a){a!="not_logged_in"?b("succses"):b(a)}})}}var connectorObject,history,contactsRemote,contactsLocal=[],contactsMerged,transitions=[];transitions.push("pop");transitions.push("flip");transitions.push("slide");transitions.push("slideup");transitions.push("slidedown");
$(function(){$("#login").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();var a=$("#username").val(),b=$("#password").val();connectorObject=new Magitfun(a,b);connectorObject.login(function(a){"succses"==a?($.mobile.changePage($("#pageHome"),{transition:getRandTransition()}),refreshBalance(),grabContacts(),grabHistory(2)):(navigator.notification.vibrate(250),navigator.notification.alert("Wrong Username or Password",null,"MissBehaive","I'm Sorry!"))})});$("#refresh").click(function(a){a.preventDefault();
$.mobile.showPageLoadingMsg();refreshBalance();grabHistory(2)});$("#send").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();if("hidden"==$("#maxMessages").css("visibility")){var a=$("#recipients").val(),b=$("#msgBody").val();connectorObject.sendSms(a,b,function(){$("#recipients").val("");$("#msgBody").val("");refreshBalance();grabHistory(2)})}else navigator.notification.alert("You exsided message character limit",null,"MissBehaive","I'm Sorry!")});$("#msgBody").keyup(onMsgChange);
$("#msgBody").keydown(onMsgChange);$("#msgBody").bind("change",onMsgChange);$("#logout").click(function(a){a.preventDefault();a=getRandTransition();$.mobile.changePage($("#pageLogin"),{transition:a})});$("#about").click(function(a){a.preventDefault();a=getRandTransition();$.mobile.changePage($("#pageHome"),{transition:a});$("#pageHome").trigger("create")});$("#navbarSms").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-sms").css("display","block");$(".content-history").css("display",
"none");$(".content-contacts").css("display","none")});$("#navbarHistory").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-history").css("display","block");$(".content-sms").css("display","none");$(".content-contacts").css("display","none")});$("#navbarContacts").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-contacts").css("display","block");$(".content-sms").css("display","none");$(".content-history").css("display","none");$(".contacts-choose").css("display",
"block");$(".contacts-view").css("display","none")});$("#allContacts").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();generateContacts("",!0);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});$("#localContacts").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();generateContacts(contactsLocal,!1);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});$("#providerContacts").click(function(a){a.preventDefault();
$.mobile.showPageLoadingMsg();generateContacts(contactsRemote,!1);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});document.addEventListener("deviceready",function(){$.mobile.touchOverflowEnabled=!0;var a=new ContactFindOptions;a.filter="";a.multiple=!0;filter=["displayName","name","phoneNumbers"];navigator.contacts.find(filter,function(a){for(var d=0;d<a.length;d++){var e=a[d],c={};c.name=e.name.formatted;c.number=[];for(var f=0;f<e.phoneNumbers.length;f++)c.number.push(e.phoneNumbers[f].value);
contactsLocal.push(c)}sortContacts(contactsLocal)},function(){navigator.notification.alert("Something Bad Happened About Contacts\nMaybe You Should Start Again",null,"Tragedy","understood")},a)},!1)});function refreshBalance(){connectorObject.getBalance(updateCreditsGel)}
function grabContacts(){connectorObject.getContacts(function(a){contactsRemote=[];for(var b=0;b<a.length;b++){var d=a[b],e={};e.name=new String;e.number=[];for(var c=1;c<d.length;c++){var f=d[c];if(4==c){e.number.push(f);break}else e.name=e.name+f+" "}e.name=e.name.trim();contactsRemote.push(e)}sortContacts(contactsRemote)})}function grabHistory(a){connectorObject.getHistory(function(a){history=a;generateHistory();normalizeHistory();resendListener();$.mobile.hidePageLoadingMsg()},a)}
function mergeContacts(){if(!a){for(var a=[],b=0;b<contactsRemote.length;b++)a.push(contactsRemote[b]);for(b=0;b<contactsLocal.length;b++)a.push(contactsLocal[b])}return a}
function generateContacts(a,b){b&&(a=mergeContacts());sortContacts(a);$(".contacts-view").html('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >');for(var d="",e=0;e<a.length;e++){var c=a[e];c.name[0].toUpperCase()!=d&&(d=c.name[0].toUpperCase(),$(".contacts-view > [data-role='listview']").append('<li data-role="list-divider">'+d+"</li>"));if(1<c.number.length){for(var f='<li><select name="select-choice-min" class="numberSelector"  data-native-menu="true" data-mini="true">',
f=f+("<option>"+c.name+"</option>"),g=0;g<c.number.length;g++)f+='<option value="'+c.number[g].replace(/[^\+\d]/g,"")+'">'+c.number[g]+"</option>";f+="</select></li>";$(".contacts-view > [data-role='listview']").append(f)}else $(".contacts-view > [data-role='listview']").append('<li><a href="#" id="'+c.number[0]+'" class="contactName">'+c.name+"</a></li>")}$(".contacts-view").append("</ul>");$(".contacts-view").trigger("create");contactsListener();$.mobile.hidePageLoadingMsg()}
function generateHistory(){var a,b=0,d=$(".content-history > .ui-listview");d.html("");for(var e=0;e<history.length;e++){var c=history[e];if(void 0==a||c.date.getDate()!=a.getDate()){a=c.date;var f=a.toDateString().split(" ");d.append('<li data-role="list-divider">'+(f[0]+","+f[1]+" "+f[2]+", "+f[3])+'<span class="ui-li-count">'+b+"</span></li>");b=0}b++;c="\u10db\u10d8\u10ec\u10dd\u10d3\u10d4\u10d1\u10e3\u10da\u10d8\u10d0"==c.status?'<li><h3 style="color: blue;">'+searchNumber(c.number)+"</h3><span>"+
c.msgText+'</span><p class="ui-li-aside"><strong>'+c.date.getHours().toString()+":"+c.date.getMinutes().toString()+":"+c.date.getSeconds().toString()+"</strong></p></li>":'<li><a href="#" class="resendableMessage" id="'+c.msgID+'"><h3 style="color: blue;">'+searchNumber(c.number)+"</h3><span>"+c.msgText+'</span><p class="ui-li-aside"><strong>'+c.date.getHours().toString()+":"+c.date.getMinutes().toString()+":"+c.date.getSeconds().toString()+"</strong></p></a></li>";d.append(c)}d.listview("refresh")}
function searchNumber(a){if(-1<a.indexOf("599564266"))return"Luka Dodelia";for(var b=mergeContacts(),d=0;d<b.length;d++)for(var e=b[d],c=0;c<e.number.length;c++)if(-1<e.number[c].indexOf(a))return e.name;return a}function normalizeHistory(){for(var a=$(".ui-li-count"),b=0;b<a.length;b++)b+1!=a.length&&$(a[b]).text($(a[b+1]).text())}
function onMsgChange(){var a=$("#msgBody").val().length;146>a?($("#charCount").text(146-a),$("#message").text(1),$("#maxMessages").css("visibility","hidden")):438<a?($("#charCount").text(438-a),$("#message").text(3),$("#maxMessages").css("visibility","visible")):292<a?($("#charCount").text(438-a),$("#message").text(3),$("#maxMessages").css("visibility","hidden")):146<a&&($("#charCount").text(292-a),$("#message").text(2),$("#maxMessages").css("visibility","hidden"))}
function contactsListener(){$("a.contactName").click(function(a){a.preventDefault();a=$(this).attr("id");$("#recipients").val()?$("#recipients").val($("#recipients").val()+","+a):$("#recipients").val(a);$(this).parents("li").remove()});$(".numberSelector").bind("change",function(){var a=$(this).find(":selected").val();$("#recipients").val()?$("#recipients").val($("#recipients").val()+","+a):$("#recipients").val(a);$(this).parents("li").remove()})}
function resendListener(){$("a.resendableMessage").click(function(a){a.preventDefault();resend($(this).attr("id"))})}
function resend(a){var b=historyByID(a);navigator.notification.confirm(b.msgText,function(a){2==a&&($("#recipients").val(b.number),$("#msgBody").val(b.msgText),$(".contacts-view").html(" "),$("#navbarHistory").removeClass("ui-btn-active"),$("#navbarSms").addClass("ui-btn-active"),$(".content-sms").css("display","block"),$(".content-history").css("display","none"),$(".content-contacts").css("display","none"))},"Recipient: "+b.number,"Cancel,Resend")}
function updateCreditsGel(a,b){$("#credit").text(a);$("#gel").text(b)}function getRandTransition(){return transitions[getRandomArbitrary(0,transitions.length)]}function getRandomArbitrary(a,b){return Math.round(Math.random()*(b-a)+a)}function historyByID(a){for(var b=0;b<history.length;b++)if(history[b].msgID==a)return history[b]}function sortContacts(a){a.sort(function(a,d){return a.name.toLowerCase()>d.name.toLowerCase()?1:a.name.toLowerCase()<d.name.toLowerCase()?-1:0})};