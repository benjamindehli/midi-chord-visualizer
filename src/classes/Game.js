import { chordTypes, notes } from "@benjamindehli/music-utils";

export default class Game {
    constructor(level) {
        this.level = level;
        this.rounds = this.getGameRounds(level.chordIds, level.score.max);
        this.activeRoundIndex = 0;
        this.activeRoundScore = 0;
    }

    getGameRounds(chordIds, numberOfRounds) {
        const rounds = [];
        for (let i = 0; i < numberOfRounds; i++) {
            const randomChordId = chordIds[Math.floor(Math.random() * chordIds.length)];
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            const chordData = chordTypes.find(chord => chord.name === randomChordId);
            rounds.push({
                chord: {
                    name: randomNote.name + " " + randomChordId,
                    halfSteps: chordData.halfSteps,
                    parsedHalfSteps: chordData.parsedHalfSteps
                },
                rootNote: randomNote
            });
        }
        return rounds;
    }

    getActiveRound() {
        return this.rounds[this.activeRoundIndex];
    }

    getActiveRoundScore() {
        return this.activeRoundScore;
    }

    advanceToNextRound() {
        if (this.activeRoundIndex < this.rounds.length - 1) {
            this.activeRoundIndex++;
            return true;
        }
        return false;
    }

    addActiveRoundScore(points) {
        if (points) {
            this.activeRoundScore += points;
        } else {
            this.activeRoundScore++;
        }
    }

    reset() {
        this.activeRoundIndex = 0;
        this.activeRoundScore = 0;
    }
}
