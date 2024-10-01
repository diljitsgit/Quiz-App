const practiceButton = document.getElementById('practice-btn')
const muteButton = document.getElementById('mute-btn')
const reportButton = document.getElementById('report-btn')
const logo = document.getElementById('logo')


import { playSound, pop } from "./audio.js"
import { soundsOn , setSoundsOn} from "./audio.js"

muteButton.addEventListener("click", () => {
    playSound(pop)
    if (soundsOn) {
        setSoundsOn()
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_mute</span>'
    }
    else {
        setSoundsOn()
        muteButton.innerHTML = '<span class="material-symbols-outlined">volume_up</span>'
    }
})

reportButton.addEventListener('click', () => {
    window.location.href = window.location.pathname + '/reports.html'
})

practiceButton.addEventListener('click', () => {
    window.location.href = window.location.pathname + '/practice.html'
})


logo.addEventListener('click', () => {
    window.location.href = window.location.pathname
})

// Add any navbar customisation icon's action upon click here

// Add the additional icons's element id
// Add EventListener
// Add Desired function upon click