import { GameEvents } from "../eventHandlers/EventTypes.js";
import { gameEvents } from "../eventHandlers/EventEmitter.js";

/*
* UI Controller mapping board coordinate UI commands to cube
*/
export default class UIController {
    constructor(cube) {
        this.cube = cube;
        this.highlighted = [];
        gameEvents.on(GameEvents.AVAILABLE_MOVES_UPDATED, this.updateHighlights.bind(this));
    }
    /**
     * Clears all highlights by invoking cubelets' unhightlight method, then highlights new cubelet faces.
     * @param {{face: string, x: number, y: number}} availableMoves 
     */
    updateHighlights({availableMoves}) {
        this.clearAllHighlights()
        ;
        for (const move of availableMoves) {
            const tileRef = this.cube.board.getTile(move);
            const {cubelet, face} = this.cube.tileToCubelet.get(tileRef);
            cubelet.highlight(face);
            this.highlighted.push(tileRef)
        }
    }

    /** References the list of highlighted tiles and unhighlights them by finding the mapped cublet */
    clearAllHighlights() {
        for (const tile of this.highlighted) {
        const { cubelet, face } = this.cube.tileToCubelet.get(tile);
        cubelet.unhighlight(face);
        }
        this.highlighted = [];
    }
}