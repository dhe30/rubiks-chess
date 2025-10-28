import * as THREE from 'three'
import Cubelet from './Cubelet'
import Slicer from './Slicer'
import Renderer from './Renderer'
import CubeInteraction from './CubeInteraction'
import { Group } from '@tweenjs/tween.js'
import Board from './Board'
export default class Cube {
    /**
     * 
     * @param {[Cubelet]} cubelets 
     * @param {*} size 
     */
    constructor(container, size = 3) {
        this.cubelets = []
        this.tweens = new Group()
        this.clock = new THREE.Clock()
        this.size = size

        // fix: board dependency on cube (also make it optional)
        this.board = new Board(this)
        this.object = new THREE.Group()
        this.initCubelets()
        this.slicer = new Slicer(this)
        this.renderer = new Renderer(container, this.object)
        this.interaction = new CubeInteraction(this, container)
        console.log(this.cubelets.length)
        this.animate = this.animate.bind(this);
        this.animate();
    }

    initCubelets() {
        let offset = (this.size - 1) / 2
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                for (let z = 0; z < this.size; z++) {
                    const cubelet = new Cubelet({x, y, z}, offset, this)
                    this.cubelets.push(cubelet)
                    this.object.add(cubelet.object)
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate)
        const delta = this.clock.getDelta();
        this.tweens.update(performance.now())
        this.renderer.render()
    }

    mapToCube(face, x, y) {
    switch (face) {
        case "FRONT":
            return {face: "front", x, y, z: this.size - 1}
        case "BACK":
            return {face: "back", x, y, z: 0}
        case "LEFT":
            return {face: "left", x: 0, y: x, z: y}
        case "RIGHT":
            return {face: "right", x: this.size - 1, y: x, z: y}
        case "BOTTOM":
            return {face: "bottom", x, y: 0, z: y}
        case "TOP":
            return {face: "top", x, y: this.size - 1, z: y}
    }
}
}