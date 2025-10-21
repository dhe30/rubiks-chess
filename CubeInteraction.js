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
    /** 
     * @param {Vector3} vector
     */
    // modifies input vector and returns the index of dominant direction (0:x,1:y,2:z) 
    snapVectorToBasis(vector) {
        let max = Math.max(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z))
        vector.x = (vector.x / max)|0
        vector.y = vector.x ? 0 : (vector.y / max)|0
        vector.z = vector.x || vector.y ? 0 : (vector.z / max)|0
        return Math.abs(vector.x) ? 0 : Math.abs(vector.y) ? 1 : Math.abs(vector.z) ? 2 : -1
    }
    reset() {
        this.active = null // cubelet clicked
        this.faceWorldNormal = null // clicked face of cubelet
        this.start = null
        this.time = null
    }
    /**
     * 
     * @param {import('three').Mesh} object 
     * @returns 
     */
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
        const { intersection, object, faceWorldNormal, point } = this.getRaycastIntersection(event)
        if (!point) return;
        const dragVector = point.clone().sub(this.start) // direction 
        const projected = dragVector.projectOnPlane(this.faceWorldNormal)
        const axis = new Vector3().crossVectors(this.faceWorldNormal, projected).normalize()
        const index = this.snapVectorToBasis(axis)
        const layer = object.position.toArray()[index] // is Float?
        const dot = axis.dot(dragVector)
        const angle = dot / this.cube.size * this.dragSpeed
        this.cube.update(axis, layer, angle)
    }
}