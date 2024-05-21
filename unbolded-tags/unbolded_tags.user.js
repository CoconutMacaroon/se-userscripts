// ==UserScript==
// @name         Unbolded tags
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Removes bold from tags on SE sites
// @author       cocomac
// @match        https://*.stackexchange.com/*
// @match        https://*.stackoverflow.com/*
// @match        https://*.superuser.com/*
// @match        https://*.serverfault.com/*
// @match        https://*.askubuntu.com/*
// @match        https://*.stackapps.com/*
// @match        https://*.mathoverflow.net/*
// @match        https://stackoverflowteams.com/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    for (let tag of document.getElementsByClassName("s-tag")) {
        tag.style.fontWeight = "normal";
    }
})();
