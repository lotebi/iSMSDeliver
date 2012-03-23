$(function () {
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
    });
});