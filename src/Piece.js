import * as THREE from 'three'
export default class Piece {
    
    constructor(bcoordinate) {
        this.position = bcoordinate
        // given that a [x,y] pair moves in one direction, a 3D nested array is robust for 
        // any possible movement command (i.e. horses) 
        // if only linear movement is allowed, this can be simplified to a 2D array
        
        // commands[i] starts from original position 
        // commands[i][j] starts from position after commands[i][j-1]
        this.commands = [[[1,0]], [[-1,0]], [[0,1]], [[0,-1]]] 
        this.id = "test"
        this.mesh = null
        this.group = 0
    }

    getCommands() { // return clone of commands
        return structuredClone(this.commands)
    }

    create() {
        const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        return this.mesh
    }
}