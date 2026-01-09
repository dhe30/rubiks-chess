import Piece from "./Piece";

export default class King extends Piece {
    constructor(bcoordinate) {
        super(bcoordinate);
        this.id = "king"
        this.commands = [
            [[1,0]], [[0,1]], [[-1,0]], [[0,-1]], // orthogonal moves
            [[1,1]], [[1,-1]], [[-1,1]], [[-1,-1]] // diagonal moves
        ]
    }
}