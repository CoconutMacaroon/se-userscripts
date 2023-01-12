// ==UserScript==
// @name         Better Paginator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifies the SE Paginator to support manually entering a page to go to
// @author       cocomac
// @match        https://*.stackexchange.com/questions*
// @match        https://*.stackoverflow.com/questions*
// @match        https://*.superuser.com/questions*
// @match        https://*.serverfault.com/questions*
// @match        https://*.askubuntu.com/questions*
// @match        https://*.stackapps.com/questions*
// @match        https://*.mathoverflow.net/questions*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    // create a new element for where the user can input a page number
    let pageSelector = document.createElement("input");

    // set the style to match the other page number elements
    pageSelector.style.csstext = 'width: 32px;'
                               + 'border: 1px solid hsl(210, 8%, 85%);'
                               + 'height: 25px;'
                               + 'margin: 0;'
                               + 'padding: 0 8px;'
                               + 'borderRadius: 3px';

    // make it so when the user types in a number and presses "Enter", it will navigate to that page
    pageSelector.id = "pageSelector";
    pageSelector.onkeydown = () => {
        if (event.key === "Enter") {
            // get the current URL, and set the page paramater to the text of the input box
            let tmp = new URL(window.location.href);
            let tmpParams = tmp.searchParams;
            tmpParams.set("page", document.getElementById("pageSelector").value);
            tmp.search = tmpParams.toString();
            window.location.href = tmp.toString();
        }
    }

    // I replace the ellipsis in the middle of the page numbers with my page selector box
    document.querySelector("div.s-pagination--item__clear").replaceWith(pageSelector);
})();
