function test() {
    console.log('testing')
}

let questionSpace = document.getElementById('question')
let submits = document.getElementById('click')
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
let time = timePerQuestion
let questionArray = []
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
    time = timePerQuestion
    start()
})



function start() {
    prevResult.classList.remove('hide')
    currResult.classList.add('hide')
    timer = setInterval(
        quiz,
        1000
    )
}

function quiz() {
    ticktock()
    submits.addEventListener("click", check)
    if (qNo == numberOfQuestions - 1 && time == 0) {
        quizEnd()
    }
    else if (time == 0) {
        qNo++
        timerReset()
    }
    getquestion()
}

function ticktock() {
    time--
    timetaken++
    document.getElementById('timer').innerHTML = time
}

function check() {
    if (getQuestionType() == 'mcq') {
        let answer = checkRadio()
        if (answer == temp.questions[questionArray[qNo]].answer) {
            correct++
        }
        else {
            updateMessage()
        }
    }
    else {
        let answer = input.value
        if (answer == temp.questions[questionArray[qNo]].answer) {
            correct++
        }
        else {
            updateMessage()
        }
    }
    if (qNo == numberOfQuestions - 1) {
        quizEnd()
    }
    else {
        qNo++
        timerReset()
    }
    input.value = ""
    document.getElementById('input-container').classList.add('hide')
    document.getElementById('radio-container').classList.add('hide')
    getquestion()
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

function updateMessage() {
    if (getQuestionType() == 'mcq') {
        let that = 'option' + temp.questions[questionArray[qNo]].answer
        finalMessage += '<br>' + temp.questions[questionArray[qNo]].question + ' :<br><strong> ' + temp.questions[questionArray[qNo]][that] + '</strong><hr>'
    }
    else {
        finalMessage += '<br>' + temp.questions[questionArray[qNo]].question + ' :<br><strong> ' + temp.questions[questionArray[qNo]].answer + '</strong><hr>'
    }
}

function quizEnd() {
    clearInterval(timer)
    app.classList.add('hide')
    end.classList.remove('hide')
    displayCurrResult()
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

function timerReset() {
    time = timePerQuestion
}

function getquestion() {
    document.getElementById('input-container').classList.add('hide')
    document.getElementById('radio-container').classList.add('hide')
    document.getElementById('radioDiv3').classList.remove('hide')
    document.getElementById('radioDiv4').classList.remove('hide')
    questionSpace.innerHTML = temp.questions[questionArray[qNo]].question

    if (getQuestionType() == 'mcq') {
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

function getQuestionType() {
    return temp.questions[questionArray[qNo]].type
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