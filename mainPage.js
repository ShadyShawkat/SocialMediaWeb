$(document).ready(function() {

    var currentUser;
    var users;
    var isFileInputEmpty = true;
    var isloggedIn

    if (localStorage.getItem("users") == null) {
        var usersArray = [];
        localStorage.setItem("users", JSON.stringify(usersArray));
    }

    if (localStorage.getItem("isloggedIn") == null) {
        localStorage.setItem("isloggedIn", JSON.stringify(false));
        isloggedIn = false;
    } else {
        isloggedIn = JSON.parse(localStorage.getItem("isloggedIn"));
    }

    $("#ddlModeChangeItem").click(function() {
        $("#darkModeSwitch").click();
    })

    if (isloggedIn == true) {
        userDetails = JSON.parse(localStorage.getItem("loggedInUser"));
        autoLogin(userDetails);
    }

    $("#darkModeSwitch").change(function(e) {
        $(".bg-light, .bg-dark").toggleClass("bg-dark bg-light");
        $(".btn-light, .btn-secondary").toggleClass("btn-secondary btn-light");
        if ($("#signUpBtn") || $("#viewAllTopComms" || $("#post-button"))) {
            $("#signUpBtn, #viewAllTopComms, #post-button").removeClass("btn-secondary");
            $("#signUpBtn, #viewAllTopComms, #post-button").toggleClass("btn-primary btn-light");
            if ($("#signUpBtn").hasClass("btn-light") && $("#signUpBtn").hasClass("btn-primary"))
                $("#signUpBtn, #viewAllTopComms, #post-button").removeClass("btn-light");
        }
        $(".awesome-light, .awesome-dark").toggleClass("awesome-dark awesome-light");
        $(".text-light, .text-dark").toggleClass("text-dark text-light");
        $(".border-light, .border-dark").toggleClass("border-light border-dark");
        if ($("#topLogo").attr("src") == "Images/TopLogoLight.PNG")
            $("#topLogo").attr("src", "Images/TopLogoDark.PNG");
        else
            $("#topLogo").attr("src", "Images/TopLogoLight.PNG");
        $(".btn-outline-primary, .btn-outline-light").toggleClass("btn-outline-primary btn-outline-light");
        $("body").toggleClass("lightBody darkBody");
    })

    // ddl hover color
    $(".dropdown-item").hover(function(event) {
        $(this).css("background-color", "#007BFF");
        $(this).toggleClass("text-dark text-light");
    }, function() {
        $(this).css("background-color", "");
        $(this).toggleClass("text-dark text-light");
    })

    // update rating and change the like and dislike arrows 
    $(document).on("click", ".rating", function() {
        var rate = parseInt($(this).parent().parent().find("span").html());
        if ($(this).hasClass("upArrow")) {
            if (!$(this).hasClass("clicked")) {
                if ($(this).parent().parent().find("i").eq(1).hasClass("clicked"))
                    $(this).parent().parent().find("span").html(rate + 2);
                else
                    $(this).parent().parent().find("span").html(rate + 1);
            } else {
                $(this).parent().parent().find("span").html(rate - 1);
            }
            $(this).parent().nextAll().eq(1).children().removeClass("clicked");
            $(this).toggleClass("clicked");
        } else {
            if (!$(this).hasClass("clicked")) {
                if ($(this).parent().parent().find("i").eq(0).hasClass("clicked"))
                    $(this).parent().parent().find("span").html(rate - 2);
                else
                    $(this).parent().parent().find("span").html(rate - 1);
            } else {
                $(this).parent().parent().find("span").html(rate + 1);
            }
            $(this).parent().prevAll().eq(1).children().removeClass("clicked");
            $(this).toggleClass("clicked");
        }
    })

    $("#loginBtn").click(function() {
        var email = $("#email").val();
        var pass = $("#pass").val();
        var loggedInUser

        var usersArray = JSON.parse(localStorage.getItem("users"));
        var valid = false;
        usersArray.forEach((user, index) => {
            if (user.email == email)
                if (user.password == pass) {
                    valid = true;
                    currentUser = index;
                    users = usersArray;
                    localStorage.setItem("isloggedIn", JSON.stringify(true));
                    loggedInUser = {
                        "E": email,
                        "P": pass
                    }
                }
        });
        if (!valid)
            alert("Invalid email and password");
        else {
            $("#login").toggleClass("d-none");
            $("#signUpBtn").toggleClass("d-none");
            $("#createPostDiv").toggleClass("d-none d-flex");
            $("#signOutBtn").removeClass("d-none");
            $("#notificationsBtn").removeClass("d-none");
            $("#contactBtn").removeClass("d-none");
            $("#historyBtn").removeClass("d-none");
            $("#loginModal").modal('hide');
        }
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        createAll();
    })

    // auto login on refresh
    function autoLogin(userDetails) {
        var email = userDetails.E;
        var pass = userDetails.P;
        var usersArray = JSON.parse(localStorage.getItem("users"));
        usersArray.forEach((user, index) => {
            if (user.email == email)
                if (user.password == pass) {
                    currentUser = index;
                    users = usersArray;
                    loggedInUser = {
                        "E": email,
                        "P": pass
                    }
                }
        });
        $("#login").toggleClass("d-none");
        $("#signUpBtn").toggleClass("d-none");
        $("#createPostDiv").toggleClass("d-none d-flex");
        $("#signOutBtn").removeClass("d-none");
        $("#notificationsBtn").removeClass("d-none");
        $("#contactBtn").removeClass("d-none");
        $("#historyBtn").removeClass("d-none");
        $("#loginModal").modal('hide');
    }

    $("#signOutBtn").click(function() {
        localStorage.setItem("isloggedIn", JSON.stringify(false));
        $("#login").toggleClass("d-none");
        $("#signUpBtn").toggleClass("d-none");
        $("#createPostDiv").toggleClass("d-none d-flex");
        $("#signOutBtn").addClass("d-none");
        $("#notificationsBtn").addClass("d-none");
        $("#contactBtn").addClass("d-none");
        $("#historyBtn").addClass("d-none");
        localStorage.removeItem("loggedInUser");
        window.location.reload(false);
    })

    $("#post-text").on('input', function() {
        if ($(this).val() != '')
            $("#post-button").prop('disabled', false);
        else
            $("#post-button").prop('disabled', true);
    })

    $("#browseFileBtn").click(function() {
        $("#myFile").trigger("click");
    })

    $("#myFile").change(function() {
        if (isFileInputEmpty == true) {
            $("#browseFileBtn").toggleClass("btn-primary btn-success");
            isFileInputEmpty = false;
        }
    });

    $(document).on('input', '.commentInput', function() {
        if ($(this).val() != '')
            $(this).next().prop('disabled', false);
        else
            $(this).next().prop('disabled', true);
    })

    // auto create posts and comments that are stored in the local storage
    if (isloggedIn) {
        createAll();
    }



    //Creating comments
    $(document).on("click", ".sendCommentBtn", function() {
        var thisCommentDate = new Date().toLocaleTimeString();
        var commentTxt = $(this).prev().val();

        var div = createComment(thisCommentDate, commentTxt);
        $(this).parent().after(div);

        users[currentUser].posts.forEach((post) => {
            var comment = {
                "commentTxt": '',
                "commentDate": ''
            }
            if ($(this).parent().parent().parent().parent().find(".postingTime").html() == post.date) {

                comment.commentTxt = $(this).prev().val();
                comment.commentDate = thisCommentDate;

                post.comments.push(comment)
                localStorage.setItem("users", JSON.stringify(users));
            }
        })

        $(this).prev().val('');
        $(this).prop('disabled', true);
    });

    // removing a comment
    $(document).on("click", ".deleteCommentBtn", function() {
        for (let i = 0; i < users[currentUser].posts.length; i++) {
            if ($(this).parent().parent().parent().parent().find(".postingTime").html() == users[currentUser].posts[i].date) {
                var children = $(this).parent().parent().children().toArray();
                for (let j = 0; j < users[currentUser].posts[i].comments.length; j++) {
                    if ($(this).parent().find(".commentDate").html() == users[currentUser].posts[i].comments[j].commentDate) {
                        users[currentUser].posts[i].comments.splice(j, 1);
                        localStorage.setItem("users", JSON.stringify(users));
                        break;
                    }
                }
                break;
            }
        }
        $(this).parent().remove();
    });

    // removing a post
    $(document).on("click", ".deletePostBtn", function() {
        for (let i = 0; i < users[currentUser].posts.length; i++) {
            if ($(this).parent().parent().find(".postingTime").html() == users[currentUser].posts[i].date) {
                users[currentUser].posts.splice(i, 1);
                localStorage.setItem("users", JSON.stringify(users));
                break;
            }
        }
        $(this).parent().parent().remove();
    });

    //opening the comments section
    $(document).on("click", ".commentBtn", function() {
        $(this).parent().find(".collapse").collapse('toggle')
    })

    // creating posts
    $("#post-button").click(function() {
        var fileName = null;
        var postDate = new Date().toLocaleTimeString();
        var post = {
            "postTxt": "",
            "date": "",
            "postImgSrc": "",
            "comments": []
        }
        if ($("#myFile").val() != '') {
            fileName = $("#myFile").val().split("\\").pop();
        }
        var postTxt = $("#post-text").val();

        var div = createPost(postDate, fileName, postTxt);

        $("#createPostDiv").after(div);

        post.postTxt = $("#post-text").val();
        post.date = postDate;
        if ($("#myFile").val() != '') {
            post.postImgSrc = fileName;
        }

        users[currentUser].posts.push(post);
        localStorage.setItem("users", JSON.stringify(users));

        $("#myFile").val('');
        $("#post-text").val('');
        $("#post-button").prop('disabled', true);

        if (isFileInputEmpty == false) {
            $("#browseFileBtn").toggleClass("btn-primary btn-success");
            isFileInputEmpty = true;
        }
    })

    function createPost(postDate, fileName, postTxt) {
        var div = $("<div>", { "class": "post-card shadow-md mb-4 rounded bg-light py-2" });
        var div_div1 = $("<div>", { css: { "width": "5%" } }).appendTo(div);
        var div_div1_div = $("<div>", { "class": "d-flex flex-column align-items-center text-dark font-weight-bold" }).appendTo(div_div1);
        var div_div1_div_a1 = $("<a>", { "class": "text-dark" }).appendTo(div_div1_div);
        $("<i>", { "class": "upArrow rating fas fa-arrow-up" }).appendTo(div_div1_div_a1);
        $("<span>", { "class": "text-dark", html: 0 }).appendTo(div_div1_div);
        var div_div1_div_a2 = $("<a>", { "class": "text-dark" }).appendTo(div_div1_div);
        $("<i>", { "class": "rating fas fa-arrow-down" }).appendTo(div_div1_div_a2);
        var div_div2 = $("<div>", { css: { "width": "95%" } }).appendTo(div);
        var div_div2_div1 = $("<div>", { "class": "d-flex mb-2" }).appendTo(div_div2);
        var div_div2_div1_a1 = $("<a>", { href: "#", "class": "profileLink mr-2" }).appendTo(div_div2_div1);
        $("<img>", { "class": "profileImg", src: "Images/genericProfilePic.png" }).appendTo(div_div2_div1_a1);
        $("<a>", { href: "#", "class": "font-weight-bold text-dark mr-2", html: "r/Gaming" }).appendTo(div_div2_div1);
        $("<span>", { "class": "font-italic font-weight-light text-dark", html: "• Posted by u/" + users[currentUser].username }).appendTo(div_div2_div1);
        $("<span>", { "class": "postingTime font-italic font-weight-light text-dark ml-2", html: postDate }).appendTo(div_div2_div1);
        $("<p>", { "class": "text-dark", html: postTxt }).appendTo(div_div2);
        if (fileName != null) {
            $("<img>", { "class": "postImg pr-4 mb-2 img-fluid", src: "Images/" + fileName }).appendTo(div_div2);
        }
        var div_div2_button1 = $("<button>", { "class": "commentBtn btn btn-light text-dark font-weight-bold rounded-0 mr-3", "data-toggle": "collapse" }).appendTo(div_div2);
        $("<i>", { "class": "fas fa-comment-alt" }).appendTo(div_div2_button1);
        $(div_div2_button1).append(" Comment");
        var div_div2_button2 = $("<button>", { "class": "btn btn-light text-dark font-weight-bold rounded-0 mr-3" }).appendTo(div_div2);
        $("<i>", { "class": "fas fa-share" }).appendTo(div_div2_button2);
        $(div_div2_button2).append(" Share");
        var div_div2_button3 = $("<button>", { "class": "btn btn-light text-dark font-weight-bold rounded-0 mr-3" }).appendTo(div_div2);
        $("<i>", { "class": "fas fa-bookmark" }).appendTo(div_div2_button3);
        $(div_div2_button3).append(" Save");

        var div_div2_button4 = $("<button>", { "class": "deletePostBtn btn btn-danger font-weight-bold rounded-0 mr-3" }).appendTo(div_div2);
        $("<i>", { "class": "far fa-trash-alt" }).appendTo(div_div2_button4);
        $(div_div2_button4).append("Delete");
        var div_div2_div2 = $("<div>", { "class": "collapse" }).appendTo(div_div2);
        var div_div2_div2_div = $("<div>", { "class": "my-3 mr-4" }).appendTo(div_div2_div2);
        var div_div2_div2_div_div = $("<div>", { "class": "d-flex mb-2" }).appendTo(div_div2_div2_div);
        $("<input>", { "class": "commentInput form-control", "type": "text", "placeholder": ". . ." }).appendTo(div_div2_div2_div_div);
        var div_div2_div2_div_div_btn = $("<button>", { "class": "sendCommentBtn btn btn-outline-primary" }).appendTo(div_div2_div2_div_div);
        div_div2_div2_div_div_btn.prop("disabled", true)
        $("<i>", { "class": "fas fa-play" }).appendTo(div_div2_div2_div_div_btn);

        return div;
    }

    function createComment(thisCommentDate, commentTxt) {
        var div = $("<div>", { "class": "bg-dark text-light rounded p-2 d-flex mb-2" });
        var a = $("<a>", { href: "#", "class": "profileLink mr-2 align-self-center" }).appendTo(div);
        $("<img>", { src: "Images/genericProfilePic.png", "class": "profileImg" }).appendTo(a);
        $("<p>", { html: commentTxt, "class": "mb-0 text-break commentTxt mr-2" }).appendTo(div);
        $("<button>", { html: "<i class='fas fa-times'></i>", "class": "deleteCommentBtn btn btn-danger ml-auto btn-sm align-self-center" }).appendTo(div);
        $("<div>", { html: thisCommentDate, "class": "commentDate d-none" }).appendTo(div);
        return div;
    }

    function createAll() {
        for (let i = 0; i < users[currentUser].posts.length; i++) {
            let fileName = null;
            let postDate = users[currentUser].posts[i].date;
            if (users[currentUser].posts[i].postImgSrc != '') {
                fileName = users[currentUser].posts[i].postImgSrc;
            }
            let postTxt = users[currentUser].posts[i].postTxt
            let postDiv = createPost(postDate, fileName, postTxt);
            $("#createPostDiv").after(postDiv);
            for (let j = 0; j < users[currentUser].posts[i].comments.length; j++) {
                let thisCommentDate = users[currentUser].posts[i].comments[j].commentDate;
                let commentTxt = users[currentUser].posts[i].comments[j].commentTxt;

                let commentDiv = createComment(thisCommentDate, commentTxt);
                $(postDiv).find(".commentInput").parent().after(commentDiv);
            }
        }
    }


})