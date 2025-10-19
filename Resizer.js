export default class Resizer {
    constructor(container, camera, renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container = container
        this.camera = camera
        this.renderer = renderer
        
        window.addEventListener("resize", () => {this.onResize()})
    }

    onResize() {
        const { clientWidth, clientHeight } = this.container
        this.camera.aspect = clientHeight / clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(clientWidth, clientHeight)
    }
}