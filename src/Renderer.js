import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, DirectionalLight, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
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
        this.camera.position.z = 20 //adjust initial camera view
        this.camera.lookAt(0,0,0)

        //Renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        console.log("Renderer size:", container.clientWidth, container.clientHeight)
        container.appendChild(this.renderer.domElement)
        const resizer = new Resizer(container, this.camera, this.renderer)
        
        //Scene 
        this.scene = new Scene()
        this.scene.add(new AmbientLight(0xffffff, 1))
        const dirLight = new DirectionalLight(0xffffff, 1)
        dirLight.position.set(5, 5, 5)
        this.scene.add(dirLight)
        this.cube = cube
        this.scene.add(this.cube)
        // const testGeom = new BoxGeometry(1, 1, 1)
        // const testMat = new MeshBasicMaterial({ color: 0xff0000 })
        // const testMesh = new Mesh(testGeom, testMat)
        // testMesh.position.set(0, 0, 0)
        // this.scene.add(testMesh)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}