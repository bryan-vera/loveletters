const envelope = document.getElementById('envelope');
const letterContainer = document.getElementById('letter-container');
const responseInput = document.getElementById('response-input');
const sendButton = document.getElementById('send-button');

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    letterContainer.classList.add('show');
    startTyping();
});

function startTyping() {
    const letterText = "My Dearest,\n\nFrom the moment our paths crossed, my heart has danced to a melody only you can compose. Each moment spent with you is a treasure, and I find myself lost in thoughts of your smile, your laughter, and the warmth of your embrace.\n\nAs the stars twinkle above, I am reminded of the light you bring into my life. I cherish every memory we create together, and I long for the moments yet to come.\n\nWith all my love,\n\nYours forever.";
    let index = 0;

    const typeWriterEffect = () => {
        if (index < letterText.length) {
            letterContainer.innerHTML += letterText.charAt(index);
            index++;
            setTimeout(typeWriterEffect, 50);
        } else {
            responseInput.style.display = 'block';
            sendButton.style.display = 'block';
        }
    };

    typeWriterEffect();
}

sendButton.addEventListener('click', () => {
    const response = responseInput.value;
    if (response) {
        alert("Your response has been sent!");
        responseInput.value = '';
    } else {
        alert("Please write a response before sending.");
    }
});