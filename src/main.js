import { getChordsFromSelectedNotes, getRelativeNoteNumber } from "./helpers/noteHelpers.js";

// Check if Web MIDI API is supported
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    console.error("Web MIDI API is not supported in this browser.");
}

const activeNotes = new Set();

function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");

    // Loop through all available MIDI inputs
    for (const input of midiAccess.inputs.values()) {
        console.log(`Connected to: ${input.name}`);
        input.onmidimessage = handleMIDIMessage;
    }

    // Listen for new devices being connected
    midiAccess.onstatechange = (event) => {
        console.log(`MIDI device ${event.port.name} ${event.port.state}`);
    };
}

function onMIDIFailure() {
    console.error("Could not access your MIDI devices.");
}

function handleMIDIMessage(message) {
    const [command, noteNumber, velocity] = message.data;

    // Example: Detect note on/off
    if (command === 144 && velocity > 0) {
        activeNotes.add(noteNumber);
        updateActiveNotesDisplay();
    } else if (command === 128 || (command === 144 && velocity === 0)) {
        activeNotes.delete(noteNumber);
        updateActiveNotesDisplay();
    }
}

function updateActiveNotesDisplay() {
    activeNotes.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Note: ${note}`;
    });

    const matchedChords = getChordsFromSelectedNotes(Array.from(activeNotes));

    const matchedChordsListElement = document.getElementById("matched-chords-list");
    if (matchedChordsListElement) {
        matchedChordsListElement.innerHTML = "";
        matchedChords.forEach(({ root, chord }) => {
            const listItem = document.createElement("li");
            const listItemContent = document.createElement("span");
            listItemContent.textContent = `${root} ${chord}`;
            listItem.appendChild(listItemContent);
            matchedChordsListElement.appendChild(listItem);
        });
    }
}
