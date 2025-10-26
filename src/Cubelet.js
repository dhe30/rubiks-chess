import * as THREE from 'three'
import faceRotationMap, { mapToBoard } from './faceRotationMap';
export default class Cubelet {
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
    }

    // sets isEdge, isFace, is 
    initFaces() {

    }

    setLogicalPosition(arr) {
        this.object.userData.logicalPosition = {
            x: arr[0],
            y: arr[1],
            z: arr[2]
        }
    }

    mapCubeletRotationOnBoard(rotation, record) {
        // maps canonical faces with board faces 
        // calls mapFaceRotation on faces with tiles
        // maps board face tiles to rotated board face  
    }

    mapFaceRotation(face, rotation, record) {
        const prev = mapToBoard(face, ...this.object.userData.logicalPosition)
        const rotatedFace = faceRotationMap[rotation][face]
        const next = mapToBoard(rotatedFace, this.object.position.x, this.object.position.y, this.object.position.z)

        record[this.bString(next)] = this.cube.board[prev.face].tiles[prev.x][prev.y]
    }

    bString(a) {
        return `${a.face} ${a.x} ${a.y}`
    }
}