import * as THREE from 'three'
import Cubelet from './Cubelet'
import Slicer from './Slicer'
import Renderer from './Renderer'
import CubeInteraction from './CubeInteraction'
import { Group } from '@tweenjs/tween.js'
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
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                for (let k = 0; k < this.size; k++) {
                    const cubelet = new Cubelet({i, j, k}, offset, this)
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
}