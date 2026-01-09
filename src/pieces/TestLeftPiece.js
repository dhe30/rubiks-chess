import Piece from './Piece.js'
export default class TestLeftPiece extends Piece {
    constructor(bcoordinate) {
        super(bcoordinate)
        this.id = "test-left"
        this.commands = [[[ -1, 0 ]]] // move left on x-axis
    }
}