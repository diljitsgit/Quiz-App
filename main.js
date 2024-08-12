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

async function fetchJSONData() {
    let res = await fetch("./data.json")
    return await res.json()
}

let temp = await fetchJSONData()

let finalMessage = "You got the following answers wrong: <br>"
let correct = 0
let timer
let qNo = 0
let time = 20
let questionArray = []
createShuffleArr()


startbtn.addEventListener("click", () => {
    app.classList.remove('hide')
    begin.classList.add('hide')
    start()
})

function start() {
    timer = setInterval(
        quiz,
        1000
    )
}

function quiz() {
    ticktock()
    getquestion()
    submits.addEventListener("click", check);
    if (qNo == temp.questions.length - 1 && time == 0) {
        quizEnd()
    }
    else if (time == 0) {
        qNo++
        timerReset()
    }
}

function ticktock() {
    time--
    document.getElementById('timer').innerHTML = time
}

function check() {
    let answer = checkRadio()
    if (answer == temp.questions[questionArray[qNo]].answer) {
        correct++
    }
    else {
        updateMessage()
    }
    if (qNo == temp.questions.length - 1) {
        quizEnd()
    }
    else {
        qNo++
        timerReset()
    }
}

function checkRadio() {
    if (radio1.checked) {
        return radio1txt.innerHTML
    }
    else if (radio2.checked) {
        return radio2txt.innerHTML
    }
    else if (radio3.checked) {
        return radio3txt.innerHTML
    }
    else if (radio4.checked) {
        return radio4txt.innerHTML
    }
    else {
        return 0
    }
}

function updateMessage() {
    let that = 'option' + temp.questions[questionArray[qNo]].answer
    finalMessage += '<br>The answer for question number ' + (qNo + 1) + ' was ' + temp.questions[questionArray[qNo]][that]
}

function quizEnd() {
    clearInterval(timer)
    app.classList.add('hide')
    end.classList.remove('hide')
    console.log(finalMessage)
    result.innerHTML = 'You got ' + correct + ' answers correct out of ' + temp.questions.length
    if (correct != temp.questions.length) {
        report.innerHTML = finalMessage
    }
}

function timerReset() {
    time = 20
}

function getquestion() {
    questionSpace.innerHTML = temp.questions[questionArray[qNo]].question
    radio1txt.innerHTML = temp.questions[questionArray[qNo]].option1
    radio2txt.innerHTML = temp.questions[questionArray[qNo]].option2
    radio3txt.innerHTML = temp.questions[questionArray[qNo]].option3
    radio4txt.innerHTML = temp.questions[questionArray[qNo]].option4
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