const startbtn = document.getElementById('start')
const app = document.getElementById('quiz-container')
const questionSpace = document.getElementById('question')
const codeSpace = document.getElementById('codeSpace')
const code = document.getElementById('code')
const nextQues = document.getElementById('next-btn')
const prevQues = document.getElementById('previous-btn')
const begin = document.getElementById('start-container')
const end = document.getElementById('report-container')
let correctOut = document.getElementById('correct')
let incorrectOut = document.getElementById('incorrect')
let timerTakenOut = document.getElementById('time-taken')
let report = document.getElementById('report')
let numberOfQuestionsReport = document.getElementById("number-of-questions-report")
const optionsContainer = document.getElementById('options-div')
const muteButton = document.getElementById('mute-btn')
const reportButton = document.getElementById('report-btn')
const practiceButton = document.getElementById('practice-btn')
const logo = document.getElementById('logo')

let pop = new Audio('./audio/pop.mp3')
let tick = new Audio('./audio/Tick.mp3')
pop.volume = 0.2
tick.volume = 0.5

const topicOptions = {
    C: "C.json",
    Cpp: "C++.json",
    Css: "Css.json",
    DSA: "DSA.json",
    HTML: "HTML.json",
    Java: "Java.json",
    Javascript: "Javascript.json",
    Python: "Python.json"
}

// Getting Data of questions from json
async function fetchJSONData(name) {
    let fileName = "./Questions-Folder/" + name + ".json"
    let res = await fetch(fileName)
    return await res.json()
}

// Initializing App variables
let jsonData
let numberOfQuestions
let topic
let correct = 0
let qNo = 0
let answerArray = []
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
    window.location.href = window.location.pathname + '/reports.html'
})

practiceButton.addEventListener('click', () => {
    window.location.href = window.location.pathname + '/practice.html'
})

logo.addEventListener('click', home)

function playSound(sound) {
    if (soundsOn) {
        sound.play()
    }
}

startbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    begin.classList.add('hide')
    playSound(pop)
    start()
})

function home() {
    window.location.href = window.location.pathname + '/'
}

async function start() {
    await getDetails()
    quiz()
}

function quiz() {
    nextQues.addEventListener("click", nextQuesFunction)
    prevQues.addEventListener("click", prevQuesFunction)
    getquestion()
}

function nextQuesFunction() {
    playSound(pop)
    if (qNo!==49) {
        inputAnswer()
        qNo++
        getquestion()
    }
    else{
        quizEnd()
    }
}

function prevQuesFunction() {
    playSound(pop)
    if (qNo!==0) {
        inputAnswer()
        qNo--
        getquestion()
    }
    else console.log('cant go below that')
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
    app.classList.add('hide')
    end.classList.remove('hide')
    getResults()
    displayCurrResult()
}

function getResults() {
    report.innerHTML = ''
    for (var i = 0; i < numberOfQuestions; i++) {
        if (jsonData.questions[i].answer == answerArray[i]) {
            correct++
        } else {
            let questionNo = document.createElement('p')
            let strongQuestionNo = document.createElement('strong')
            strongQuestionNo.innerHTML = 'Question ' + (i + 1)
            let questionout = document.createElement('p')
            questionout.innerHTML = jsonData.questions[i].question
            let yourAnswertxt = document.createElement('p')
            yourAnswertxt.innerHTML = 'your answer: '
            let crrAnswertxt = document.createElement('p')
            crrAnswertxt.innerHTML = 'correct answer: '
            let yourAnswer = document.createElement('span')
            if (answerArray[i] == -1) {
                yourAnswer.innerHTML = 'Question not answered'
            }
            else {
                yourAnswer.innerHTML = jsonData.questions[i].options[answerArray[i]]
            }
            yourAnswer.classList.add('incorrect')
            let crrAnswer = document.createElement('span')
            crrAnswer.innerHTML = jsonData.questions[i].options[jsonData.questions[i].answer]
            crrAnswer.classList.add('correct')
            let hr = document.createElement('hr')

            questionNo.appendChild(strongQuestionNo)
            yourAnswertxt.appendChild(yourAnswer)
            crrAnswertxt.appendChild(crrAnswer)

            report.appendChild(questionNo)
            report.appendChild(questionout)
            if (Object.keys(jsonData.questions[i]).length == 5) {
                let preout = document.createElement('pre')
                let codeout = document.createElement('code')
                codeout.innerHTML = jsonData.questions[i].code
                preout.appendChild(codeout)
                report.appendChild(preout)
            }
            report.appendChild(yourAnswertxt)
            report.appendChild(crrAnswertxt)
            report.appendChild(hr)
        }
    }
}

function displayCurrResult() {
    correctOut.innerHTML = correct
    incorrectOut.innerHTML = numberOfQuestions - correct
    numberOfQuestionsReport.innerHTML = numberOfQuestions
}

function getquestion() {
    codeSpace.classList.add('hide')
    questionSpace.innerHTML = jsonData.questions[qNo].question
    if (Object.keys(jsonData.questions[qNo]).length == 5) {
        codeSpace.classList.remove('hide')
        code.innerHTML = jsonData.questions[qNo].code
    }

    optionsContainer.innerHTML = ''
    for (var i = 0; i < jsonData.questions[qNo].options.length; i++) {
        let radioDiv = document.createElement('div')
        radioDiv.setAttribute('class', 'radio-div')
        let idName = 'radio-div-' + i
        radioDiv.setAttribute('id', idName)
        radioDiv.setAttribute('onclick', 'flip(this.id)')
        let inputTag = document.createElement('input')
        inputTag.setAttribute('type', 'radio')
        inputTag.setAttribute('name', 'mcq')
        let idNameInput = 'radio-' + i
        inputTag.setAttribute('id', idNameInput)
        let labelTag = document.createElement('label')
        labelTag.innerHTML = jsonData.questions[qNo].options[i]

        radioDiv.appendChild(inputTag)
        radioDiv.appendChild(labelTag)
        optionsContainer.appendChild(radioDiv)
    }
    activate()
}

function activate() {
    if (answerArray[qNo] == '0') {
        getRadio(0).checked = true
        getRadio(0).parentElement.classList.add('selected')
    }
    else if (answerArray[qNo] == '1') {
        getRadio(1).checked = true
        getRadio(1).parentElement.classList.add('selected')
    }
    else if (answerArray[qNo] == '2') {
        getRadio(2).checked = true
        getRadio(2).parentElement.classList.add('selected')
    }
    else if (answerArray[qNo] == '3') {
        getRadio(3).checked = true
        getRadio(3).parentElement.classList.add('selected')
    } else {
        getRadio(3).checked = true
        getRadio(3).checked = false
    }
}

async function getDetails() {
    topic = "C"
    jsonData = await fetchJSONData(topic)
    numberOfQuestions = jsonData.questions.length
}

function getRadio(a) {
    return optionsContainer.children[a].firstChild
}