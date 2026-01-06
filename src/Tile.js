export default class Tile {
    constructor(value = {}) {
        this.pos = value
        this.piece = null
        this.highlighted = false
    }

    place(piece) {
        this.piece = piece
    }
    
}