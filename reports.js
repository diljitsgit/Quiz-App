const muteButton = document.getElementById('mute-btn')
const reportButton = document.getElementById('report-btn')
const logo = document.getElementById('logo')
let correctOut = document.getElementById('correct')
let incorrectOut = document.getElementById('incorrect')
let timerTakenOut = document.getElementById('time-taken')
let report = document.getElementById('report')
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')
let numberOfQuestionsReport = document.getElementById("number-of-questions-report")
let topicReport = document.getElementById("topic-of-questions-report")
let difficultyReport = document.getElementById("difficulty-report")

let pop = new Audio('./audio/pop.mp3')
let tick = new Audio('./audio/Tick.mp3')
pop.volume = 0.2
tick.volume = 0.5

let reportNo = localStorage.length-1
let soundsOn = true

muteButton.addEventListener("click", () => {
    playSound(pop)
    if (soundsOn) {
        soundsOn = false
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_mute</span>'
    }
    else {
        soundsOn = true
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_up</span>'
    }
})

reportButton.addEventListener('click', () => {
    window.location.href = '/reports.html'
})

function playSound(sound) {
    if (soundsOn) {
        sound.play()
    }
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

logo.addEventListener('click', home)

function home() {
    window.location.href = '/'
}

function timeTakenConvertUnits(t) {
    if (t > 60) {
        return (Math.floor(t / 60)) + ' minute and ' + t % 60 + ' seconds'
    } else return t + ' seconds'
}

function initalize() {
    let data = JSON.parse(localStorage.getItem(reportNo))
    report.innerHTML = data.reportKey
    correctOut.innerHTML = data.correctKey
    incorrectOut.innerHTML = data.incorrectKey
    timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
    topicReport.innerHTML = data.topicKey
    numberOfQuestionsReport.innerHTML = data.numberOfQuestionsKey
    difficultyReport.innerHTML = data.difficultyKey
}

initalize()