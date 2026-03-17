// Dependencies
import { getChordsFromSelectedNotes, Midi } from "@benjamindehli/music-utils";

// Classes
import Game from "./classes/Game.js";

// Helpers
import { generateKeyboardLayout, updateKeyboardDisplay } from "./helpers/keyboardHelpers.js";

// Data
import { levels } from "./data/levels.js";

// Stylesheets
import "./main.css";

const midi = new Midi();
midi.init(handleMIDIMessage);

const activeNotes = new Set();
let activeGame = null;
let activeRoundIndex = 0;
let activeRound = null;

function commitChordGuess(activeNotes) {
    if (!activeGame) {
        console.warn("No active game.");
        return;
    }

    const matchedChords = getChordsFromSelectedNotes(Array.from(activeNotes));
    if (matchedChords.length === 0) {
        console.log("No chord matched.");
        return;
    }

    // If any of the matched chords correspond to the active round, consider it a correct guess
    for (const { root, chord } of matchedChords) {
        const guessedChordName = `${root} ${chord}`;
        if (guessedChordName === activeGame.getActiveRound().chord.name) {
            console.log(`Correct! You guessed the chord: ${guessedChordName}`);
            // Here you could add logic to proceed to the next round, update score, etc.
        }
    }
    activeGame.advanceToNextRound();
    if (activeGame.activeRoundIndex >= activeGame.rounds.length) {
        console.log("Game over! You've completed all rounds.");
        return;
    }
    activeRound = activeGame.rounds[activeGame.activeRoundIndex];
    console.log(activeGame);
}

function handleMIDIMessage(message) {
    const [command, noteNumber, velocity] = message.data;

    // Example: Detect note on/off
    if (command === 144 && velocity > 0) {
        activeNotes.add(noteNumber);
        updateActiveNotesDisplay();
        updateKeyboardDisplay(Array.from(activeNotes));
        // If active notes is present and hasn't changed for more than .5 second, console.log the active notes
        if (activeNotes.size > 0) {
            clearTimeout(globalThis.activeNotesTimeout);
            globalThis.activeNotesTimeout = setTimeout(() => {
                if (activeNotes.size > 0) {
                    console.log("Active notes (held for .5 second):", Array.from(activeNotes));
                    commitChordGuess(activeNotes);
                }
            }, 500);
        }
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

    activeGame = new Game(levels[1]);
    //activeRound = activeGame.rounds[0];
    console.log(activeGame);
});

document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
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
