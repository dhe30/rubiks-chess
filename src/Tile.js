export default class Tile {
    constructor(value = "none") {
        this.value = value
        this.piece = null
        this.id = "test"
    }

    place(piece) {
        this.piece = piece
    }
    
}