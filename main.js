// const questionSpace = document.getElementById('question').innerHTML
// const sumbit = document.getElementById('click')
// const answer = document.getElementById('answer')

async function fetchJSONData() {
    let res = await fetch("./data.json")
    return await res.json()
}

let temp = await fetchJSONData()
console.log(temp)