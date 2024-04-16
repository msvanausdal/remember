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
 * actions on page load
 */
document.addEventListener("DOMContentLoaded", async function () {
    // fetch json on page load
    await fetchData("https://msvanausdal.github.io/remember-json/data.json");
});

/**
 * actions on button click
 */
document.getElementById("remember").addEventListener("click", async function () {
    // check running flag to prevent button from doing anything while text is manipulated on screen
    if(!running) {
        // set running flag, change button color
        running = true;
        document.getElementById("remember").style.color = '#818589';
        // animation to remove any text on screen
        await backspace(blurb, "blurb");
        await backspace(date, "date", INTERVAL * 10);
        // generate random number and get the associated date and text blurb
        num = getNumber();
        date = getDate(num);
        blurb = getBlurb(num);
        // encrypt the date and text blurb
        encryptedDate = encrypt(date, placeholdersDate);
        encrypted = encrypt(blurb, placeholdersAll);
        // display the encrypted date and text blurb on screen
        await type(encryptedDate, "date", INTERVAL * 10);
        await type(encrypted, "blurb");
        // animate the decryption of the text
        visualize(date, encryptedDate, placeholdersDate, "date", INTERVAL * 2);
        await visualize(blurb, encrypted, placeholdersAll, "blurb");
        // reset running flag, reset button color
        document.getElementById("remember").style.color = '#03A062';
        running = false;
    }
});

/**
 * generate array of indices for available text blurbs
 * @param list - list of available text blurbs
 */
function setNumArray(list) {
    if (numArray.length === 0) {
        for (let i = 0; i < list.length; i++) {
            numArray.push(i);
        }
    }
}

/**
 * generates a number that corresponds to the index of a random text blurb
 * no duplicates are chosen until all blurbs have been displayed
 * @returns integer - index of random text blurb
 */
function getNumber() {
    setNumArray(blurbs);
    let r = numArray[Math.floor(Math.random() * numArray.length)];
    numArray = numArray.filter(e => e !== r);
    console.log(r);
    console.log(numArray);
    return r;
}

/**
 * takes the index of a text blurb and returns relevant date as a string
 * @param num - index of current text blurb
 * @returns string - entry date of current text blurb
 */
function getDate(num) {
    return dates[num];
}

/**
 * takes the index of a text blurb and returns the blurb as a string
 * @param num - index of current text blurb to be displayed
 * @returns string - current text blurb to be displayed
 */
function getBlurb(num) {
    return blurbs[num];
}

/**
 * halts program operations until time delay has passed
 * @param ms - number of milliseconds to halt program
 * @returns {Promise<unknown>}
 */
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * randomly "encrypts" a text blurb
 * @param original - original text blurb to be encrypted
 * @param allowedChars - list of characters in current text blurb
 * @returns string - encrypted text blurb
 */
function encrypt(original, allowedChars) {
    original = original.split('');
    for(let i = 0; i < original.length; i++){
        if (allowedChars.includes(original[i])){
            original[i] = allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }
    }
    return original.join('');
}

/**
 * "decrypts" the encrypted text blurb by randomly cycling through characters
 * until they match the original
 * @param original - original text blurb
 * @param encrypted - encrypted text blurb
 * @param allowedChars - list of characters used in original text blurb
 * @returns string - text blurb after one cycle of decryption
 */
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

/**
 * takes a url and sorts the retrieved json data into the dates list and blurbs list
 * @param url - string of url of json data
 * @returns {Promise<void>}
 */
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

/**
 * typing animation for displaying text on screen
 * @param text - text to type on screen
 * @param elementId - html element to type the text into
 * @param interval - ms interval between each letter typed
 * @returns {Promise<void>}
 */
async function type(text, elementId, interval = INTERVAL) {
    document.getElementById(elementId).innerHTML = "";
    for(let i = 0; i < text.length; i++) {
        document.getElementById(elementId).innerHTML += text[i];
        await waitForMs(interval/10);
    }
    await waitForMs(interval);
}

/**
 * delete animation to clear text on screen
 * @param text - text to delete
 * @param elementId - html element to delete from
 * @param interval - ms interval between each character delete
 * @returns {Promise<void>}
 */
async function backspace(text, elementId, interval = INTERVAL) {
    for(let i = text.length - 1; i >= 0; i--) {
        text = text.slice(0, i);
        document.getElementById(elementId).innerHTML = text;
        await waitForMs(interval/10);
    }
    await waitForMs(interval);
}

/**
 * loops the decrypt function, displaying each step on screen
 * @param original - original text blurb
 * @param text - encrypted text blurb
 * @param allowedChars - list of characters in text blurb
 * @param elementId - html element to visualize
 * @param interval - ms interval between each decrypt step
 * @returns {Promise<void>}
 */
async function visualize(original, text, allowedChars, elementId, interval = INTERVAL) {
    while(original !== text) {
        text = decrypt(original, text, allowedChars);
        document.getElementById(elementId).innerHTML = text;
        await waitForMs(interval);
    }
}