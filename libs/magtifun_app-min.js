var connectorObject,history,contactsRemote,contactsLocal=[],contactsMerged,transitions=[];transitions.push("pop");transitions.push("flip");transitions.push("slide");transitions.push("slideup");transitions.push("slidedown");
$(function(){$("#login").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();var a=$("#username").val(),b=$("#password").val();connectorObject=new Magitfun(a,b);connectorObject.login(function(a){"succses"==a?($.mobile.changePage($("#pageHome")),refreshBalance()):(navigator.notification.vibrate(250),navigator.notification.alert("Wrong Username or Password",null,"MissBehaive","I'm Sorry!"));$.mobile.hidePageLoadingMsg()})});$("#pageHome").live("pageshow",function(){$.mobile.showPageLoadingMsg();
    grabContacts();grabHistory(2)});$("#refresh").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();refreshBalance();grabHistory(2)});$("#send").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();if("hidden"==$("#maxMessages").css("visibility")){var a=$("#recipients").val(),b=$("#msgBody").val();connectorObject.sendSms(a,b,function(){$("#recipients").val("");$("#msgBody").val("");refreshBalance();grabHistory(2);onMsgChange()})}else navigator.notification.alert("You exsided message character limit",
    null,"MissBehaive","I'm Sorry!")});$("#msgBody").keyup(onMsgChange);$("#msgBody").keydown(onMsgChange);$("#msgBody").bind("change",onMsgChange);$("#logout").click(function(a){a.preventDefault();getRandTransition();$.mobile.changePage($("#pageLogin"))});$("#about").click(function(a){a.preventDefault();navigator.notification.alert("Ra About ?? Button Dainaxe da daachire?",null,"Kai roja Xar?","sxvagan movxvdi")});$("#navbarSms").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-sms").css("display",
    "block");$(".content-history").css("display","none");$(".content-contacts").css("display","none")});$("#navbarHistory").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-history").css("display","block");$(".content-sms").css("display","none");$(".content-contacts").css("display","none")});$("#navbarContacts").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-contacts").css("display","block");$(".content-sms").css("display","none");$(".content-history").css("display",
    "none");$(".contacts-choose").css("display","block");$(".contacts-view").css("display","none")});$("#allContacts").click(function(a){a.preventDefault();generateContacts("",!0);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});$("#localContacts").click(function(a){a.preventDefault();generateContacts(contactsLocal,!1);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});$("#providerContacts").click(function(a){a.preventDefault();
    generateContacts(contactsRemote,!1);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block")});document.addEventListener("deviceready",function(){$.mobile.touchOverflowEnabled=!0;var a=new ContactFindOptions;a.filter="";a.multiple=!0;filter=["displayName","name","phoneNumbers"];navigator.contacts.find(filter,function(a){for(var d=0,e=a.length;d<e;d++){var f=a[d],c={};c.name=f.name.formatted;c.number=[];for(var g=0;g<f.phoneNumbers.length;g++)c.number.push(f.phoneNumbers[g].value);
    contactsLocal.push(c)}sortContacts(contactsLocal)},function(){navigator.notification.alert("Something Bad Happened About Contacts\nMaybe You Should Start Again",null,"Tragedy","understood")},a)},!1)});function refreshBalance(){connectorObject.getBalance(updateCreditsGel)}
function grabContacts(){connectorObject.getContacts(function(a){contactsRemote=[];for(var b=0,d=a.length;b<d;b++){for(var e=a[b],f={name:"",number:[]},c=1,g=e.length;c<g;c++){var h=e[c];if(4==c){f.number.push(h);break}else f.name=f.name+h+" "}f.name=f.name.trim();contactsRemote.push(f)}sortContacts(contactsRemote)})}function grabHistory(a){connectorObject.getHistory(function(a){history=a;generateHistory();normalizeHistory();resendListener();$.mobile.hidePageLoadingMsg()},a)}
function mergeContacts(){if(!contactsMerged){contactsMerged=[];for(var a=0,b=contactsRemote.length;a<b;a++)contactsMerged.push(contactsRemote[a]);a=0;for(b=contactsLocal.length;a<b;a++)contactsMerged.push(contactsLocal[a]);a={name:"Luka Dodelia",number:[]};a.number.push("599564266");contactsMerged.push(a)}return contactsMerged}
function generateContacts(a,b){$.mobile.showPageLoadingMsg();b&&(a=mergeContacts());sortContacts(a);$(".contacts-view").html('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >');$.mobile.showPageLoadingMsg();for(var d="",e=0,f=a.length;e<f;e++){var c=a[e];c.name[0].toUpperCase()!=d&&(d=c.name[0].toUpperCase(),$(".contacts-view > [data-role='listview']").append('<li data-role="list-divider">'+d+"</li>"));
    if(1<c.number.length){for(var g='<li><select name="select-choice-min" class="numberSelector"  data-native-menu="true" data-mini="true">',g=g+("<option>"+c.name+"</option>"),h=0;h<c.number.length;h++)g+='<option value="'+c.number[h].replace(/[^\+\d]/g,"")+'">'+c.number[h]+"</option>";g+="</select></li>";$(".contacts-view > [data-role='listview']").append(g)}else $(".contacts-view > [data-role='listview']").append('<li><a href="#" id="'+c.number[0].replace(/[^\+\d]/g,"")+'" class="contactName">'+c.name+
        "</a></li>")}$(".contacts-view").append("</ul>");$(".contacts-view").trigger("create");contactsListener()}
function generateHistory(){var a,b=0,d=$(".content-history > .ui-listview");d.html("");for(var e=0,f=history.length;e<f;e++){var c=history[e];if(void 0==a||c.date.getDate()!=a.getDate()){a=c.date;var g=a.toDateString().split(" ");d.append('<li data-role="list-divider">'+(g[0]+","+g[1]+" "+g[2]+", "+g[3])+'<span class="ui-li-count">'+b+"</span></li>");b=0}b++;c="\u10db\u10d8\u10ec\u10dd\u10d3\u10d4\u10d1\u10e3\u10da\u10d8\u10d0"==c.status?'<li><h3 style="color: blue;">'+searchNumber(c.number)+"</h3><span>"+
    $("<div/>").text(c.msgText).html()+'</span><p class="ui-li-aside"><strong>'+c.date.getHours().toString()+":"+c.date.getMinutes().toString()+":"+c.date.getSeconds().toString()+"</strong></p></li>":'<li><a href="#" class="resendableMessage" id="'+c.msgID+'"><h3 style="color: blue;">'+searchNumber(c.number)+"</h3><span>"+c.msgText+'</span><p class="ui-li-aside"><strong>'+c.date.getHours().toString()+":"+c.date.getMinutes().toString()+":"+c.date.getSeconds().toString()+"</strong></p></a></li>";d.append(c)}d.listview("refresh")}
function searchNumber(a){for(var b=mergeContacts(),d=0,e=b.length;d<e;d++)for(var f=b[d],c=0;c<f.number.length;c++)if(-1<f.number[c].replace(/[^\+\d]/g,"").indexOf(a.replace(/[^\+\d]/g,"")))return f.name;return a}
function normalizeHistory(){for(var a=$(".content-history > .ui-listview > li[data-role='list-divider']"),b=0,d=a.length;b<d;b++){var e=$(".content-history > .ui-listview > li").index(a[b]),e=b+1!=d?$(".content-history > .ui-listview > li").index(a[b+1])-1-e:$(".content-history > .ui-listview > li").length-1-e;$(a[b]).children(".ui-li-count").text(e)}}
function onMsgChange(){var a=$("#msgBody").val().length;146>a?($("#charCount").text(146-a),$("#message").text(1),$("#maxMessages").css("visibility","hidden")):438<a?($("#charCount").text(438-a),$("#message").text(3),$("#maxMessages").css("visibility","visible")):292<a?($("#charCount").text(438-a),$("#message").text(3),$("#maxMessages").css("visibility","hidden")):146<a&&($("#charCount").text(292-a),$("#message").text(2),$("#maxMessages").css("visibility","hidden"))}
function contactsListener(){$("a.contactName").click(function(a){a.preventDefault();a=$(this).attr("id");$("#recipients").val()?$("#recipients").val($("#recipients").val()+","+a):$("#recipients").val(a);$(this).parents("li").remove()});$(".numberSelector").bind("change",function(){var a=$(this).find(":selected").val();$("#recipients").val()?$("#recipients").val($("#recipients").val()+","+a):$("#recipients").val(a);$(this).parents("li").remove()})}
function resendListener(){$("a.resendableMessage").click(function(a){a.preventDefault();resend($(this).attr("id"))})}
function resend(a){var b=historyByID(a);navigator.notification.confirm(b.msgText,function(a){2==a&&($("#recipients").val(b.number),$("#msgBody").val(b.msgText),$(".contacts-view").html(" "),$("#navbarHistory").removeClass("ui-btn-active"),$("#navbarSms").addClass("ui-btn-active"),$(".content-sms").css("display","block"),$(".content-history").css("display","none"),$(".content-contacts").css("display","none"))},"Recipient: "+b.number,"Cancel,Resend")}
function updateCreditsGel(a,b){$("#gel").text(b);$("#credit").text(a)}function getRandTransition(){return transitions[getRandomArbitrary(0,transitions.length)]}function getRandomArbitrary(a,b){return Math.round(Math.random()*(b-a)+a)}function historyByID(a){for(var b=0,d=history.length;b<d;b++)if(history[b].msgID==a)return history[b]}function sortContacts(a){a.sort(function(a,d){return a.name.toLowerCase()>d.name.toLowerCase()?1:a.name.toLowerCase()<d.name.toLowerCase()?-1:0})};