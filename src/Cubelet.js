import * as THREE from 'three'
import { bStringId, mapToBoard, faceRotationMap } from './faceRotationMap';
import Cube from './Cube';
import { faceVectors } from './utilities/utilities';
// REFACTOR Cubelet class to extend Mesh and get rid of object field

export default class Cubelet extends THREE.Mesh{
    /**
     * @param {Cube} cube
     */
    constructor(position, offset, cube) {
        const arr = [0x00ff00, 0xff0000]
        const randomIndex = Math.floor(Math.random() * arr.length);
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const faceMaterials = {
            right: new THREE.MeshBasicMaterial({ color: arr[randomIndex] }),
            left: new THREE.MeshBasicMaterial({ color: arr[randomIndex] }),
            top: new THREE.MeshBasicMaterial({ color: arr[randomIndex] }),
            bottom: new THREE.MeshBasicMaterial({ color: arr[randomIndex] }),
            front: new THREE.MeshBasicMaterial({ color: arr[randomIndex] }),
            back: new THREE.MeshBasicMaterial({ color: arr[randomIndex] })
        }
        for (const material of Object.values(faceMaterials)) {
            material.userData.originalColor = material.color.clone()
        }
        super(geometry, Object.values(faceMaterials))
        this.faceMaterials = faceMaterials
        this.cube = cube
        this.offset = offset
        // this.object = new THREE.Mesh(geometry, material)
        this.position.set(position.x - offset, position.y - offset, position.z - offset)
        this.userData.logicalPosition = {...position} // redundant for computing position, but needed for storing stale position values when remapping board 
        this.isMapped = false

        this.faces = {
            front: null,
            back: null,
            left: null,
            right: null,
            top: null,
            bottom: null
        }

        this.dirty = false // track outdated tile renders

    }

    // sets isEdge, isFace, is 
    // should access board through cube or pass as argument?
    initFaces(board) {
        const position = Object.values(this.userData.logicalPosition)
        if (this.position.x === this.offset) this.faces.right = board.getTileReference("right", position)
        if (this.position.x === -this.offset) this.faces.left = board.getTileReference("left", position)
        if (this.position.y === this.offset) this.faces.top = board.getTileReference("top", position)
        if (this.position.y === -this.offset) this.faces.bottom = board.getTileReference("bottom", position)
        if (this.position.z === this.offset) this.faces.front = board.getTileReference("front", position)
        if (this.position.z === -this.offset) this.faces.back = board.getTileReference("back", position)
        this.renderTiles()
    }

    setLogicalPosition(arr) {
        this.userData.logicalPosition = {
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
        const { x, y, z } = this.userData.logicalPosition
        const prev = mapToBoard(face, x, y, z)
        const rotatedFace = faceRotationMap[rotation][face]
        // faceRotationMap returns 0-indexed positions only if given offset 
        const twist = faceRotationMap[rotation].twist(x, y, z, this.offset)
        const next = mapToBoard(rotatedFace, twist.x, twist.y, twist.z)

        record[bStringId(next)] = this.cube.board[prev.face].tiles[prev.x][prev.y]
    }

    tileFromFaceNormal(localNormal) {
        for (const [face, vector] of Object.entries(faceVectors)) {
            if (vector.equals(localNormal)) return this.faces[face]
        }
    }

    highlight(face) {
        // lights up local face 
        this.faceMaterials[face].color.setHex(0xff69b4)
    }

    unhighlight(face) {
        this.faceMaterials[face].color.set(this.faceMaterials[face].userData.originalColor)
    }

    renderTiles() {
        // change this.faces into an object with tile and render fields
        this.clear() // destroy all children
        for (const face of Object.keys(this.faces)) {
            const tile = this.faces[face]
            if (tile == null) continue;
            if (tile.piece) {
                const push = faceVectors[face].clone().multiplyScalar(0.5) // vector to push piece outwards (magic number 0.5 is half cubelet size)
                const mesh = tile.piece.create() // get piece object 3D
                mesh.position.copy(push) // scale direction to offset
                this.add(mesh)
            }
        }
    }
}