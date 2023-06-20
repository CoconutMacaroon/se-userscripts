// ==UserScript==
// @name         [status-*] highlighting for Stack Overflow for Teams
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds (correct) highlighting to status-* tags on Stack Overflow for Teams
// @author       cocomac
// @match        https://stackoverflowteams.com/c/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    $(() => {
        let results = document.getElementsByClassName("post-tag");

        for(let i = 0; i < results.length; ++i) {
            if (
                results[i].innerText === "status-completed"
                || results[i].innerText === "status-bydesign"
                || results[i].innerText === "status-declined"
                || results[i].innerText === "status-norepro"
                || results[i].innerText === "status-deferred"
                || results[i].innerText === "status-review"
                || results[i].innerText === "status-planned"
                || results[i].innerText === "status-reproduced"
            ) {
                results[i].style = "color: hsl(358,62%,47%) !important;border-color: hsl(358,76%,90%)!important;background-color: hsl(358,75%,97%) !important;"
            }
        }
    });
})();
