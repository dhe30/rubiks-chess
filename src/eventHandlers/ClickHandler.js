import { getCubeFaceFromNormal } from "../utilities/utilities";
import { InteractionState } from "../CubeInteraction";
import IdleHandler from "./IdleHandler.js";
export default class ClickHandler extends IdleHandler {
  constructor(cubeInteraction) {
    super(cubeInteraction);
    this.prev = {
      tile: null,
      face: null,
      cubelet: null,
    };
    this.dirty = [];
    this.gameController = this.cubeInteraction.gameController;
    this.highlighted = null;
    this.cube = this.cubeInteraction.cube;
  }

  canHandle(raycastResult) {
    if (!raycastResult?.object) return false;
    return true;
  }

  onStart(event, raycastResult) {
    console.log(raycastResult)
    this.active = raycastResult.object;
    this.faceLocalNormal = raycastResult.faceLocalNormal;
  }

  onEnd(event) {
    const clickedTile = this.active.tileFromFaceNormal(this.faceLocalNormal);
    const face = getCubeFaceFromNormal(this.active, this.faceLocalNormal);
    this.gameLoop(clickedTile, face, this.active);
    this.transition(InteractionState.IDLE);
  }

  setPrevState(tile, face, cubelet) {
    this.prev.tile = tile;
    this.prev.face = face;
    this.prev.cubelet = cubelet;
  }

  clearGameState() {
    this.prev.tile = null;
    this.prev.face = null;
    this.prev.cubelet = null;
    if (this.highlighted) {
      this.toggleHighlights(this.highlighted, false);
    }
    this.highlighted = null;
  }

  toggleHighlights(tileList, on = true) {
    if (!tileList) return;
    for (const tile of tileList) {
      const { cubelet, face } = this.cube.tileToCubelet.get(tile);
      if (on) {
        cubelet.highlight(face);
      } else {
        cubelet.unhighlight(face);
      }
    }
  }

  gameLoop(tile, face, cubelet) {
    if (this.highlighted) {
      console.log("has highlighted");
      if (this.highlighted.has(tile)) {
        // click legal move
        this.gameController.move(this.prev.tile, this.prev.face, tile, face);

        this.dirty.push(this.prev.cubelet);
        this.dirty.push(this.active);

        this.endTurn();
      } else if (tile.piece && tile.piece.group == this.gameController.turn) {
        // click another piece
        this.toggleHighlights(this.highlighted, false);

        this.setPrevState(tile, face, cubelet);
        this.highlighted = this.gameController.getMoves(tile.piece);
        this.toggleHighlights(this.highlighted);
      } else {
        // click random tile
        this.clearGameState();
        return;
      }
    } else {
      if (tile.piece == null || tile.piece.group != this.gameController.turn) {
        // click empty tile or opponent piece
        return;
      }
      console.log("highlighted");
      this.setPrevState(tile, face, cubelet);
      this.highlighted = this.gameController.getMoves(tile.piece);
      console.log(this.highlighted);
      this.toggleHighlights(this.highlighted);
    }
  }

  endTurn() {
    console.log("Turn ended");
    // clear highlights first so the highlighted Set isn't mutated
    // by GameController.endTurn() when it recomputes legal moves
    this.clearGameState();
    this.gameController.endTurn();

    // dirty loop
    while (this.dirty.length > 0) {
      const cubelet = this.dirty.pop();
      cubelet.renderTiles();
    }
  }
}
