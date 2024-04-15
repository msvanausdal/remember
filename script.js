const interval = 50;
const placeholders = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's',
    'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
let num;
let blurb;
let encrypted;
let running;

document.addEventListener("DOMContentLoaded", function() {
    blurb = "";
    running = false;
});

document.getElementById("remember").addEventListener("click", async function () {
    if(!running) {
        running = true;
        document.getElementById("remember").style.color = '#818589';
        await backspace(blurb);
        num = getNumber();
        blurb = getBlurb(num);
        encrypted = encrypt(blurb);
        await type(encrypted);
        await visualize(blurb, encrypted);
        document.getElementById("remember").style.color = '#03A062';
        running = false;
    }
});

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getNumber() {
    return Math.floor(Math.random() * blurbs.length);
}

function getBlurb(num) {
    return blurbs[num];
}

function encrypt(original) {
    original = original.split('');
    for(let i = 0; i < original.length; i++){
        if (placeholders.includes(original[i])){
            original[i] = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
    }
    return original.join('');
}

function decrypt(original, encrypted){
    original = original.split('');
    encrypted = encrypted.split('');

    for(let i = 0; i < original.length; i++){
        if(encrypted[i] !== original[i]){
            encrypted[i] = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
    }
    return encrypted.join('');
}



async function type(text) {
    document.getElementById("blurb").innerHTML = "";
    for(let i = 0; i < text.length; i++) {
        document.getElementById("blurb").innerHTML += text[i];
        await waitForMs(interval/10);
    }
}

async function backspace(text) {
    for(let i = text.length - 1; i >= 0; i--) {
        text = text.slice(0, i);
        document.getElementById("blurb").innerHTML = text;
        await waitForMs(interval/10);
    }
}

async function visualize(original, text) {
    while(original !== text) {
        text = decrypt(original, text);
        document.getElementById("blurb").innerHTML = text;
        await waitForMs(interval);
    }
}

const blurbs = [
    "this is text number one, wow you are lucky you got the first one epic.",
    "this is the second text. it is a bit longer than the first text, but it's still not the first text, you are unlucky.",
    "this one is definitely also epic, even though its number three. how fun is that, very cool, i know.",
    "i dont really know what to type at this point i just wanted the words to be legible so that you can really tell when the text is encrypted and not encrypted. this one is super epic long very cool very epic super cool.",
    "wow this is the last one, number five. that's probably omega unlucky fr. i am completely out of ideas on what to type so now i am just typing.",
    "jokes on you there was a sixth text, i forgot that i haven't yet tested it with this many. super cool. this one also has an apostrophe earlier, which probably wont be encrypted at all."
]
