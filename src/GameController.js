import Board from "./Board"
import Piece from "./Piece"
import { boundedWalk } from "./utilities/utilities"

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
        for (const group of groups) {
            const map = new Map()
            for (const piece of group) {
                map.set(piece.id, new Set())
            }
            this.legalMoves.push(map)
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

    move(from, fromFace, to, toFace) { // tile objects
        // calculate transform from cube local face normals in cubeInteraction (BFS on transitions (two layers max)
        // move piece from from to to tile, and transform piece commands based on transform param
    }

    getMoves(piece) {
        return this.legalMoves[piece.group][piece.id]
    }

    findLegalMoves(piece) {
        const legalSet = this.getMoves(piece)
        legalSet.clear()
        this.board.walkAll(piece.position, piece.commands, boundedWalk(legalSet))
    }

    findAllLegalMoves(player) {
        // for each piece in groups[player]:
        // extract piece.commands 
        // call board api with piece.position, piece.commands and lambda getLegal()
        for (const piece of this.groups[player]) {
            this.findLegalMoves(piece)
        }
    }

    endTurn() {
        this.turn = (this.turn + 1) % this.players
        this.getAllLegalMoves(this.turn)
    }
}