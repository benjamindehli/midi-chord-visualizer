export function getRelativeNoteNumber(noteNumber, keyNoteNumber) {
    let relativeNumber = noteNumber - keyNoteNumber;
    if (relativeNumber < 0) {
        relativeNumber += 12;
    }
    return relativeNumber;
}
