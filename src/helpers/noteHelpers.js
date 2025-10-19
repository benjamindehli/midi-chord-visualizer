import notes from "../data/notes.js";
import chords from "../data/chords.js";

export function getRelativeNoteNumber(noteNumber, keyNoteNumber) {
    let relativeNumber = noteNumber - keyNoteNumber;
    if (relativeNumber < 0) {
        relativeNumber += 12;
    }
    return relativeNumber;
}

function normalizeHalfStep(noteNumber) {
    return noteNumber % 12;
}

function normalizeHalfSteps(halfSteps) {
    return [...new Set(halfSteps.map(normalizeHalfStep))].sort((a, b) => a - b);
}

function getLowestNoteMatchedChord(matchedChords, lowestNoteName) {
    return matchedChords.find((chord) => chord.root === lowestNoteName);
}

function addMatchWithLowestNoteAsRootFirst(matchedChords, lowestNoteChord) {
    matchedChords = matchedChords.filter((chord) => chord !== lowestNoteChord);
    matchedChords.unshift(lowestNoteChord);
    return matchedChords;
}

function getMatchedChords(selectedNoteNumbers, matchedChords) {
    notes.forEach((rootNote) => {
        const relativeSelectedNotes = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNote.number));
        relativeSelectedNotes.sort((a, b) => a - b);
        const normalizedRelativeNotes = normalizeHalfSteps(relativeSelectedNotes);

        for (const [chordName, chordData] of Object.entries(chords)) {
            const chordHalfSteps = chordData.parsedHalfSteps;

            if (normalizedRelativeNotes.length !== chordHalfSteps.length) {
                continue;
            }

            let isMatch = true;
            for (let i = 0; i < chordHalfSteps.length; i++) {
                if (normalizedRelativeNotes[i] !== chordHalfSteps[i]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                matchedChords.push({
                    root: rootNote.name,
                    chord: chordName
                });
            }
        }
    });

    return matchedChords;
}

export function getChordsFromSelectedNotes(selectedNoteNumbers) {
    let matchedChords = [];

    if (selectedNoteNumbers.length === 0) {
        return matchedChords;
    }

    const lowestNoteNumber = Math.min(...selectedNoteNumbers);
    const normalizedLowestNote = normalizeHalfStep(lowestNoteNumber);
    const lowestNoteName = notes.find((note) => note.number === normalizedLowestNote).name;
    matchedChords = getMatchedChords(selectedNoteNumbers, matchedChords);

    // if (matchedChords.length > 0) {
    const lowestNoteChord = getLowestNoteMatchedChord(matchedChords, lowestNoteName);
    if (lowestNoteChord) {
        return addMatchWithLowestNoteAsRootFirst(matchedChords, lowestNoteChord);
    } else {
        // Get chords without the *lowest* note(s) only
        const sortedNotes = [...selectedNoteNumbers].sort((a, b) => a - b);
        const minNote = sortedNotes[0];
        let selectedNotesWithoutLowest = [...sortedNotes];

        // Remove only the *lowest* note(s)
        while (selectedNotesWithoutLowest.length > 0 && selectedNotesWithoutLowest[0] === minNote) {
            selectedNotesWithoutLowest.shift();
        }

        // Then find chords from the remaining notes
        const matchedChordsWithoutLowest = getMatchedChords(selectedNotesWithoutLowest, []).map((chordMatch) => ({
            root: chordMatch.root,
            chord: `${chordMatch.chord} / ${lowestNoteName}`
        }));

        return [...matchedChordsWithoutLowest, ...matchedChords];
    }
}
