import { jsonData} from "./main.js";

const questionSpace = document.getElementById('question')
const codeSpace = document.getElementById('codeSpace')
const code = document.getElementById('code')
const optionsContainer = document.getElementById('options-div')


export function getquestion(q, t, a) {
    document.getElementById('timer').classList.remove('red')
    codeSpace.classList.add('hide')
    questionSpace.innerHTML = jsonData.questions[q].question
    if (Object.keys(jsonData.questions[q]).length == 5) {
        codeSpace.classList.remove('hide')
        code.innerHTML = jsonData.questions[q].code
    }

    optionsContainer.innerHTML = ''
    for (var i = 0; i < jsonData.questions[q].options.length; i++) {
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
        labelTag.innerHTML = jsonData.questions[q].options[i]

        radioDiv.appendChild(inputTag)
        radioDiv.appendChild(labelTag)
        optionsContainer.appendChild(radioDiv)
    }
    document.getElementById('timer').innerHTML = t
    activate()

    function activate() {
        if (a == '0') {
            getRadio(0).checked = true
            getRadio(0).parentElement.classList.add('selected')
        }
        else if (a == '1') {
            getRadio(1).checked = true
            getRadio(1).parentElement.classList.add('selected')
        }
        else if (a == '2') {
            getRadio(2).checked = true
            getRadio(2).parentElement.classList.add('selected')
        }
        else if (a == '3') {
            getRadio(3).checked = true
            getRadio(3).parentElement.classList.add('selected')
        } else {
            getRadio(3).checked = true
            getRadio(3).checked = false
        }
    } 
}


  

export function getRadio(a) {
    return optionsContainer.children[a].firstChild
}

// This module contains general code for displaying question to user