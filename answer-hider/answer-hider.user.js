// ==UserScript==
// @name         Answer hider
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  try to take over the world!
// @author       cocomac
// @match        https://*.stackexchange.com/questions/*
// @match        https://*.stackoverflow.com/questions/*
// @match        https://*.superuser.com/questions/*
// @match        https://*.serverfault.com/questions/*
// @match        https://*.askubuntu.com/questions/*
// @match        https://*.stackapps.com/questions/*
// @match        https://*.mathoverflow.net/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @supportURL   https://stackapps.com/questions/10729/answer-hider-adds-box-and-buttons-to-hide-answers-on-posts
// ==/UserScript==


(() => {
    'use strict';

    $(() => {
        if ((/^https:\/\/[A-Za-z\.]{2,}\/questions\/[0-9]/).test(window.location.toString())) {
            // note: f72479cc is an arbitrary prefix from uuidgen to avoid collisions
            $.get("https://cdn.sstatic.net/Img/stacks-icons/TrashSM.svg", (VISIBLE) => {
                $.get("https://cdn.sstatic.net/Img/stacks-icons/PromotedSM.svg", (HIDDEN) => {
                    $.get("https://cdn.sstatic.net/Img/stacks-icons/Download.svg", (SAVE) => {
                        const ANSWER_SUMMARY_LEN = 64;
                        window.f72479cc_hideAnswer = (answer_id) => {
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                if (search.item(i).getAttribute("data-answerid") == answer_id) {
                                    search.item(i).children[0].style.display = "none";
                                    search.item(i).children[1].style.display = "block";
                                    updateLabel(answer_id);
                                }
                            }
                        };
                        window.f72479cc_showAnswer = (answer_id) => {
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                if (search.item(i).getAttribute("data-answerid") == answer_id) {
                                    search.item(i).children[0].style.display = "grid";
                                    search.item(i).children[1].style.display = "none";
                                    updateLabel(answer_id);
                                }
                            }
                        };

                        const getAnswers = () => {
                            let answers = [];
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                answers.push({
                                    "id": search.item(i).getAttribute("data-answerid"),
                                    "score": search.item(i).getAttribute("data-score"),
                                    "text": search.item(i).children[0].children[1].innerText,
                                    "username": search.item(i).children[0].children[1].children[1].children[0].children[2].children[0].children[2].children[0].innerText
                                })
                            }
                            return answers;
                        }

                        const isHidden = (answer_id) => {
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                if (search.item(i).getAttribute("data-answerid") == answer_id) {
                                    return search.item(i).children[0].style.display === "none";
                                }
                            }
                        }

                        const updateLabel = (answer_id) => {
                            document.getElementById(`f72479cc_${answer_id}`).innerHTML = isHidden(answer_id) ? HIDDEN : VISIBLE;
                        }

                        const renderAnswer = (answer) => {
                            return `${getSummary(answer)} <button class="s-btn s-btn__muted s-btn__outlined s-btn__xs" id="f72479cc_${answer.id}" onclick="window.parent.f72479cc_toggle(${answer.id}, true)">${VISIBLE}</button>`;
                        }

                        window.f72479cc_toggle = (answer_id, do_update) => {
                            if (isHidden(answer_id)) {
                                window.parent.f72479cc_showAnswer(answer_id);
                            } else {
                                window.parent.f72479cc_hideAnswer(answer_id);
                            }
                            document.getElementById(`f72479cc_${answer_id}`)
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                if (search.item(i).getAttribute("data-answerid") == answer_id) {
                                    if (do_update) {
                                        updateLabel(answer_id);
                                    }
                                    return search.item(i).children[0].style.display === "none";
                                }
                            }
                        }
                        const sanitize = (x) => {
                            return x.replaceAll(/[^a-zA-Z0-9,\.]/g, " ").replaceAll(/ {2,}/g, " ")
                        }

                        /**
                         * Summarizes an answer (e.g., from `getAnswers()`)
                         */
                        const getSummary = (answer) => {
                            return `(${answer.score} ~ ${sanitize(answer.username)}) - "${sanitize(answer.text.substring(0, ANSWER_SUMMARY_LEN))}&hellip;"`
                        }

                        /**
                         * Crates the list (under '_n_ Answers') of answers listed on the page
                         */
                        const generateTable = () => {
                            let list = document.createElement("ul");
                            list.style.marginLeft = "0";
                            list.id = "f72479cc_table";
                            getAnswers().map(e => renderAnswer(e)).forEach((e) => {
                                let item = document.createElement("li");
                                item.style.listStyleType = "none";
                                item.innerHTML = e;
                                list.appendChild(item);
                            });

                            let saveBtn = document.createElement("button");
                            saveBtn.onclick = () => {
                                const storedData = localStorage.getItem("f72479cc_save");
                                console.log(storedData);
                                let savedAnswers = storedData != null ? JSON.parse(storedData) : { "data": [] };
                                getAnswers().filter(e => isHidden(e.id)).forEach((e) => {
                                    savedAnswers.data.push(e.id);
                                });
                                localStorage.setItem("f72479cc_save", JSON.stringify(savedAnswers));
                            };
                            saveBtn.innerHTML = `${SAVE} Save hidden posts`;
                            ["s-btn", "s-btn__outlined"].forEach((e) => {
                                saveBtn.classList.add(e);
                            });
                            let sep = document.createElement("hr");
                            [list, saveBtn, sep].forEach((e) => {
                                document.getElementById("answers-header").appendChild(e);
                            });

                        }

                        const getAnswerById = (search_id) => {
                            return getAnswers().find((e) => e.id == search_id);
                        }

                        const addHideBtn = () => {
                            let search = document.getElementsByClassName("answer");
                            for (let i = 0; i < search.length; ++i) {
                                const id = search.item(i).getAttribute("data-answerid");
                                let btn = document.createElement("button");
                                btn.classList.add("s-btn");
                                btn.classList.add("s-btn__muted");
                                btn.onclick = () => {
                                    window.parent.f72479cc_toggle(id);
                                    document.getElementById(`f72479cc_${id}`).innerHTML = HIDDEN;
                                };
                                btn.innerHTML = VISIBLE;
                                search.item(i).children[0].children[0].children[0].appendChild(btn);


                                let x = document.createElement("div");
                                x.id = "altPlaceholder"
                                x.style.display = "none";
                                x.innerHTML = `${getSummary(getAnswerById(id))} <button class="s-btn s-btn__muted s-btn__outlined" onclick="f72479cc_showAnswer(${id});">${HIDDEN}</button>`;
                                search.item(i).appendChild(x);
                            }
                        }

                        const init = () => {
                            generateTable();
                            addHideBtn();

                            const savedData = localStorage.getItem("f72479cc_save");
                            if (savedData != null) {
                                JSON.parse(savedData).data.forEach((e) => {
                                    window.parent.f72479cc_hideAnswer(e);
                                })
                            }
                        };

                        init();
                    }, "text");
                }, "text");
            }, "text");
        }
    });
})();
