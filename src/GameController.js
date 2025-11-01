import Board from "./Board"
import Piece from "./Piece"

export default class GameController {

    /**
     * 
     * @param {Board} board 
     * @param {[Piece]} groups 
     */
    constructor(board, groups = []) {
        this.board = board
        this.groups = groups
        this.setupPieces()
        this.legalMoves = []
        this.players = groups.size()
        for (let i = 0; i < this.players; i++) {
            this.legalMoves.push(new Map())
        }
        this.turn = -1 // 0-indexed
    }

    setupPieces() {
        for (const group of groups) {
            for (const piece of group) {
                this.board.getTile(piece.position).place(piece)
                // set piece's group field 
            }
        }
    }

    /**
     * @param {Piece} piece 
     */

    move(from, to, transform) { // tile objects
        // calculate transform from cube local face normals in cubeInteraction (BFS on transitions (two layers max)
        // move piece from from to to tile, and transform piece commands based on transform param
    }

    boundedWalk(bcoor, record) {
        // if tile at bcoor has a piece, terminate walk (if different group, add tile to record else do nothing)
    }

    getLegalMoves(piece) {
        this.board.walkAll(piece.position, piece.commands, () => {})
    }

    getAllLegalMoves(player) {
        // for each piece in groups[player]:
        // extract piece.commands 
        // call board api with piece.position, piece.commands and lambda getLegal()
    }

    endTurn() {
        this.turn = (this.turn + 1) % this.players
        this.getAllLegalMoves(this.turn)
    }
}