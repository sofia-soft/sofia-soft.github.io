document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navList = document.querySelector('.nav_list');

    burger.addEventListener('click', () => {
        navList.classList.toggle('active');
        burger.classList.toggle('active'); // показва X вместо burger
    });
});