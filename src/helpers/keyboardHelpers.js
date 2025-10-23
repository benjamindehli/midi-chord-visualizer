function generateKeyElement(note, octave) {
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");
    keyElement.dataset.note = note;
    keyElement.dataset.octave = octave;

    // Set the background color based on the note
    keyElement.classList.add(getKeyColor(note));

    return keyElement;
}

function getKeyColor(note) {
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    return whiteKeys.includes(note) ? "white" : "black";
}

export function generateKeyboardLayout(octaves = 2) {
    const keyboardContainer = document.getElementById("keyboard");
    keyboardContainer.innerHTML = ""; // Clear existing keys

    for (let octave = 0; octave < octaves; octave++) {
        for (let note = 0; note < 12; note++) {
            const keyElement = generateKeyElement(note, octave);
            keyboardContainer.appendChild(keyElement);
        }
    }
}

function setActiveKey(noteNumber, isActive) {
    const note = noteNumber % 12;
    const octave = Math.floor(noteNumber / 12);
    const keySelector = `.key[data-note='${note}'][data-octave='${octave}']`;
    const keyElement = document.querySelector(keySelector);

    if (keyElement) {
        if (isActive) {
            keyElement.classList.add("active");
        } else {
            keyElement.classList.remove("active");
        }
    }
}

export function updateKeyboardDisplay(activeNotes) {
    // First, clear all active states
    const allKeys = document.querySelectorAll(".key");
    allKeys.forEach((key) => key.classList.remove("active"));

    // Then, set the active state for the currently active notes
    activeNotes.forEach((note) => setActiveKey(note, true));
}
