import * as THREE from 'three'
import Cubelet from './Cubelet'
import Slicer from './Slicer'
export default class Cube {
    /**
     * 
     * @param {[Cubelet]} cubelets 
     * @param {*} size 
     */
    constructor(scene, size) {
        this.cubelets = []
        this.size = size
        this.object = new THREE.Group()
        this.initCubelets()
        this.slicer = new Slicer(this)
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

    update(axis, layer, angle) {
        const slice = this.slicer.getSlice(axis, layer)
    }
}