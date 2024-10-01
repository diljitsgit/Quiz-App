import {jsonData, setCorrect} from "./main.js";

let report = document.getElementById('report')
let corr = 0;

export function getResults(qArr, aArr, noOfQues) {
    report.innerHTML = ''
    for (var i = 0; i < noOfQues; i++) {
        console.log(i)
        if (jsonData.questions[qArr[i]].answer == aArr[i]) {
            corr++
        } else {
            let questionNo = document.createElement('p')
            let strongQuestionNo = document.createElement('strong')
            strongQuestionNo.innerHTML = 'Question ' + (i + 1)
            let questionout = document.createElement('p')
            questionout.innerHTML = jsonData.questions[qArr[i]].question
            let yourAnswertxt = document.createElement('p')
            yourAnswertxt.innerHTML = 'your answer: '
            let crrAnswertxt = document.createElement('p')
            crrAnswertxt.innerHTML = 'correct answer: '
            let yourAnswer = document.createElement('span')
            if (aArr[i] == -1) {
                yourAnswer.innerHTML = 'Question not answered'
            }
            else {
                yourAnswer.innerHTML = jsonData.questions[qArr[i]].options[aArr[i]]
            }
            yourAnswer.classList.add('incorrect')
            let crrAnswer = document.createElement('span')
            crrAnswer.innerHTML = jsonData.questions[qArr[i]].options[jsonData.questions[qArr[i]].answer]
            crrAnswer.classList.add('correct')
            let hr = document.createElement('hr')

            questionNo.appendChild(strongQuestionNo)
            yourAnswertxt.appendChild(yourAnswer)
            crrAnswertxt.appendChild(crrAnswer)

            report.appendChild(questionNo)
            report.appendChild(questionout)
            if (Object.keys(jsonData.questions[qArr[i]]).length == 5) {
                let preout = document.createElement('pre')
                let codeout = document.createElement('code')
                codeout.innerHTML = jsonData.questions[qArr[i]].code
                preout.appendChild(codeout)
                report.appendChild(preout)
            }
            report.appendChild(yourAnswertxt)
            report.appendChild(crrAnswertxt)
            report.appendChild(hr)
        }
    }
    setCorrect(corr)
}
