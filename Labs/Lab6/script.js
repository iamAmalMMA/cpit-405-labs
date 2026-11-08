// Get HTML elements

const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");

const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");

const commentInput = document.getElementById("commentInput");
const submitComment = document.getElementById("submitComment");
const commentsList = document.getElementById("commentsList");

const resetBtn = document.getElementById("resetBtn");


// Initial values

let likes = 0;
let dislikes = 0;

let comments = [];

let userVote = "";

likeBtn.addEventListener("click", function() {

    if (userVote === "") {
        likes++;
        userVote = "like";

        likeCount.textContent = likes;

        setCookie("lab6Vote", "like", 7);
    }

});

dislikeBtn.addEventListener("click", function() {

    if (userVote === "") {
        dislikes++;
        userVote = "dislike";

        dislikeCount.textContent = dislikes;

        setCookie("lab6Vote", "dislike", 7);
    }

});

function setCookie(name, value, days){
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const currentCookie = cookies[i].trim();

        if (currentCookie.startsWith(name + "=")) {
            return decodeURIComponent(
                currentCookie.substring(name.length + 1)
            );
        }
    }

    return "";
}

function loadVote() {

    const savedVote = getCookie("lab6Vote");

    if (savedVote === "like") {
        userVote = "like";
        likes = 1;
    }
    else if (savedVote === "dislike") {
        userVote = "dislike";
        dislikes = 1;
    }

    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
}

loadVote();

function displayComments() {
    commentsList.innerHTML = "";

    comments.forEach(function(comment) {
        const paragraph = document.createElement("p");

        paragraph.classList.add("comment-item");
        paragraph.textContent = comment;

        commentsList.appendChild(paragraph);
    });
}

submitComment.addEventListener("click", function() {
    const newComment = commentInput.value.trim();

    // Prevent empty comments and multiple submissions
    if (newComment === "" || getCookie("lab6Commented") === "yes") {
        return;
    }

    comments.push(newComment);

    setCookie("lab6Comments", JSON.stringify(comments), 7);
    setCookie("lab6Commented", "yes", 7);

    displayComments();

    commentInput.value = "";
    commentInput.disabled = true;
    submitComment.disabled = true;
});

function loadComments() {
    const savedComments = getCookie("lab6Comments");

    if (savedComments !== "") {
        try {
            const parsedComments = JSON.parse(savedComments);

            if (Array.isArray(parsedComments)) {
                comments = parsedComments;
            }
        } catch (error) {
            comments = [];
        }
    }

    displayComments();

    if (getCookie("lab6Commented") === "yes") {
        commentInput.disabled = true;
        submitComment.disabled = true;
    }
}

loadComments();

const clearComment = document.getElementById("clearComment");

clearComment.addEventListener("click", function() {
    comments = [];

    setCookie("lab6Comments", JSON.stringify(comments), 7);
    setCookie("lab6Commented", "", -1);

    commentsList.innerHTML = "";
    commentInput.value = "";

    commentInput.disabled = false;
    submitComment.disabled = false;
});

resetBtn.addEventListener("click", function() {
    likes = 0;
    dislikes = 0;
    userVote = "";

    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;

    setCookie("lab6Vote", "", -1);
});
