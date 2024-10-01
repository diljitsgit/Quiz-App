import { playSound, pop, tick ,soundsOn} from "./audio.js";
import { renderDropdowns, topicOptions, questionNumbers, difficulty } from "./initalize-dropdown.js";
import { fetchJSONData } from "./get-json.js";
import { getquestion, getRadio } from "./get-question.js";
import { displayCurrResult } from "./result-storing.js";
import { getResults } from "./get-result.js";

const startbtn = document.getElementById('start')
const restartbtn = document.getElementById('restart')
const closeModal = document.getElementById('close-modal')
const restartConfirmbtn = document.getElementById('restart-confirm')
const homeConfirmbtn = document.getElementById('home-confirm')
const app = document.getElementById('quiz-container')
const nextQues = document.getElementById('next-btn')
const prevQues = document.getElementById('previous-btn')
const begin = document.getElementById('start-container')
const end = document.getElementById('report-container')
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')

const numberOfQuestionsDropdown = document.getElementById("number-of-questions")
const topicsDropdown = document.getElementById("topic-of-questions")
const difficultyDropdown = document.getElementById("difficulty-of-questions")

const downloadPDF = document.getElementById("download")

renderDropdowns()



// Initializing App variables
let timePerQuestion
let topic
let timetaken = 0
let correct = 0
let timer
let questionArray = []
let timerArray = []
let exportPDF = ''

// is it more viable to add all export elements to a single object?

export let numberOfQuestions
export let jsonData
export let qNo = 0
export let answerArray = []

export function setCorrect(value){
    correct = value;
}

startbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    begin.classList.add('hide')
    playSound(pop)
    start()
})

restartConfirmbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    end.classList.add('hide')
    qNo = 0
    timetaken = 0
    correct = 0
    document.getElementById('restart-modal').classList.add('hide')
    createTimerArray()
    playSound(pop)
    start()
})

export function timerReset() {
    if (timer) {
        clearInterval(timer)
    }
    timer = setInterval(quiz, 1000)
}

restartbtn.addEventListener('click', () => {
    document.getElementById('restart-modal').classList.remove('hide')
})

closeModal.addEventListener('click', () => {
    document.getElementById('restart-modal').classList.add('hide')
})

homeConfirmbtn.addEventListener('click', ()=>{
    window.location.href = window.location.pathname
})

async function start() {
    prevResult.classList.remove('hide')
    currResult.classList.add('hide')
    await getDetails()
    createShuffleArr()
    createTimerArray()
    timerReset()
    getquestion(questionArray[qNo], timerArray[qNo], answerArray[qNo])
}

export function quiz() {
    ticktock()
    nextQues.addEventListener("click", nextQuesFunction)
    prevQues.addEventListener("click", prevQuesFunction)
    if (qNo == numberOfQuestions - 1 && timerArray[qNo] == 0) {
        quizEnd()
    }
    else if (timerArray[qNo] == 0) {
        qNo++
        qNo = goToNextValidQuestion()
        timerReset()
        getquestion(questionArray[qNo], timerArray[qNo], answerArray[qNo])
    }
}

function ticktock() {
    playSound(tick)
    timerArray[qNo]--
    timetaken++
    if (timerArray[qNo] <= 5) {
        document.getElementById('timer').classList.add('red')
    } else {
        document.getElementById('timer').classList.remove('red')
    }
    document.getElementById('timer').innerHTML = timerArray[qNo]
}

function nextQuesFunction() {
    playSound(pop)
    inputAnswer()
    if (qNo == numberOfQuestions - 1) {
        quizEnd()
    }
    else {
        qNo++
        qNo = goToNextValidQuestion()
        timerReset()
        getquestion(questionArray[qNo], timerArray[qNo], answerArray[qNo])
    }
}

function prevQuesFunction() {
    inputAnswer()
    if (qNo != 0) {
        qNo--
        qNo = goToPrevValidQuestion()
        timerReset()
        getquestion(questionArray[qNo], timerArray[qNo], answerArray[qNo])
    }
    playSound(pop)
}

function inputAnswer() {
    answerArray[qNo] = checkRadio()
}

function checkRadio() {
    if (getRadio(0).checked) {
        return 0
    }
    else if (getRadio(1).checked) {
        return 1
    }
    else if (getRadio(2).checked) {
        return 2
    }
    else if (getRadio(3).checked) {
        return 3
    }
    else {
        return -1
    }
}

function quizEnd() {
    if (timer) {
        clearInterval(timer)
    }
    app.classList.add('hide')
    end.classList.remove('hide')
    getResults(questionArray, answerArray, numberOfQuestions)
    displayCurrResult(correct, numberOfQuestions, timetaken, topic, difficultyDropdown)
}

function createShuffleArr() {
    for (var i = 0; i < jsonData.questions.length; i++) {
        questionArray.push(i)
    }
    for (let i = questionArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const jsonData = questionArray[i]
        questionArray[i] = questionArray[j]
        questionArray[j] = jsonData
    }
}

function createTimerArray() {
    if (timerArray.length > 0) {
        for (var i = 0; i < numberOfQuestions; i++) {
            timerArray[i] = timePerQuestion
        }
    }
    else {
        for (var i = 0; i < numberOfQuestions; i++) {
            timerArray.push(timePerQuestion)
        }
    }
    if (timerArray.length > 0) {
        for (var i = 0; i < numberOfQuestions; i++) {
            answerArray[i] = ''
        }
    }
    else {
        for (var i = 0; i < numberOfQuestions; i++) {
            answerArray.push('')
        }
    }
}

function goToPrevValidQuestion() {
    if (timerArray[qNo] == 0) {
        qNo--
        return goToPrevValidQuestion()
    }
    else { return qNo }
}

function goToNextValidQuestion() {
    if (timerArray[qNo] == 0) {
        qNo++
        return goToNextValidQuestion()
    }
    else { return qNo }
}

async function getDetails() {
    numberOfQuestions = questionNumbers[numberOfQuestionsDropdown.value]
    timePerQuestion = difficulty[difficultyDropdown.value]
    topic = topicsDropdown.value
    jsonData = await fetchJSONData(topicsDropdown.value)
}

downloadPDF.addEventListener("click", async () => {
    exportPDF = ''

    exportPDF += '<p><strong>Number of questions: </strong>' + questionNumbers[numberOfQuestionsDropdown.value] + '</p><br>'
    exportPDF += '<p><strong>Topic of questions: </strong>' + topicsDropdown.value + '</p><br>'
    exportPDF += '<p><strong>Difficulty of questions: </strong>' + difficultyDropdown.value + '</p><br>'
    let tempJSON = await fetchJSONData(topicsDropdown.value)
    for (var i = 0; i < questionNumbers[numberOfQuestionsDropdown.value]; i++) {
        let exportQuestionDiv = document.createElement('div')
        exportQuestionDiv.classList.add('questionSpace')
        let exportQuestion = document.createElement('p')
        exportQuestion.classList.add('question')
        exportQuestion.innerHTML = tempJSON.questions[i].question
        exportQuestionDiv.appendChild(exportQuestion)
        exportPDF += '<strong>Question ' + (i + 1) + ':</strong><br>' + exportQuestionDiv.outerHTML


        if (Object.keys(tempJSON.questions[i]).length == 5) {
            let exportCodeDiv = document.createElement('div')
            exportCodeDiv.classList.add('codeSpace')
            let exportCodePre = document.createElement('pre')
            let exportCodeCode = document.createElement('code')
            exportCodeCode.innerHTML = tempJSON.questions[i].code
            exportCodePre.style.padding = '0rem 1rem'
            exportCodePre.appendChild(exportCodeCode)
            exportCodeDiv.appendChild(exportCodePre)
            exportPDF += '<br>' + exportCodeDiv.outerHTML
        }

        for (var j = 0; j < tempJSON.questions[i].options.length; j++) {
            let optionsExportDiv = document.createElement('div')
            optionsExportDiv.setAttribute('class', 'radio-div')
            let labelTag = document.createElement('label')
            labelTag.innerHTML = tempJSON.questions[i].options[j]
            optionsExportDiv.appendChild(labelTag)
            exportPDF += '<div class="export-radio-div">' + labelTag.outerHTML + '</div>'
        }

        exportPDF += '<br><br>'
    }
    var opt = {
        margin: 1,
        filename: 'Quiz-app-result.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().set({
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    })
    html2pdf().from(exportPDF).set(opt).save()
    playSound(pop)
})