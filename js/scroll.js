const nav = document.querySelectorAll(".nav_list li");
const scrollUp = document.querySelector(".up");
const more = document.querySelector(".hero_button_more");

const navigator = {
    "home": document.querySelector(".header"),
    "services": document.querySelector("#services"),
    "how_work": document.querySelector("#how_work"),
    "for_us": document.querySelector("#about_us"),
    "contact": document.querySelector("#contact")
};

function scroll(event) {
    const clickedButton = event.target.className;

    console.log(clickedButton);

    if (clickedButton === "up") {
        navigator['home'].scrollIntoView({
            behavior: "smooth"
        });
        return;
    }

    if (clickedButton === "hero_button_more") {
        navigator['for_us'].scrollIntoView({
            behavior: "smooth"
        })
    }

    navigator[clickedButton].scrollIntoView({
        behavior: "smooth"
    });
}


if (nav) {
    nav.forEach((button) => button.addEventListener("click", scroll));
}


if (scrollUp) {
    scrollUp.addEventListener("click", scroll);
}

if (more) {
    more.addEventListener("click", scroll);
}