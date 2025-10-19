import { Vector2, Matrix4, Raycaster, Vector3 } from 'three'
import Cube from './Cube'
export default class CubeInteraction {
    /** 
     * @param {import('three').WebGLRenderer} renderer
     * @param {Cube} cube
     */
    constructor(cube, container, renderer) {
        this.cube = cube
        this.container = container 
        this.renderer = renderer
        this.mouse = new Vector2() // normalized device coordinates (NDC) formula https://stackoverflow.com/questions/58293221/convert-screen-coordinates-to-metals-normalized-device-coordinates
        this.raycaster = new Raycaster()
        this.dragSpeed = 1.3 // magic number from Chrome Cube Lab source couce https://github.com/devdude123/Chrome-Cube-Lab---Cuber/blob/master/cuber/src/scripts/interaction.js#L44 
    }

    /** 
     * @param {MouseEvent} event
     */
    getRaycastIntersection(event) {
        const rect = this.renderer.domElement.getBoundingClientRect()

        // convert pixel coords to NDC (mapped onto near clipping plane)
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.mouse.y = ((event.clientY - rect.top) / rect.height) * 2 - 1

        // ray from camera to NDC on near clipping plane (into scene)
        this.raycaster.setFromCamera(this.mouse, this.camera)

        const intersects = this.raycaster.intersectObjects(this.cube.cubelets, true)
        if (!intersects.length) return null

        const intersection = intersects[0]
        const cubelet = intersection.object

        const faceWorldNormal = intersection.face.normal.clone().applyMatrix4(new Matrix4().extractRotation(cubelet.matrixWorld))
        return {
            intersection,
            object: cubelet,
            faceWorldNormal,
            point: intersection.point.clone()
        }
    }

    reset() {
        this.active = null // cubelet clicked
        this.faceWorldNormal = null // clicked face of cubelet
        this.point = null
        this.time = null
    }

    onMouseDown(event) {
        this.reset()
        const { intersection, object, faceWorldNormal, point } = this.getRaycastIntersection(event)
        if (!intersection) return;
        this.active = object
        this.start = point
        this.faceWorldNormal = faceWorldNormal
        this.time = Date.now()
    }

    onMouseMove(event) {
        if (!this.active) return;
        const point = this.getRaycastIntersection(event)?.point
        if (!point) return;

        const dragVector = point.clone().sub(this.start) // direction 
        const projected = dragVector.projectOnPlane(this.faceWorldNormal)
        const axis = new Vector3().crossVectors(this.faceWorldNormal, projected)
        const dot = axis.dot(dragVector)
        const angle = dot / this.cube.size * this.dragSpeed

    }
}