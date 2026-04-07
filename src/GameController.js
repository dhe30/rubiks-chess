import Board from "./Board"
import { getTransform } from "./faceRotationMap"
import Piece from "./pieces/Piece"
// import Piece from "./pieces/Piece.js"
import TestDownPiece from "./pieces/TestDownPiece"
import TestLeftPiece from "./pieces/TestLeftPiece"
import TestUpPiece from "./pieces/TestUpPiece"
import Tile from "./Tile"
import { boundedWalk } from "./utilities/lambdas"

export default class GameController {

    /**
     * 
     * @param {Board} board 
     * @param {[Piece]} groups 
     */
    constructor(board, groups = [[new TestLeftPiece({face: "FRONT", x:0,y:0}), new TestUpPiece({face: "FRONT", x:3,y:3}), new TestDownPiece({face: "FRONT", x:5, y:5})]]) {
        this.board = board
        this.groups = groups
        this.setupPieces()
        this.legalMoves = []
        this.players = groups.length
        for (const group of groups) {
            const map = new Map()
            for (const piece of group) {
                map.set(piece.id, [])
            }
            this.legalMoves.push(map)
        }
        this.turn = -1 // 0-indexed
        this.endTurn() // set to player 0
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

    /**
     * Initializes the board's threats for each tile. This function should only be called if the 
     * pieces' step function sets the tile's threats (i.e. boundedWalkThreat)
     */
    initThreats() {
        for (const group of this.groups) {
            for (const piece of group) {
                this.findPseudoLegalMoves(piece)  
            }            
        }
    }

    testMove(from, to) { // tile objects
        const record = [from.pos, from.piece, to.pos, to.piece]
        to.piece = from.piece
        from.piece = null
        to.piece.position = to.pos
        return record
    }

    undoTestMove(record) {
        const [fromPos, fromPiece, toPos, toPiece] = record
        toPiece.position = toPos
        fromPiece.position = fromPos
        fromTile = this.board.getTile(fromPos)
        toTile = this.board.getTile(toPos)
        fromTile.piece = fromPiece
        toTile.piece = toPiece
    }

    /**
     * Moves a piece from one tile to another, handles captures, and transforms piece commands based on face changes. This function does NOT check for legality.
     * @param {Tile} from 
     * @param {Tile} to 
     * @returns 
     */
    move(from, to) { // tile objects with cube local faces
        // calculate transform from cube local face normals in cubeInteraction (BFS on transitions (two layers max)
        // move piece from from to to tile, and transform piece commands based on transform param


        // the to tile should always be part of from's legal move set 

        const fromFace = from.pos.face // trust that the tile's stored position is correct
        const toFace = to.pos.face

        this.bury(to.piece)
        this.testMove(from, to)
        if (fromFace == toFace) return // no transform needed
        const transform = getTransform([fromFace, toFace])

        to.piece.commands.forEach(sequence => sequence.forEach(command => transform(command)))
        // we store positions instead of tiles directly so creating groups of pieces
        // does not depend on having a board configuration already
        console.log("Move function executed", to.piece.commands)
    }

    bury(piece) { // handle capture
        piece.bury()
    }

    getMoves(piece) {
        return this.legalMoves[piece.group].get(piece.id)
    }

    /**
     * Finds pseudo-legal moves for a given piece by invoking its step function 
     * @param {Piece} piece 
     */
    findPseudoLegalMoves(piece) {
        const legalSet = this.getMoves(piece)
        legalSet.clear()
        console.log("Finding legal moves for piece", piece, piece.position)
        this.board.walkAll(piece.position, piece.getCommands(), piece.stepFunction(legalSet))
        console.log(legalSet)
    }

    findAllLegalMoves(player) {
        // for each piece in groups[player]:
        // extract piece.commands 
        // call board api with piece.position, piece.commands and lambda getLegal()
        for (const piece of this.groups[player]) {
            this.findPseudoLegalMoves(piece) // updates this.legalMoves
            this.getMoves(piece).filter(move => { // accesses pseudolegal moves and retains only legal ones
                const testMove = this.testMove(this.board.getTile(piece.position), move)
                const legal = this.isKingInCheck(player)
                this.undoTestMove(testMove)
                return legal
            })
        }
    }

    isKingInCheck(player) {

    }

    endTurn() {
        this.turn = (this.turn + 1) % this.players
        this.findAllLegalMoves(this.turn)
    }
}