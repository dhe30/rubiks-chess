import * as THREE from 'three'
export default class Cubelet {
    constructor(position, offset, cube) {
        const arr = [0x00ff00, 0xff0000]
        const randomIndex = Math.floor(Math.random() * arr.length);
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: arr[randomIndex] })
        this.object = new THREE.Mesh(geometry, material)
        this.object.position.set(position.i - offset, position.j - offset, position.k - offset)
        this.object.userData.logicalPosition = {...position}
    }

    // sets isEdge, isFace, is 
    initFaces() {

    }
}