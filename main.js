const startbtn = document.getElementById('start')
const restartbtn = document.getElementById('restart')
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
const prevResult = document.getElementById('prev-result')
const currResult = document.getElementById('curr-result')
const optionsContainer = document.getElementById('options-div')
const muteButton = document.getElementById('mute-btn')

const numberOfQuestionsDropdown = document.getElementById("number-of-questions");
const topicsDropdown = document.getElementById("topic-of-questions");
const difficultyDropdown = document.getElementById("difficulty-of-questions");
const downloadPDF = document.getElementById("download")

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
let reportNo = 0;
let soundsOn = true

// localStorage.clear()             

muteButton.addEventListener("click",()=>{
    playSound(pop)
    if(soundsOn){
        soundsOn=false
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_mute</span>'
    }
    else {
        soundsOn=true
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_up</span>'
    }
})

function playSound(sound){
    if(soundsOn){
        sound.play()
    }
}

prevResult.addEventListener("click", () => {
    playSound(pop)
    if (reportNo == 0) {
        prevResult.classList.add('hide')
    }
    else {
        reportNo--
        let data = JSON.parse(localStorage.getItem(reportNo))
        console.log(data)
        report.innerHTML = data.reportKey   
        correctOut.innerHTML = data.correctKey
        incorrectOut.innerHTML = data.incorrectKey
        timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
        prevResult.classList.remove('hide')
        currResult.classList.remove('hide')
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
        let data = JSON.parse(localStorage.getItem(reportNo))
        console.log(data)
        report.innerHTML = data.reportKey   
        correctOut.innerHTML = data.correctKey
        incorrectOut.innerHTML = data.incorrectKey
        timerTakenOut.innerHTML = timeTakenConvertUnits(data.timeTakenKey)
    }
})

startbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    begin.classList.add('hide')
    playSound(pop)
    start()
})

restartbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    end.classList.add('hide')
    qNo = 0
    timetaken = 0
    correct = 0
    finalMessage = ""
    createTimerArray()
    playSound(pop)
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
        getquestion()
    }
}

function prevQuesFunction() {
    inputAnswer()
    if (qNo != 0) {
        qNo--
        qNo = goToPrevValidQuestion()
        getquestion()
    }
    playSound(pop)
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
    getResults()
    displayCurrResult()
}

function getResults() {
    report.innerHTML = ''
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
}

function displayCurrResult() {
    correctOut.innerHTML = correct
    incorrectOut.innerHTML = numberOfQuestions - correct
    timerTakenOut.innerHTML = timeTakenConvertUnits(timetaken)
    exportResult = {
        reportKey: report.innerHTML,
        correctKey: correct,
        incorrectKey: numberOfQuestions - correct,
        timeTakenKey: timetaken
}
storeResult()
}

function storeResult() {
    localStorage.setItem(localStorage.length, JSON.stringify(exportResult))
    reportNo = localStorage.length - 1;
}

function timeTakenConvertUnits(t) {
    if (t > 60) {
        return (Math.floor(t / 60)) + ' minute and ' + t % 60 + ' seconds'
    } else return t + ' seconds'
}

function getquestion() {
    timerReset()
    document.getElementById('timer').classList.remove('red')
    codeSpace.classList.add('hide')
    questionSpace.innerHTML = jsonData.questions[questionArray[qNo]].question
    if (Object.keys(jsonData.questions[questionArray[qNo]]).length == 5) {
        codeSpace.classList.remove('hide')
        code.innerHTML = jsonData.questions[questionArray[qNo]].code
    }

    optionsContainer.innerHTML = ''
    for (var i = 0; i < jsonData.questions[questionArray[qNo]].options.length; i++) {
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
        labelTag.innerHTML = jsonData.questions[questionArray[qNo]].options[i]

        radioDiv.appendChild(inputTag)
        radioDiv.appendChild(labelTag)
        optionsContainer.appendChild(radioDiv)
    }
    activate()
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
        if (answerArray[qNo] == '0') {
            getRadio(0).checked = true;
        }
        else if (answerArray[qNo] == '1') {
            getRadio(1).checked = true;
        }
        else if (answerArray[qNo] == '2') {
            getRadio(2).checked = true;
        }
        else if (answerArray[qNo] == '3') {
            getRadio(3).checked = true;
        } else {
            getRadio(3).checked = true;
            getRadio(3).checked = false;
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

function getRadio(a) {
    return optionsContainer.children[a].firstChild
}

downloadPDF.addEventListener("click", () => {
    var opt = {
        margin: 1,
        filename: 'Quiz-app-result.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(report).set(opt).save();
    playSound(pop)
})