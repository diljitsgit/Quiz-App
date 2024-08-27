const startbtn = document.getElementById('start')
const restartbtn = document.getElementById('restart')
const app = document.getElementById('quiz-container')
const questionSpace = document.getElementById('question')
const codeSpace = document.getElementById('codeSpace')
const code = document.getElementById('code')
const nextQues = document.getElementById('next-btn')
const prevQues = document.getElementById('previous-btn')
const radio1 = document.getElementById('radio1')
const radio2 = document.getElementById('radio2')
const radio3 = document.getElementById('radio3')
const radio4 = document.getElementById('radio4')
const radio1txt = document.getElementById('radio1txt')
const radio2txt = document.getElementById('radio2txt')
const radio3txt = document.getElementById('radio3txt')
const radio4txt = document.getElementById('radio4txt')
const begin = document.getElementById('start-container')
const end = document.getElementById('report-container')
const correctOut = document.getElementById('correct')
const incorrectOut = document.getElementById('incorrect')
const timerTakenOut = document.getElementById('time-taken')
const report = document.getElementById('report')
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')

const numberOfQuestionsDropdown = document.getElementById("number-of-questions");
const topicsDropdown = document.getElementById("topic-of-questions");
const difficultyDropdown = document.getElementById("difficulty-of-questions");

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

const questionNumbers = {
    Five: "5",
    Ten: "10",
    Fifteen: "15",
    Twenty: "20",
    Twentyfive: "25",
    Thirty: "30"
}

const difficulty = {
    Easy: '40',
    Medium: '25',
    Hard: '10'
}

const renderStart = () => {
    addToDropdown(questionNumbers, numberOfQuestionsDropdown)
    addToDropdown(topicOptions, topicsDropdown)
    addToDropdown(difficulty, difficultyDropdown)
}
renderStart()

function addToDropdown(object, dropdown) {
    for (var i = 0; i < Object.keys(object).length; i++) {
        let option = document.createElement("option")
        option.innerText = Object.keys(object)[i]
        dropdown.appendChild(option)
    }
}

// Getting Data of questions from json
async function fetchJSONData(name) {
    let fileName = "./Questions-Folder/" + name + ".json"
    let res = await fetch(fileName)
    return await res.json()
}

// Initializing App variables
let jsonData
let timePerQuestion
let numberOfQuestions
let exportResult
let timetaken = 0
let finalMessage
let correct = 0
let timer
let qNo = 0
let questionArray = []
let timerArray = []
let answerArray = []


prevResult.addEventListener("click", () => {
    report.innerHTML = localStorage.getItem('report')
    prevResult.classList.add('hide')
    currResult.classList.remove('hide')
})

currResult.addEventListener("click", () => {
    displayCurrResult()
    prevResult.classList.remove('hide')
    currResult.classList.add('hide')
})

startbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    begin.classList.add('hide')
    start()
})

restartbtn.addEventListener("click", () => {
    storeResult()
    app.classList.remove('hide')
    end.classList.add('hide')
    qNo = 0
    timetaken = 0
    correct = 0
    finalMessage = ""
    createTimerArray()
    start()
})



async function start() {
    prevResult.classList.remove('hide')
    currResult.classList.add('hide')
    await getDetails()
    createShuffleArr()
    createTimerArray()
    getquestion()
}

function quiz() {
    ticktock()
    nextQues.addEventListener("click", nextQuesFunction)
    prevQues.addEventListener("click", prevQuesFunction)
    if (qNo == numberOfQuestions - 1 && timerArray[qNo] == 0) {
        quizEnd()
    }
    else if (timerArray[qNo] == 0) {
        qNo++
        qNo = goToNextValidQuestion()
        getquestion()
    }
}

function ticktock() {
    timerArray[qNo]--
    timetaken++
    document.getElementById('timer').innerHTML = timerArray[qNo]
}

function nextQuesFunction() {
    inputAnswer()
    if (qNo == numberOfQuestions - 1) {
        quizEnd()
    }
    else {
        qNo++
        qNo = goToNextValidQuestion()
        input.value = ""
        document.getElementById('input-container').classList.add('hide')
        document.getElementById('options-div').classList.add('hide')
        getquestion()
    }
}

function prevQuesFunction() {
    inputAnswer()
    if (qNo != 0) {
        qNo--
        qNo = goToPrevValidQuestion()
        input.value = ""
        document.getElementById('input-container').classList.add('hide')
        document.getElementById('options-div').classList.add('hide')
        getquestion()
    }
}

function inputAnswer() {
    if (getQuestionType(qNo) == 'mcq') {
        answerArray[qNo] = checkRadio()
    }
    else {
        if (input.value != '') {
            answerArray[qNo] = input.value
        }
    }
}

function checkRadio() {
    if (radio1.checked) {
        return 0
    }
    else if (radio2.checked) {
        return 1
    }
    else if (radio3.checked) {
        return 2
    }
    else if (radio4.checked) {
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
    getResults()
    displayCurrResult()
}

function getResults() {
    for (var i = 0; i < numberOfQuestions; i++) {
        if (jsonData.questions[questionArray[i]].answer == answerArray[i]) {
            correct++
        } else {
            let questionNo = document.createElement('p')
            let strongQuestionNo = document.createElement('strong')
            strongQuestionNo.innerHTML = 'Question ' + (i + 1)
            let questionout = document.createElement('p')
            questionout.innerHTML = jsonData.questions[questionArray[i]].question
            let yourAnswertxt = document.createElement('p')
            yourAnswertxt.innerHTML = 'your answer: '
            let crrAnswertxt = document.createElement('p')
            crrAnswertxt.innerHTML = 'correct answer: '
            let yourAnswer = document.createElement('span')
            if (answerArray[i] == -1) {
                yourAnswer.innerHTML = 'Question not answered'
            }
            else {
                yourAnswer.innerHTML = jsonData.questions[questionArray[i]].options[answerArray[i]]
            }
            yourAnswer.classList.add('incorrect')
            let crrAnswer = document.createElement('span')
            crrAnswer.innerHTML = jsonData.questions[questionArray[i]].options[jsonData.questions[questionArray[i]].answer]
            crrAnswer.classList.add('correct')
            let hr = document.createElement('hr')
            
            questionNo.appendChild(strongQuestionNo)
            yourAnswertxt.appendChild(yourAnswer)
            crrAnswertxt.appendChild(crrAnswer)
            
            report.appendChild(questionNo)
            report.appendChild(questionout)
            if (Object.keys(jsonData.questions[questionArray[i]]).length == 5) {
                console.log('hello')
                let preout = document.createElement('pre')
                let codeout = document.createElement('code')
                codeout.innerHTML = jsonData.questions[questionArray[i]].code
                preout.appendChild(codeout)
                report.appendChild(preout)
            }
            report.appendChild(yourAnswertxt)
            report.appendChild(crrAnswertxt)
            report.appendChild(hr)
        }
    }
    exportResult = report.innerHTML
}

function displayCurrResult() {
    correctOut.innerHTML = correct
    incorrectOut.innerHTML = numberOfQuestions - correct
    timerTakenOut.innerHTML = timetaken
    storeResult()
}

function storeResult() {
    localStorage.setItem('report', exportResult)
}

function getquestion() {
    timerReset()
    activate()
    document.getElementById('input-container').classList.add('hide')
    document.getElementById('options-div').classList.add('hide')
    document.getElementById('radioDiv3').classList.remove('hide')
    document.getElementById('radioDiv4').classList.remove('hide')
    codeSpace.classList.add('hide')
    questionSpace.innerHTML = jsonData.questions[questionArray[qNo]].question
    if (Object.keys(jsonData.questions[questionArray[qNo]]).length == 5) {
        codeSpace.classList.remove('hide')
        code.innerHTML = jsonData.questions[questionArray[qNo]].code
    }

    if (getQuestionType(qNo) == 'mcq') {
        document.getElementById('options-div').classList.remove('hide')
        radio1txt.innerHTML = jsonData.questions[questionArray[qNo]].options[0]
        radio2txt.innerHTML = jsonData.questions[questionArray[qNo]].options[1]

        if (jsonData.questions[questionArray[qNo]].options[2] != '') {
            radio3txt.innerHTML = jsonData.questions[questionArray[qNo]].options[2]
        }
        else {
            document.getElementById('radioDiv3').classList.add('hide')
        }
        if (jsonData.questions[questionArray[qNo]].options[3] != '') {
            radio4txt.innerHTML = jsonData.questions[questionArray[qNo]].options[3]
        }
        else {
            document.getElementById('radioDiv4').classList.add('hide')
        }
    }
    else {
        document.getElementById('input-container').classList.remove('hide')
    }
    document.getElementById('timer').innerHTML = timerArray[qNo]
}


function createShuffleArr() {
    for (var i = 0; i < jsonData.questions.length; i++) {
        questionArray.push(i)
    }
    for (let i = questionArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const jsonData = questionArray[i];
        questionArray[i] = questionArray[j];
        questionArray[j] = jsonData;
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

function getQuestionType(p) {
    return jsonData.questions[questionArray[p]].type
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

function activate() {
    if (getQuestionType(qNo) == 'mcq') {
        if (answerArray[qNo] == '1') {
            radio1.checked = true;
        }
        else if (answerArray[qNo] == '2') {
            radio2.checked = true;
        }
        else if (answerArray[qNo] == '3') {
            radio3.checked = true;
        }
        else if (answerArray[qNo] == '4') {
            radio4.checked = true;
        }else{
            radio4.checked = true;
            radio4.checked = false;
        }
    }
    else {
        input.value = answerArray[qNo]
    }
}

function timerReset() {
    if (timer) {
        clearInterval(timer)
    }
    timer = setInterval(quiz, 1000)
}

async function getDetails() {
    numberOfQuestions = questionNumbers[numberOfQuestionsDropdown.value]
    timePerQuestion = difficulty[difficultyDropdown.value]
    jsonData = await fetchJSONData(topicsDropdown.value)
}