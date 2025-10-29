import * as THREE from 'three'
import { bStringId, mapToBoard, faceRotationMap } from './faceRotationMap';
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
        this.object.userData.logicalPosition = {...position} // redundant for computing position, but needed for storing stale position values when remapping board 
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
    // should access board through cube or pass as argument?
    initFaces(board) {
        const position = Object.values(this.object.userData.logicalPosition)
        if (this.object.position.x === this.offset) this.faces.right = board.getTileReference("right", position)
        if (this.object.position.x === -this.offset) this.faces.left = board.getTileReference("left", position)
        if (this.object.position.y === this.offset) this.faces.top = board.getTileReference("top", position)
        if (this.object.position.y === -this.offset) this.faces.bottom = board.getTileReference("bottom", position)
        if (this.object.position.z === this.offset) this.faces.front = board.getTileReference("front", position)
        if (this.object.position.z === -this.offset) this.faces.back = board.getTileReference("back", position)
    }

    setLogicalPosition(arr) {
        this.object.userData.logicalPosition = {
            x: arr[0] + this.offset,
            y: arr[1] + this.offset,
            z: arr[2] + this.offset
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
        const { x, y, z } = this.object.userData.logicalPosition
        const prev = mapToBoard(face, x, y, z)
        const rotatedFace = faceRotationMap[rotation][face]
        // faceRotationMap returns 0-indexed positions only if given offset 
        const twist = faceRotationMap[rotation].twist(x, y, z, this.offset)
        const next = mapToBoard(rotatedFace, twist.x, twist.y, twist.z)

        record[bStringId(next)] = this.cube.board[prev.face].tiles[prev.x][prev.y]
    }
}