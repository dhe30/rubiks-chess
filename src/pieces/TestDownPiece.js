import Piece from './Piece.js'
export default class TestDownPiece extends Piece {
    constructor(bcoordinate) {
        super(bcoordinate)
        this.id = "test-down"
        this.commands = [[[ 0, -1 ]]] // move down on y-axis
    }
}