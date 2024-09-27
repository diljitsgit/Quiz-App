export let soundsOn = true;
export function setSoundsOn(){
    soundsOn = (!soundsOn)
}

let pop = new Audio('./audio/pop.mp3')
let tick = new Audio('./audio/Tick.mp3')
pop.volume = 0.2
tick.volume = 0.5

export function playSound(sound) {
    if (soundsOn) {
        sound.play()
    }
}

export{pop, tick}

// import the playSound Function at the desired location
// export individual audios needed in this module file and import
// the same at the desired loaciton