let questionSpace = document.getElementById('question')
let nextQues = document.getElementById('click')
let prevQues = document.getElementById('Prevclick')
let radio1 = document.getElementById('radio1')
let radio2 = document.getElementById('radio2')
let radio3 = document.getElementById('radio3')
let radio4 = document.getElementById('radio4')
let radio1txt = document.getElementById('radio1txt')
let radio2txt = document.getElementById('radio2txt')
let radio3txt = document.getElementById('radio3txt')
let radio4txt = document.getElementById('radio4txt')
let begin = document.getElementById('start-container')
let app = document.getElementById('main-container')
let end = document.getElementById('end-container')
let result = document.getElementById('result')
let report = document.getElementById('report')
let startbtn = document.getElementById('start')
let restartbtn = document.getElementById('restart')
let input = document.getElementById('input')
let prevResult = document.getElementById('prev-result')
let currResult = document.getElementById('curr-result')

async function fetchJSONData() {
    let res = await fetch("./data.json")
    return await res.json()
}

let temp = await fetchJSONData()

let timePerQuestion = 20
let numberOfQuestions = 10
let exportResult
let timetaken = 0
let finalMessage
let correct = 0
let timer
let qNo = 0
let questionArray = []
let timerArray = []
let answerArray = []
createShuffleArr()


prevResult.addEventListener("click", () => {
    result.innerHTML = localStorage.getItem('result')
    if (correct != temp.questions.length) {
        report.innerHTML = '<br>' + localStorage.getItem('report')
    }
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



function start() {
    prevResult.classList.remove('hide')
    currResult.classList.add('hide')
    createTimerArray()
    getquestion()
    timer = setInterval(
        quiz,
        1000
    )
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
    }
    input.value = ""
    document.getElementById('input-container').classList.add('hide')
    document.getElementById('radio-container').classList.add('hide')
    getquestion()
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

function prevQuesFunction() {
    inputAnswer()
    if (qNo != 0) {
        qNo--
        qNo = goToPrevValidQuestion()
        input.value = ""
        document.getElementById('input-container').classList.add('hide')
        document.getElementById('radio-container').classList.add('hide')
        getquestion()
    }
}

function checkRadio() {
    if (radio1.checked) {
        return 1
    }
    else if (radio2.checked) {
        return 2
    }
    else if (radio3.checked) {
        return 3
    }
    else if (radio4.checked) {
        return 4
    }
    else {
        return 0
    }
}

function quizEnd() {
    clearInterval(timer)
    app.classList.add('hide')
    end.classList.remove('hide')
    getResults()
    displayCurrResult()
}

function getResults() {
    for (var i = 0; i < numberOfQuestions; i++) {
        if (temp.questions[questionArray[i]].answer == answerArray[i]) {
            correct++
        } else {
            if (getQuestionType(i) === 'mcq') {
                let that = 'option' + temp.questions[questionArray[i]].answer
                finalMessage += '<br>' + temp.questions[questionArray[i]].question + ' :<br><strong> ' + temp.questions[questionArray[i]][that] + '</strong><hr>'
            }
            else {
                finalMessage += '<br>' + temp.questions[questionArray[i]].question + ' :<br><strong> ' + temp.questions[questionArray[i]].answer + '</strong><hr>'
            }
        }
    }
}

function displayCurrResult() {
    exportResult = 'You got ' + correct + ' answers correct out of ' + numberOfQuestions + '<br> time taken: ' + timetaken + ' seconds <br>'
    result.innerHTML = 'You got ' + correct + ' answers correct out of ' + numberOfQuestions + '<br> time taken: ' + timetaken + ' seconds'
    if (correct != temp.questions.length) {
        report.innerHTML = "The correct answer for the following answers were: <br>" + finalMessage
    }
}

function storeResult() {
    localStorage.setItem('result', exportResult)
    localStorage.setItem('report', finalMessage)
}

function getquestion() {
    activate()
    document.getElementById('input-container').classList.add('hide')
    document.getElementById('radio-container').classList.add('hide')
    document.getElementById('radioDiv3').classList.remove('hide')
    document.getElementById('radioDiv4').classList.remove('hide')
    questionSpace.innerHTML = temp.questions[questionArray[qNo]].question

    if (getQuestionType(qNo) == 'mcq') {
        document.getElementById('radio-container').classList.remove('hide')
        radio1txt.innerHTML = temp.questions[questionArray[qNo]].option1
        radio2txt.innerHTML = temp.questions[questionArray[qNo]].option2

        if (temp.questions[questionArray[qNo]].option3 != '') {
            radio3txt.innerHTML = temp.questions[questionArray[qNo]].option3
        }
        else {
            document.getElementById('radioDiv3').classList.add('hide')
        }
        if (temp.questions[questionArray[qNo]].option4 != '') {
            radio4txt.innerHTML = temp.questions[questionArray[qNo]].option4
        }
        else {
            document.getElementById('radioDiv4').classList.add('hide')
        }
    }
    else {
        document.getElementById('input-container').classList.remove('hide')
    }
}


function createShuffleArr() {
    for (var i = 0; i < temp.questions.length; i++) {
        questionArray.push(i)
    }
    for (let i = questionArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = questionArray[i];
        questionArray[i] = questionArray[j];
        questionArray[j] = temp;
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
    return temp.questions[questionArray[p]].type
}

document.getElementById("qNoDown").addEventListener("click", qNoLow);
document.getElementById("qNoUp").addEventListener("click", qNoHigh);

function qNoLow() {
    if (numberOfQuestions != temp.questions.length) {
        numberOfQuestions--
        document.getElementById("qNoText").innerHTML = numberOfQuestions
    }
}

function qNoHigh() {
    if (numberOfQuestions != temp.questions.length) {
        numberOfQuestions++
        document.getElementById("qNoText").innerHTML = numberOfQuestions
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
        qNo--
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
        }
    }
    else {
        input.value = answerArray[qNo]
    }
}