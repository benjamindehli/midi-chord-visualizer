import Score from "./Score";

export default class Level {
    constructor(props) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.scoreToUnlock = props.scoreToUnlock || 0;
        this.chords = props.chords || [];
        this.score = props.score ? new Score(props.score) : new Score({});
    }

    isUnlocked(score) {
        return score >= this.scoreToUnlock;
    }
}
