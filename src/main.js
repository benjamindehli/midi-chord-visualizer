// Dependencies
import { getChordsFromSelectedNotes, Midi } from "@benjamindehli/music-utils";

// Helpers
import { generateKeyboardLayout, updateKeyboardDisplay } from "./helpers/keyboardHelpers.js";

// Stylesheets
import "./main.css";

const midi = new Midi();
midi.init(handleMIDIMessage);

const activeNotes = new Set();

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
        for (const { rootNote, chordType } of matchedChords) {
            const listItem = document.createElement("li");
            const listItemContent = document.createElement("span");
            listItemContent.textContent = `${rootNote.name} ${chordType?.name}`;
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
    if (event.repeat) return;
    toggleNote(event.code);
});

document.addEventListener("keyup", (event) => {
    toggleNote(event.code);
});

const keyToNoteNumberMap = {
    // Map keyboard keys to MIDI note numbers (C4 = 60)
    KeyA: 60, // C4
    KeyW: 61, // C#4
    KeyS: 62, // D4
    KeyE: 63, // D#4
    KeyD: 64, // E4
    KeyF: 65, // F4
    KeyT: 66, // F#4
    KeyG: 67, // G4
    KeyY: 68, // G#4
    KeyH: 69, // A4
    KeyU: 70, // A#4
    KeyJ: 71, // B4
    KeyK: 72, // C5
    KeyO: 73, // C#5
    KeyL: 74, // D5
    KeyP: 75, // D#5
    Semicolon: 76, // E5
    Quote: 77 // F5
};

function toggleNote(code) {
    const noteNumber = keyToNoteNumberMap[code];
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
