import * as THREE from 'three'
import Cubelet from './Cubelet'

export default class Cube {
    constructor(scene, size) {
        this.cubelets = []
        this.size = size
        this.group = new THREE.group()
        this.initCubelets()
    }

    initCubelets() {
        let offset = (this.size - 1) / 2
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                for (let k = 0; k < this.size; k++) {
                    const cubelet = new Cubelet({i, j, k}, offset, this)
                    this.cubelets.push(cubelet)
                    this.group.add(cubelet)
                }
            }
        }
    }

    // Returns an array of cubelets that need to be rotated
    // POSSIBLY OPTIMIZE BY CACHING ALL SLICES -> need to remap indicies
    getSlice(axis, layer) {
        // check cache
        const slice = []
        // else, calculate new slice
        for (let i = 0; i < this.cubelets.size(); i++) {
            const cubelet = this.cubelets[i]
            if (cubelet.position[axis] == layer) slice.push(cubelet)
        }
        return slice
    }
}