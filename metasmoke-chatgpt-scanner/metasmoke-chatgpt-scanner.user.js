// ==UserScript==
// @name         MetaSmoke ChatGPT Scanner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to scan a post for ChatGPT in MS
// @author       You
// @match        https://metasmoke.erwaysoftware.com/post/*
// @grant        none
// ==/UserScript==

(() => {
    // TODO: default HTML button doesn't match the page theme, use a button that looks nicer
    // TODO: alert(...) likely isn't the best way to display it - maybe replace the button with the percent chance of it being ChatGPT? Or some other type of less-obtrusive p

    'use strict';
    // create a button to detect ChatGPT
    let button = document.createElement("button");
    button.innerText = "Detect ChatGPT";

    // when the button is clicked
    button.addEventListener('click', (e) => {
        // extract the text of the post, and use .text() from jQuery to remove the HTML
        let postBodyText = encodeURIComponent(
            $(document.getElementById("post-body-tab").getElementsByClassName("post-body-pre-block")[0].innerText).text()
        );

        // make a GET request to the ChatGPT detector
        // TODO: do some kind of error handling if we get an error here
        $.get(`https://openai-openai-detector.hf.space/?${postBodyText}`, (data, status) => {
            // multiply by 100 to get a percent (instead of a decimal), and round it to two decimal places
            const gptProbability = Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(
                data.fake_probability * 100
            );

            // and display the result to the user
            alert(`ChatGPT likelyhood for this post is ${gptProbability}% per huggingface`);
        })
    });

    // actually add the button to the page
    document.getElementsByClassName("post-body-hr-separator")[0].insertAdjacentElement("afterend", button);
})();
