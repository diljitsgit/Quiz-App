import { playSound, pop, tick } from "./audio.js";

let numberOfQuestionsReport = document.getElementById("number-of-questions-report")
let topicReport = document.getElementById("topic-of-questions-report")
let difficultyReport = document.getElementById("difficulty-report")
let correctOut = document.getElementById('correct')
let incorrectOut = document.getElementById('incorrect')
let timerTakenOut = document.getElementById('time-taken')
let report = document.getElementById('report')
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')

let exportResult
let reportNo = 0

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

export function displayCurrResult(corr, noOfQues, timeTake, topi, difficultyDD) {
    correctOut.innerHTML = corr
    incorrectOut.innerHTML = noOfQues - corr
    timerTakenOut.innerHTML = timeTakenConvertUnits(timeTake)
    topicReport.innerHTML = topi
    numberOfQuestionsReport.innerHTML = noOfQues
    difficultyReport.innerHTML = difficultyDD.value

    exportResult = {
        reportKey: report.innerHTML,
        correctKey: corr,
        incorrectKey: noOfQues - corr,
        timeTakenKey: timeTake,
        topicKey: topi,
        numberOfQuestionsKey: noOfQues,
        difficultyKey: difficultyDD.value
    }
    storeResult()
}

function storeResult() {
    localStorage.setItem(localStorage.length, JSON.stringify(exportResult))
    reportNo = localStorage.length - 1
}

export function timeTakenConvertUnits(t) {
    if (t > 60) {
        return (Math.floor(t / 60)) + ' minute and ' + t % 60 + ' seconds'
    } else return t + ' seconds'
}