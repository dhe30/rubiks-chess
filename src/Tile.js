export default class Tile {
    constructor(value = {}) {
        this.pos = value
        this.piece = null
        this.highlighted = false
        this.threats = new Set()
    }

    place(piece) {
        this.piece = piece
    }
    
}