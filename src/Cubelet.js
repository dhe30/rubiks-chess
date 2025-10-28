import * as THREE from 'three'
import faceRotationMap, { mapToBoard } from './faceRotationMap';
import Cube from './Cube';
// REFACTOR Cubelet class to extend Mesh and get rid of object field

export default class Cubelet {
    /**
     * @param {Cube} cube
     */
    constructor(position, offset, cube) {
        const arr = [0x00ff00, 0xff0000]
        const randomIndex = Math.floor(Math.random() * arr.length);
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: arr[randomIndex] })
        this.cube = cube
        this.offset = offset
        this.object = new THREE.Mesh(geometry, material)
        this.object.position.set(position.x - offset, position.y - offset, position.z - offset)
        this.object.userData.logicalPosition = {...position}
        this.isMapped = false

        this.faces = {
            front: null,
            back: null,
            left: null,
            right: null,
            top: null,
            bottom: null
        }
    }

    // sets isEdge, isFace, is 
    initFaces() {
        if (this.object.position.x === this.offset) this.faces.front = this.cube.
    }

    setLogicalPosition(arr) {
        this.object.userData.logicalPosition = {
            x: arr[0],
            y: arr[1],
            z: arr[2]
        }
    }

    mapCubeletRotationOnBoard(rotation, record) {
        // calls mapFaceRotation on faces with tiles
        for (const face of Object.keys(this.faces)) {
            if (this.faces[face] != null) {
                this.mapFaceRotation(face, rotation, record)
            }
        }
    }

    mapFaceRotation(face, rotation, record) {
        const prev = mapToBoard(face, ...this.object.userData.logicalPosition)
        const rotatedFace = faceRotationMap[rotation][face]
        // faceRotationMap returns 0-indexed positions only if given offset 
        const twist = faceRotationMap[rotation].twist(this.object.position.x, this.object.position.y, this.object.position.z, this.offset)
        const next = mapToBoard(rotatedFace, twist.x, twist.y, twist.z)

        record[this.bStringId(next)] = this.cube.board[prev.face].tiles[prev.x][prev.y]
    }

    bStringId(a) {
        return `${a.face} ${a.x} ${a.y}`
    }
}