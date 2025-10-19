import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import Resizer from './Resizer'
export default class Renderer {
    constructor(container, cube) {
        this.container = container
        const fov = 45
        const aspect = container.clientWidth / container.clientHeight
        const near = 0.1
        const far = 1000
        //Camera
        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.camera.position.z = 5 //adjust initial camera view

        //Renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        container.appendChild(this.renderer.domElement)
        const resizer = new Resizer(container, this.camera, this.renderer)
        
        //Scene 
        this.scene = new Scene()

        this.cube = cube
        this.scene.add(this.cube)
    }
}