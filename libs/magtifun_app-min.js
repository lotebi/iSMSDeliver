/**
 * Created by JetBrains WebStorm.
 * User: Luka
 * Date: 3/29/12
 * Time: 10:17 PM
 * To change this template use File | Settings | File Templates.
 */
function sortContacts(a){a.sort(function(a,b){if(a.name.toLowerCase()>b.name.toLowerCase())return 1;else if(a.name.toLowerCase()<b.name.toLowerCase())return-1;else return 0})}function historyByID(a){for(var b=0;b<history.length;b++){if(history[b].msgID==a){return history[b]}}return undefined}function getRandomArbitrary(a,b){return Math.round(Math.random()*(b-a)+a)}function getRandTransition(){return transitions[getRandomArbitrary(0,transitions.length)]}function updateCreditsGel(a,b){$("#credit").text(a);$("#gel").text(b)}function resend(a){var b=historyByID(a);navigator.notification.confirm(b.msgText,function(a){if(a==2){$("#recipients").val(b.number);$("#msgBody").val(b.msgText);$(".contacts-view").html(" ");$("#navbarHistory").removeClass("ui-btn-active");$("#navbarSms").addClass("ui-btn-active");$(".content-sms").css("display","block");$(".content-history").css("display","none");$(".content-contacts").css("display","none")}},"Recipient: "+b.number,"Cancel,Resend")}function resendListener(){$("a.resendableMessage").click(function(a){a.preventDefault();resend($(this).attr("id"))})}function contactsListener(){$("a.contactName").click(function(a){a.preventDefault();var b=$(this).attr("id");if(!$("#recipients").val())$("#recipients").val(b);else $("#recipients").val($("#recipients").val()+","+b);$(this).parents("li").remove()});$(".numberSelector").bind("change",function(a,b){var c=$(this).find(":selected").val();if(!$("#recipients").val())$("#recipients").val(c);else $("#recipients").val($("#recipients").val()+","+c);$(this).parents("li").remove()})}function onMsgChange(){var a=$("#msgBody").val().length;if(a<146){$("#charCount").text(146-a);$("#message").text(1);$("#maxMessages").css("visibility","hidden")}else if(a>146+146+146){$("#charCount").text(146+146+146-a);$("#message").text(3);$("#maxMessages").css("visibility","visible")}else if(a>146+146){$("#charCount").text(146+146+146-a);$("#message").text(3);$("#maxMessages").css("visibility","hidden")}else if(a>146){$("#charCount").text(146+146-a);$("#message").text(2);$("#maxMessages").css("visibility","hidden")}}function normalizeHistory(){var a=$(".ui-li-count");for(var b=0;b<a.length;b++){if(b+1!=a.length){$(a[b]).text($(a[b+1]).text())}}}function searchNumber(a){if(a.indexOf("599564266")>-1)return"Luka Dodelia";var b=mergeContacts();for(var c=0;c<b.length;c++){var d=b[c];for(var e=0;e<d.number.length;e++){if(d.number[e].replace(/[^\+\d]/g,"").indexOf(a.replace(/[^\+\d]/g,"")>-1)){return d.name}}}return a}function generateHistory(){var a;var b=0;var c=$(".content-history > .ui-listview");c.html("");for(var d=0;d<history.length;d++){var e=history[d];if(a==undefined||e.date.getDate()!=a.getDate()){a=e.date;var f=a.toDateString().split(" ");var g=f[0]+","+f[1]+" "+f[2]+", "+f[3];var h='<li data-role="list-divider">'+g+'<span class="ui-li-count">'+b+"</span></li>";c.append(h);b=0}b++;var i;if(e.status=="მიწოდებულია"){i='<li><h3 style="color: blue;">'+searchNumber(e.number)+"</h3>"+"<span>"+e.msgText+"</span>"+'<p class="ui-li-aside">'+"<strong>"+e.date.getHours().toString()+":"+e.date.getMinutes().toString()+":"+e.date.getSeconds().toString()+"</strong>"+"</p></li>"}else{i='<li><a href="#" class="resendableMessage" id="'+e.msgID+'">'+'<h3 style="color: blue;">'+searchNumber(e.number)+"</h3>"+"<span>"+e.msgText+"</span>"+'<p class="ui-li-aside">'+"<strong>"+e.date.getHours().toString()+":"+e.date.getMinutes().toString()+":"+e.date.getSeconds().toString()+"</strong>"+"</p></a></li>"}c.append(i)}c.listview("refresh");$.mobile.hidePageLoadingMsg()}function generateContacts(a,b){if(b){a=mergeContacts()}sortContacts(a);$(".contacts-view").html('<ul data-role="listview" data-filter="true" data-filter-placeholder="Search contacts..." data-filter-theme="d" data-theme="d" data-divider-theme="d" >');var c="";for(var d=0;d<a.length;d++){var e=a[d];if(e.name[0].toUpperCase()!=c){c=e.name[0].toUpperCase();$(".contacts-view > [data-role='listview']").append('<li data-role="list-divider">'+c+"</li>")}if(e.number.length>1){var f="<li>"+'<select name="select-choice-min" class="numberSelector"  data-native-menu="true" data-mini="true">';f+="<option>"+e.name+"</option>";for(var g=0;g<e.number.length;g++){f+='<option value="'+e.number[g].replace(/[^\+\d]/g,"")+'">'+e.number[g]+"</option>"}f+="</select>"+"</li>";$(".contacts-view > [data-role='listview']").append(f)}else{$(".contacts-view > [data-role='listview']").append('<li><a href="#" id="'+e.number[0].replace(/[^\+\d]/g,"")+'" class="contactName">'+e.name+"</a></li>")}}$(".contacts-view").append("</ul>");$(".contacts-view").trigger("create");contactsListener()}function mergeContacts(){if(contactsMerged!=undefined){contactsMerged=[];for(var a=0;a<contactsRemote.length;a++){contactsMerged.push(contactsRemote[a])}for(var b=0;b<contactsLocal.length;b++){contactsMerged.push(contactsLocal[b])}}return contactsMerged}function grabHistory(a){connectorObject.getHistory(function(a){history=a;generateHistory();normalizeHistory();resendListener();$.mobile.hidePageLoadingMsg()},a)}function grabContacts(){connectorObject.getContacts(function(a){contactsRemote=[];for(var b=0;b<a.length;b++){var c=a[b];var d=new Object;d.name=new String;d.number=[];for(var e=1;e<c.length;e++){var f=c[e];if(e==4){d.number.push(f);break}else{d.name=d.name+f+" "}}d.name=d.name.trim();contactsRemote.push(d)}sortContacts(contactsRemote)})}function refreshBalance(){connectorObject.getBalance(updateCreditsGel)}var connectorObject,history,contactsRemote,contactsMerged,contactsLocal=[],transitions=[];transitions.push("pop");transitions.push("flip");transitions.push("slide");transitions.push("slideup");transitions.push("slidedown");$(function(){$("#login").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();var b=$("#username").val();var c=$("#password").val();connectorObject=new Magitfun(b,c);connectorObject.login(function(a){if(a=="succses"){$.mobile.changePage($("#pageHome"),{transition:getRandTransition()});refreshBalance();grabContacts();grabHistory(2)}else{navigator.notification.vibrate(250);navigator.notification.alert("Wrong Username or Password",null,"MissBehaive","I'm Sorry!")}})});$("#refresh").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();refreshBalance();grabHistory(2)});$("#send").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();if($("#maxMessages").css("visibility")=="hidden"){var b=$("#recipients").val();var c=$("#msgBody").val();connectorObject.sendSms(b,c,function(a){$("#recipients").val("");$("#msgBody").val("");refreshBalance();grabHistory(2)})}else{navigator.notification.alert("You exsided message character limit",null,"MissBehaive","I'm Sorry!")}});$("#msgBody").keyup(onMsgChange);$("#msgBody").keydown(onMsgChange);$("#msgBody").bind("change",onMsgChange);$("#logout").click(function(a){a.preventDefault();var b=getRandTransition();$.mobile.changePage($("#pageLogin"),{transition:b})});$("#about").click(function(a){a.preventDefault();navigator.notification.alert("Ra About ?? Button Dainaxe da daachire?",null,"Kai roja Xar?","sxvagan movxvdi")});$("#navbarSms").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-sms").css("display","block");$(".content-history").css("display","none");$(".content-contacts").css("display","none")});$("#navbarHistory").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-history").css("display","block");$(".content-sms").css("display","none");$(".content-contacts").css("display","none")});$("#navbarContacts").click(function(a){a.preventDefault();$(".contacts-view").html(" ");$(".content-contacts").css("display","block");$(".content-sms").css("display","none");$(".content-history").css("display","none");$(".contacts-choose").css("display","block");$(".contacts-view").css("display","none")});$("#allContacts").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();generateContacts("",true);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block");$.mobile.hidePageLoadingMsg()});$("#localContacts").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();generateContacts(contactsLocal,false);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block");$.mobile.hidePageLoadingMsg()});$("#providerContacts").click(function(a){a.preventDefault();$.mobile.showPageLoadingMsg();generateContacts(contactsRemote,false);$(".contacts-choose").css("display","none");$(".contacts-view").css("display","block");$.mobile.hidePageLoadingMsg()});document.addEventListener("deviceready",function(){function b(a){navigator.notification.alert("Something Bad Happened About Contacts\nMaybe You Should Start Again",null,"Tragedy","understood")}function a(a){for(var b=0;b<a.length;b++){var c=a[b];var d=new Object;d.name=c.name.formatted;d.number=[];for(var e=0;e<c.phoneNumbers.length;e++){d.number.push(c.phoneNumbers[e].value)}contactsLocal.push(d)}sortContacts(contactsLocal)}$.mobile.touchOverflowEnabled=true;var c=new ContactFindOptions;c.filter="";c.multiple=true;filter=["displayName","name","phoneNumbers"];navigator.contacts.find(filter,a,b,c)},false)});