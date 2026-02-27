const loveLetterText = `My Dearest,

From the moment our eyes met, my heart knew it had found its home. Each day spent with you is a beautiful addition to my life's journey. Your laughter is the sweetest melody, and your smile lights up my darkest days.

I cherish every moment we share, and I long for the countless memories we have yet to create together. You are my inspiration, my joy, and my love.

Forever yours,
[Your Name]`;

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const letterDisplay = document.getElementById('letter-display');
    const responseInput = document.getElementById('response-input');
    const sendButton = document.getElementById('send-button');

    envelope.addEventListener('click', () => {
        typeWriterEffect(loveLetterText, letterDisplay);
    });

    sendButton.addEventListener('click', () => {
        const response = responseInput.value;
        if (response) {
            alert('Your response has been sent!');
            responseInput.value = '';
        } else {
            alert('Please write a response before sending.');
        }
    });
});

function typeWriterEffect(text, displayElement) {
    let index = 0;
    displayElement.innerHTML = '';

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            displayElement.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
            displayElement.innerHTML += '<br><br><input type="text" id="response-input" placeholder="Your response..."><button id="send-button">Send</button>';
        }
    }, 100);
}