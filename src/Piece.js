export default class Piece {
    
    constructor(bcoordinate) {
        this.position = bcoordinate
        this.commands = [[1,0], [-1,0], [0,1], [0,-1]]
        this.id = "test"
        this.group = 0
    }
}