const INTERVAL = 50;
const placeholdersAll = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's',
    'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
const placeholdersDate = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let numArray = [];
let num;
let date = "";
let dates = [];
let blurb = "";
let blurbs = [];
let encryptedDate;
let encrypted;
let running = false;

/**
 * Fetch JSON data on page load
 */
document.addEventListener("DOMContentLoaded", async function () {
    await fetchData("https://msvanausdal.github.io/remember-json/data.json");
});

document.getElementById("remember").addEventListener("click", async function () {
    if(!running) {
        running = true;
        document.getElementById("remember").style.color = '#818589';
        await backspace(blurb, "blurb");
        await backspace(date, "date", INTERVAL * 10);
        num = getNumber();
        date = getDate(num);
        blurb = getBlurb(num);
        encryptedDate = encrypt(date, placeholdersDate);
        encrypted = encrypt(blurb, placeholdersAll);
        await type(encryptedDate, "date", INTERVAL * 10);
        await type(encrypted, "blurb");
        visualize(date, encryptedDate, placeholdersDate, "date", INTERVAL * 2);
        await visualize(blurb, encrypted, placeholdersAll, "blurb");
        document.getElementById("remember").style.color = '#03A062';
        running = false;
    }
});


function setNumArray(list) {
    if (numArray.length === 0) {
        for (let i = 0; i < list.length; i++) {
            numArray.push(i);
        }
    }
}

function getNumber() {
    setNumArray(blurbs);
    let r = numArray[Math.floor(Math.random() * numArray.length)];
    numArray = numArray.filter(e => e !== r);
    return r;
}

function getDate(num) {
    return dates[num];
}

function getBlurb(num) {
    return blurbs[num];
}

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function encrypt(original, allowedChars) {
    original = original.split('');
    for(let i = 0; i < original.length; i++){
        if(original[i] === '%'){
            original[i] = '<br>'
        }else if (allowedChars.includes(original[i])){
            original[i] = allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }
    }
    return original.join('');
}

function decrypt(original, encrypted, allowedChars){
    original = original.split('');
    encrypted = encrypted.split('');

    for(let i = 0; i < original.length; i++){
        if(encrypted[i] !== original[i]){
            encrypted[i] = allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }
    }
    return encrypted.join('');
}

async function fetchData(url) {
    const response = await fetch(url);
    let blurbsJson;
    try {
        blurbsJson = await response.json();
        console.log("JSON Fetch Success", blurbsJson);
        blurbsJson.blurbs.forEach(blurbObj => {
            dates[blurbObj.id] = blurbObj.date;
            blurbs[blurbObj.id] = blurbObj.blurb.toLowerCase();
        });
    } catch (e) {
        console.error("JSON Fetch Failed", e);
    }
}

async function type(text, elementId, interval = INTERVAL) {
    document.getElementById(elementId).innerHTML = "";
    for(let i = 0; i < text.length; i++) {
        document.getElementById(elementId).innerHTML += text[i];
        await waitForMs(interval/10);
    }
    await waitForMs(interval);
}

async function backspace(text, elementId, interval = INTERVAL) {
    for(let i = text.length - 1; i >= 0; i--) {
        text = text.slice(0, i);
        document.getElementById(elementId).innerHTML = text;
        await waitForMs(interval/10);
    }
    await waitForMs(interval);
}

async function visualize(original, text, allowedChars, elementId, interval = INTERVAL) {
    while(original !== text) {
        text = decrypt(original, text, allowedChars);
        document.getElementById(elementId).innerHTML = text;
        await waitForMs(interval);
    }
}