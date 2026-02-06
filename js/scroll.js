const nav = document.querySelectorAll(".nav_list li");
const scrollUp = document.querySelector(".up");


const navigator = {
    "home": document.querySelector(".header"),
    "services": document.querySelector("#services"),
    "how_work": document.querySelector("#how_work"),
    "for_us": document.querySelector("#about_us"),
    "how_wor": document.querySelector("#how_work")
};

function scroll(event) {
    const clickedButton = event.target.className;

    if (clickedButton === "up") {
        navigator['home'].scrollIntoView({
            behavior: "smooth"
        });
    }

    navigator[clickedButton].scrollIntoView({
        behavior: "smooth"
    });
}


if (nav) {
    nav.forEach((button) => button.addEventListener("click", scroll));
}


if (scrollUp) {
    scrollUp.addEventListener("click", scroll)
}