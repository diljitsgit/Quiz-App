// Getting Data of questions from json

export async function fetchJSONData(name) {
    let fileName = "./Questions-Folder/" + name + ".json"
    let res = await fetch(fileName)
    return await res.json()
}