const numberOfQuestionsDropdown = document.getElementById("number-of-questions")
const topicsDropdown = document.getElementById("topic-of-questions")
const difficultyDropdown = document.getElementById("difficulty-of-questions")

export const topicOptions = {
    C: "C.json",
    Cpp: "C++.json",
    Css: "Css.json",
    DSA: "DSA.json",
    HTML: "HTML.json",
    Java: "Java.json",
    Javascript: "Javascript.json",
    Python: "Python.json"
}

export const questionNumbers = {
    Five: "5",
    Ten: "10",
    Fifteen: "15",
    Twenty: "20",
    Twentyfive: "25",
    Thirty: "30"
}

export const difficulty = {
    Easy: '40',
    Medium: '25',
    Hard: '10'
}

export const renderDropdowns = () => {
    addToDropdown(questionNumbers, numberOfQuestionsDropdown)
    addToDropdown(topicOptions, topicsDropdown)
    addToDropdown(difficulty, difficultyDropdown)
}

function addToDropdown(object, dropdown) {
    for (var i = 0; i < Object.keys(object).length; i++) {
        let option = document.createElement("option")
        option.innerText = Object.keys(object)[i]
        dropdown.appendChild(option)
    }
}

// This module contains all information for dropdowns at the beginning of our app
// import any info needed about the dropdown info from this file