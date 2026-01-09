import Piece from './Piece.js';
export default class TestUpPiece extends Piece {
    constructor(bcoordinate) {
        super(bcoordinate)
        this.id = "test-up"
        this.commands = [[[ 0, 100 ]]] // move up on y-axis
    }
}