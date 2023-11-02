// ==UserScript==
// @name         Universal Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds universal-ish dark mode to Stack Exchange
// @author       cocomac
// @match        https://meta.stackexchange.com/*
// @match        https://sound.stackexchange.com/*
// @match        https://sound.meta.stackexchange.com/*
// @match        https://stackapps.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  $(() => {
    $("body").addClass("theme-dark");
    document.getElementById("left-sidebar").style.background = "#2d2e2f";
    document.getElementsByTagName("body")[0].style.background = "#2d2e2f";
  });
})();
