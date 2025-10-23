import { Group, Vector3 } from 'three'
import Cube from './Cube';
export default class Slicer {
    /**
     * 
     * @param {Cube} cube 
     */
    constructor(cube) {
        this.cube = cube
        this.cache = {}
        this.slice = new Group;
        this.cube.group.add(slice)
        this.q = this.slice.quaternion
        this.axis = new Vector3()
        this.children = []
    }

    // utility for keeping world transforms when reparenting (Object3D.attach())
    reparentAndBake(child, newParent) {
        const childWorldMatrix = child.worldMatrix.clone()
        child.parent.remove(child)
        newParent.add(child)
        child.matrix.copy(child.parent.worldToLocal(childWorldMatrix))
        child.matrix.decompose(child.position, child.quaternion, child.scale)
    }

    // sets slice that is currently being dragged 
    getSlice(axisIndex, layer, axis) {
        this.slice.clear()
        const slice = []
        for (let i = 0; i < this.cube.cubelets.size(); i++) {
            const cubelet = this.cube.cubelets[i].object
            if (cubelet.position[axisIndex] == layer) {
                this.children.push(cubelet)
                // we must transfer cubelets from the cube group to the slice group 
                this.reparentAndBake(cubelet, this.slice)
            }
        }
        this.axis.copy(axis) // passed axis is cubeLocalAxis 
    }

    update(angle) {
        this.q.setFromAxisAngle(this.axis, angle)
        this.slice.quaternion.copy(q)
    }

    end(angle) {
        //we need to tween the angle for an snap animation
        for (const cubelet of children) {
            this.reparentAndBake(cubelet, this.cube.group)
        }
    }
}