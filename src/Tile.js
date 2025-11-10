export default class Tile {
    constructor(value = "none") {
        this.value = value
        this.piece = null
        this.highlighted = false
    }

    place(piece) {
        this.piece = piece
    }
    
}