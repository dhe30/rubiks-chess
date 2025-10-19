import * as THREE from 'three'
export default class Cubelet {
    constructor(position, offset, cube) {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({ color: '' })
        this.cubelet = new THREE.Mesh(geometry, material)
        this.cubelet.position.set(position.x - offset, position.y - offset, position.z - offset)
        this.cubelet.userData.logicalPosition = {...position}
    }

    // sets isEdge, isFace, is 
    initFaces() {

    }
}