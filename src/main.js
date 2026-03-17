// Dependencies
import { getChordsFromSelectedNotes, Midi } from "@benjamindehli/music-utils";

// Classes

// Helpers
import { generateKeyboardLayout, updateKeyboardDisplay } from "./helpers/keyboardHelpers.js";

// Check if Web MIDI API is supported
if (navigator.requestMIDIAccess) {

// Stylesheets
import "./main.css";

const midi = new Midi();
midi.init(handleMIDIMessage);

const activeNotes = new Set();

function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");

    // Loop through all available MIDI inputs
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
        updateKeyboardDisplay(Array.from(activeNotes));
    } else if (command === 128 || (command === 144 && velocity === 0)) {
        activeNotes.delete(noteNumber);
        updateActiveNotesDisplay();
        updateKeyboardDisplay(Array.from(activeNotes));
    }
}

function updateActiveNotesDisplay() {
    for (const note of activeNotes) {
        const listItem = document.createElement("li");
        listItem.textContent = `Note: ${note}`;
    }

    const matchedChords = getChordsFromSelectedNotes(Array.from(activeNotes));

    const matchedChordsListElement = document.getElementById("matched-chords-list");
    if (matchedChordsListElement) {
        matchedChordsListElement.innerHTML = "";
        for (const { root, chord } of matchedChords) {
            const listItem = document.createElement("li");
            const listItemContent = document.createElement("span");
            listItemContent.textContent = `${root} ${chord?.name}`;
            listItem.appendChild(listItemContent);
            matchedChordsListElement.appendChild(listItem);
        }
    }
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
    // Generate a 2-octave keyboard layout on page load
    generateKeyboardLayout(8);
});

document.addEventListener("keydown", (event) => {
    toggleNote(event.key);
});

document.addEventListener("keyup", (event) => {
    toggleNote(event.key);
});

const keyToNoteNumberMap = {
    // Map keyboard keys to MIDI note numbers (C4 = 60)
    a: 60, // C4
    w: 61, // C#4
    s: 62, // D4
    e: 63, // D#4
    d: 64, // E4
    f: 65, // F4
    t: 66, // F#4
    g: 67, // G4
    y: 68, // G#4
    h: 69, // A4
    u: 70, // A#4
    j: 71, // B4
    k: 72 // C5
};

function toggleNote(key) {
    const noteNumber = keyToNoteNumberMap[key];
    if (noteNumber) {
        if (activeNotes.has(noteNumber)) {
            activeNotes.delete(noteNumber);
        } else {
            activeNotes.add(noteNumber);
        }
        updateActiveNotesDisplay();
        updateKeyboardDisplay(Array.from(activeNotes));
    }
}
