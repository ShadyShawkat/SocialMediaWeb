$(document).ready(function() {

    var userNamePattern = /[a-zA-Z]{5,}/;
    var passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
    var emailPattern = /^[a-zA-Z0-9_-]{3,}@[a-z]{3,}[.][a-z]{3,}$/;

    $("#myForm").change(function() {
        var userName = $("#username").val();
        var pass = $("#pass").val();
        var email = $("#emailAddress").val();
        var userNameCheck = userNamePattern.test(userName);
        var emailCheck = emailPattern.test(email);
        var passCheck;
        if (pass == $("#repass").val())
            passCheck = passwordPattern.test(pass);
        else
            passCheck = false;
        var checkboxCheck = $("#termsAndConditionsCheck").prop("checked");
        if (userNameCheck && passCheck && emailCheck && checkboxCheck)
            $("#submit").removeClass("disabled");
        else
            $("#submit").addClass("disabled");
    });

    $("#username").blur(function() {
        if (!userNamePattern.test($(this).val()))
            $(this).parent().next().removeClass("d-none");
        else
            $(this).parent().next().addClass("d-none");
    })

    $("#emailAddress").blur(function() {
        if (!emailPattern.test($(this).val()))
            $(this).parent().next().removeClass("d-none");
        else
            $(this).parent().next().addClass("d-none");
    })

    $("#pass").blur(function() {
        if (!passwordPattern.test($(this).val()))
            $(this).parent().next().removeClass("d-none");
        else
            $(this).parent().next().addClass("d-none");
    })

    $("#repass").blur(function() {
        if (!passwordPattern.test($(this).val()) || $(this).val() != $("#pass").val())
            $(this).parent().next().removeClass("d-none");
        else
            $(this).parent().next().addClass("d-none");
    })

    $("#submit").click(function() {
        alert("Thanks for registering");
        var usersArray = JSON.parse(localStorage.getItem("users"));
        var userDetails = {
            "username": $("#username").val(),
            "email": $("#emailAddress").val(),
            "password": $("#pass").val(),
            "posts": []
        }
        usersArray.push(userDetails);
        localStorage.setItem("users", JSON.stringify(usersArray));
    })
})