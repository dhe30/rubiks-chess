export default class Tile {
    constructor(value = "none") {
        this.value = value
        this.piece = null
        this.id = "test"
        this.group = 0
        this.highlighted = false
    }

    place(piece) {
        this.piece = piece
    }
    
}