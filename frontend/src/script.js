// scripts.js

// Owl Carousel Initialization
import $ from 'jquery';
import 'owl.carousel';

export const initHomepageCarousel = () => {
    $(document).ready(function () {
        $("#homepage-carousel").owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplaySpeed: 1500,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                600: { items: 3 },
                1000: { items: 6 },
            },
        });
    });
};

export const initVerticalCarousel = () => {
    $(document).ready(function () {
        $("#vertical-carousel").owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplaySpeed: 1500,
            autoplayHoverPause: true,
            slideBy: 3,
            items: 1,
            responsive: {
                0: { items: 1 },
                600: { items: 1 },
                1000: { items: 1 },
            },
        });
    });
};

// Cookie Functions
export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
};

export const getCookie = (cname) => {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookie.split(';');
    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return '';
};

// Change Button Text
export const changeButtonText = (text) => {
    document.getElementById('dropdownButton').innerHTML = `<b>${text}</b>`;
};

// Toggle Folder Visibility
export const toggleFolder = (element) => {
    element.classList.toggle('open');
};
