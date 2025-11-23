import Board from "./Board"
import { getTransform } from "./faceRotationMap"
import Piece from "./Piece"
import { boundedWalk } from "./utilities/lambdas"

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
        this.players = groups.length
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
        let index = 0
        for (const group of this.groups) {
            for (const piece of group) {
                this.board.getTile(piece.position).place(piece)
                // set piece's group field 
                piece.group = index
            }
            index++
        }
    }

    move(from, fromFace, to, toFace) { // tile objects with cube local faces
        // calculate transform from cube local face normals in cubeInteraction (BFS on transitions (two layers max)
        // move piece from from to to tile, and transform piece commands based on transform param


        // the to tile should always be part of from's legal move set 

        bury(to.piece)
        to.piece = from.piece
        from.piece = null

        const transform = getTransform(fromFace, toFace)

        to.piece.commands.forEach(command => transform(command))
    }

    bury(piece) { // handle capture
        
    }

    getMoves(piece) {
        return this.legalMoves[piece.group][piece.id]
    }

    findLegalMoves(piece) {
        const legalSet = this.getMoves(piece)
        legalSet.clear()
        this.board.walkAll(piece.position, piece.getCommands(), boundedWalk(legalSet))
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