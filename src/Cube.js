import * as THREE from 'three'
import Cubelet from './Cubelet'
import Slicer from './Slicer'
import Renderer from './Renderer'
import CubeInteraction from './CubeInteraction'
import { Group } from '@tweenjs/tween.js'
import Board from './Board'
import GameController from './GameController'
export default class Cube {
    /**
     * 
     * @param {[Cubelet]} cubelets 
     * @param {*} size 
     * @param {GameController} gameController
     */
    constructor(container, size = 3, gameController = null) {
        this.cubelets = []
        this.tweens = new Group()
        this.clock = new THREE.Clock()
        this.size = size

        // fix: board dependency on cube (also make it optional)
        this.board = gameController?.board
        this.tileToCubelet = new Map()

        this.object = new THREE.Group()
        this.initCubelets()
        if (board) this.initCubeletFaces()
        
        this.slicer = new Slicer(this)
        this.renderer = new Renderer(container, this.object)
        this.interaction = new CubeInteraction(this, container. gameController)

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
                    this.object.add(cubelet)
                }
            }
        }
    }

    initCubeletFaces() {
        for (const cubelet of this.cubelets) {
            cubelet.initFaces(this.board)
            for (const [face, tile] of Object.entries(cubelet.faces)) {
                if (tile) {
                    this.tileToCubelet.set(tile, {cubelet, face})
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
}