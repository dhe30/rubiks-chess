export default class GameController {

    constructor(board, groups) {
        this.board = board
        this.groups = groups
        this.setupPieces()
        this.legalMoves = []

        this.players = groups.size()
        this.turn = -1 // 0-indexed
    }

    setupPieces() {
        for (const group of groups) {
            for (const piece of group) {
                this.board.getTile(piece.position).place(piece)
            }
        }
    }

    getLegalMoves(player) {
        // for each piece in groups[player]:
        // extract piece.commands 
        // call board api with piece.position, piece.commands and lambda getLegal()
    }

    endTurn() {
        this.turn = (this.turn + 1) % this.players
        this.getLegalMoves(this.turn)
    }
}