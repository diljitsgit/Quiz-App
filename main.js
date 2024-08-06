questionSpace = document.getElementById('question').innerHTML
button = document.getElementById('click')
answer = document.getElementById('answer')

function fetchJSONData() {
    fetch("./data.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data)
        })
}

fetchJSONData();