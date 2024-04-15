const interval = 50;
var num;
var blurb;
var encrypted;
var running;

document.addEventListener("DOMContentLoaded", function(event) {
    running = false;
});

document.getElementById("remember").addEventListener("click", async function (e) {
    if(!running) {
        running = true;
        num = getNumber();
        blurb = getBlurb(num);
        encrypted = encrypt(blurb);
        await type(encrypted);
        await visualize();
        running = false;
    }
    //type(encrypted).then(visualize).then(function() {document.getElementById("remember").innerHTML = "hello";});
    //document.getElementById("blurb").innerHTML = encrypted;
});

async function type(text) {
    document.getElementById("blurb").innerHTML = "";
    var i = 0
    for(i; i < text.length; i++) {
        document.getElementById("blurb").innerHTML += text[i];
        await waitForMs(interval/10);
    }
}

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
    var placeholders = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's',
        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
    original = original.split('');
    for(var i = 0; i < original.length; i++){
        if (placeholders.includes(original[i])){
            original[i] = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
    }
    return original.join('');
}

function decrypt(original, encrypted){
    var placeholders = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's',
        'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];

    original = original.split('');
    encrypted = encrypted.split('');

    for(var i = 0; i < original.length; i++){
        if(encrypted[i] != original[i]){
            encrypted[i] = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
    }
    return encrypted.join('');
}

function visualize() {
    var timer = setInterval(
        function() {
            encrypted = decrypt(blurb, encrypted);
            document.getElementById("blurb").innerHTML = encrypted;

            if(encrypted == blurbs){
                clearInterval(timer);
            }
        }, interval);
}

var blurbs = [
    "lorem ipsum dolor sit amet, consectetur adipiscing elit. fusce placerat nibh est, dapibus consequat eros blandit pellentesque. sed id purus quam. curabitur sollicitudin ligula augue, ut euismod leo iaculis vitae. sed a est ex. morbi et ipsum sapien. mauris faucibus dapibus urna, vel tristique diam congue et. ut porttitor lobortis purus sit amet eleifend. nam a ex ut lorem congue tempor at ut nulla. donec vitae justo sed neque scelerisque scelerisque. pellentesque quis justo quis ipsum facilisis malesuada eleifend id lectus. nulla pretium arcu velit, id tempus leo mollis et.",
    "nunc dignissim odio leo, in lacinia lacus tincidunt vel. fusce vel enim luctus, tristique quam ac, pretium sapien. ut quam lectus, ultricies eu neque id, dapibus tincidunt metus. aenean gravida nec odio ut sollicitudin. interdum et malesuada fames ac ante ipsum primis in faucibus. cras suscipit molestie ex, ac dictum enim rhoncus sed. nam eget condimentum mi. aenean at tristique metus. mauris aliquam mattis commodo. vivamus finibus mauris quam, in mollis lorem finibus in.",
    "vestibulum a consequat velit, id rutrum diam. etiam augue nunc, vehicula a elit in, vehicula finibus velit. sed tortor tortor, facilisis sed posuere id, sodales a orci. etiam varius vel dui sit amet pellentesque. integer mauris risus, posuere eget dapibus vitae, efficitur et velit. aenean ullamcorper tempus lobortis. vestibulum quis vehicula nunc. curabitur a quam maximus, semper justo sit amet, suscipit ligula. mauris elit nibh, ultrices ut condimentum vel, aliquet iaculis libero. nam tempor tortor et mattis ornare. mauris sit amet nisl eu libero pharetra faucibus. pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. sed vitae est et sem venenatis mollis.",
    "nunc et felis semper, semper ex id, vehicula lectus. ut euismod rhoncus elit in ultricies. pellentesque sed erat maximus, euismod ipsum rutrum, pharetra libero. in viverra mollis risus, et consequat massa tempor ac. integer non consectetur sapien, in ullamcorper nibh. vestibulum non sagittis massa, nec cursus neque. mauris consequat non tellus non dictum. duis sed augue faucibus, rutrum justo tincidunt, ullamcorper mauris. nam vel libero interdum libero porttitor aliquet vitae et tellus. cras sed venenatis neque. morbi porttitor pretium libero, id dictum ante ultricies in.",
    "ut faucibus tellus tempor neque egestas, vel molestie est elementum. morbi tempus magna ut lorem mattis lobortis. aliquam ut ligula in lectus porta volutpat. nulla facilisi. nam vel dignissim dui. proin vestibulum, orci sit amet tristique pellentesque, massa eros tempor augue, a maximus enim magna at massa. duis fermentum aliquet faucibus."
]