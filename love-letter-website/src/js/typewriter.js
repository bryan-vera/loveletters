function typeWriter(element, text, speed, callback) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }

    type();
}

function clearText(element) {
    element.innerHTML = '';
}

export { typeWriter, clearText };