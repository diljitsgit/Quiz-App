function test(){
    console.log('testing')
}

let questionSpace = document.getElementById('question')
let submits = document.getElementById('click')
let answer = document.getElementById('answer')

async function fetchJSONData() {
    let res = await fetch("./data.json")
    return await res.json()
}

let temp = await fetchJSONData()

let timer
let qNo = 0;
let time=20;

function start() {
    timer = setInterval(
        quiz,
        1000
    )
}
start()

function quiz(){
    ticktock()
    getquestion()
    submits.addEventListener("click", check);
    if(qNo==temp.questions.length-1 && time==0){
        quizEnd()
    }
    else if(time==0){
        qNo++
        timerReset()
    }
}

function ticktock(){
    time--
    document.getElementById('timer').innerHTML=time
}

function check(){
    if(answer.value==temp.questions[qNo].answer){
        if(qNo==temp.questions.length-1){
            quizEnd()
        }
        else{
            qNo++
            timerReset()
        }
    }
}

function quizEnd(){
    clearInterval(timer)
}

function timerReset(){
    time=20
}

function getquestion(){
    questionSpace.innerHTML=temp.questions[qNo].question
}