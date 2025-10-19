export default class Slices {
    constructor(cube) {
        this.cube = cube
        this.cache = {}
    }

    // Returns an array of cubelets that need to be rotated
    // POSSIBLY OPTIMIZE BY CACHING ALL SLICES -> need to remap indicies
    getSlice(axis, layer) {
        // check cache
        const slice = []
        // else, calculate new slice
        for (let i = 0; i < this.cube.cubelets.size(); i++) {
            const cubelet = this.cube.cubelets[i]
            if (cubelet.position[axis] == layer) slice.push(cubelet)
        }
        return slice
    }
}