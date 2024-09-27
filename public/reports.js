import {timeTakenConvertUnits} from "./result-storing.js";
import { playSound, pop } from "./audio.js";

let numberOfQuestionsReport = document.getElementById("number-of-questions-report")
let topicReport = document.getElementById("topic-of-questions-report")
let difficultyReport = document.getElementById("difficulty-report")
let correctOut = document.getElementById('correct')
let incorrectOut = document.getElementById('incorrect')
let timerTakenOut = document.getElementById('time-taken')
let TakeQuizbtn = document.getElementById('Take-Quiz')
let report = document.getElementById('report')
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')

let reportNo = localStorage.length - 1
export let soundsOn = true;

export function setSoundsOn() {
    soundsOn = (!soundsOn)
}

logo.addEventListener('click', home)
TakeQuizbtn.addEventListener('click', home)

function home() {
    window.location.href = '/'
}

prevResult.addEventListener("click", () => {
    playSound(pop)
    if (reportNo == 0) {
        prevResult.classList.add('hide')
    }
    else {
        prevResult.classList.remove('hide')
        currResult.classList.remove('hide')
        reportNo--
        if (reportNo == 0) {
            prevResult.classList.add('hide')
        }
        let data = JSON.parse(localStorage.getItem(reportNo))
        report.innerHTML = data.reportKey
        correctOut.innerHTML = data.correctKey
        incorrectOut.innerHTML = data.incorrectKey
        timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
        topicReport.innerHTML = data.topicKey
        numberOfQuestionsReport.innerHTML = data.numberOfQuestionsKey
        difficultyReport.innerHTML = data.difficultyKey
    }
})

currResult.addEventListener("click", () => {
    playSound(pop)
    if (reportNo == localStorage.length - 1) {
        currResult.classList.add('hide')
    } else {
        prevResult.classList.remove('hide')
        currResult.classList.remove('hide')
        reportNo++
        if (reportNo == localStorage.length - 1) {
            currResult.classList.add('hide')
        }
        let data = JSON.parse(localStorage.getItem(reportNo))
        report.innerHTML = data.reportKey
        correctOut.innerHTML = data.correctKey
        incorrectOut.innerHTML = data.incorrectKey
        timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
        topicReport.innerHTML = data.topicKey
        numberOfQuestionsReport.innerHTML = data.numberOfQuestionsKey
        difficultyReport.innerHTML = data.difficultyKey
    }
})

function initalize() {
    if (localStorage.length!==0) {
        document.getElementById('report-container-2').classList.add('hide')
        document.getElementById('report-container').classList.remove('hide')
        let data = JSON.parse(localStorage.getItem(reportNo))
        report.innerHTML = data.reportKey
        correctOut.innerHTML = data.correctKey
        incorrectOut.innerHTML = data.incorrectKey
        timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
        topicReport.innerHTML = data.topicKey
        numberOfQuestionsReport.innerHTML = data.numberOfQuestionsKey
        difficultyReport.innerHTML = data.difficultyKey
    }
    else{
        console.log('hello')
    }
}

initalize()