import Tile from "./Tile"

export default class Board {
    constructor(cube) {
        this.cube = cube
        this.offset = (cube.size - 1) / 2
        const size = cube.size
        this.FRONT = {tiles: this.initFace(size)}
        this.BACK = {tiles: this.initFace(size)}
        this.LEFT = {tiles: this.initFace(size)}
        this.RIGHT = {tiles: this.initFace(size)}
        this.TOP = {tiles: this.initFace(size)}
        this.BOTTOM = {tiles: this.initFace(size)}
        
        // init neighbors 
        this.FRONT.up = this.TOP
        this.FRONT.left = this.LEFT 
        this.FRONT.right = this.RIGHT
        this.FRONT.down = this.BOTTOM

        this.BACK.up = this.TOP
        this.BACK.left = this.LEFT
        this.BACK.right = this.RIGHT 
        this.BACK.down = this.BOTTOM

        this.LEFT.up = this.FRONT
        this.LEFT.left = this.BOTTOM
        this.LEFT.right = this.TOP
        this.LEFT.down = this.BACK

        this.RIGHT.up = this.TOP
        this.RIGHT.left 
    }

    step(command) {
        const res = {x: 0, y: 0}
        if (command[0]) {
            const sign = command[0] > 0 ? 1 : -1
            res.x = sign 
            command[0] += -1 * sign
        }
        if (command[1]) {
            const sign = command[1] > 0 ? 1 : -1
            res.y = sign 
            command[1] += -1 * sign
        }
        return res
    }

    diagonalAtCorner(x, y) {
        return (x >= this.size && y >= this.size) || (x < 0 && y < 0) || (x < 0 && y >= this.size) || (x >= this.size && y < 0)
    }

    flipNegateYNegateX(commands, flip, negateY, negateX) {
        for (const command of commands) {
            if (flip) {
                const temp = command[0]
                command[0] = command[1]
                command[1] = temp
            }
            if (negateY) command[1] *= -1 
            if (negateX) command[0] *= -1
        }
    }

    frontMove(x, y, commands, onUpdate = () => {}, onComplete = () => {}) { // onUpdate and onComplete callbacks 
        if (!commands.length) {
            onComplete()
            return
        }
        const command = commands[0]
        if (!command[0] && !command[1]) {
            commands.shift()
            this.frontMove(x, y, commands)
        }
        onUpdate(x, y, commands, onComplete)
        const step = step(command)
        y += step.y
        x += step.x
        //diagonal implementation 
        if (this.diagonalAtCorner(x, y)) {
            return 
        }

        if (y >= this.size) {
            // negate y
            this.flipNegateYNegateX(commands, false, true, false)
            return this.topMove(x, y - step.y, commands)
        }
        if (y < 0) {
            return this.bottomMove(x, this.size + y, commands)
        }
        if (x >= this.size) {
            // flip and negate y
            this.flipNegateYNegateX(commands, true, false, true)
            return this.rightMove(y, x - step.x, commands)
        }
        if (x < 0) {
            this.flipNegateYNegateX(commands, true, false, true)
            return this.leftMove(y, this.size + x, commands)
        }

        y += step.y
        x += step.x
    }

    topMove(x, y, commands) {
        return 
    }
    bottomMove(x, y, commands) {
        return 
    }
    rightMove(x, y, commands) {
        return 
    }
    leftMove(x, y, commands) {
        return 
    }

    initFace(size) {
        const face = []
        for (let i = 0; i < size; i++) {
            const row = []
            for (let j = 0; j < size; j++) {
                row.push(new Tile())
            }
            face.push(row)
        }
    }
}