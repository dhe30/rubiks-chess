import Piece from "./Piece";

export default class King extends Piece {
    constructor(bcoordinate) {
        super(bcoordinate);
        this.id = "pawn"
        this.firstMove = true
        this.enPassantTarget = false
        this.commands = [
            [[0,1]]
        ]
    }

    getCommands() {
        const commands = structuredClone(this.commands)
        // if pawn is on starting tile, it can move 2 forward}
}