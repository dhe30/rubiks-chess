import { Euler, Group, Vector3 } from 'three'
import { Tween, Easing } from '@tweenjs/tween.js';
import Cube from './Cube';
import { rotationFromAngleAxis } from './faceRotationMap';
import { quantizePositions, quantizeRotation } from './utilities/utilities';
export default class Slicer {
    /**
     * 
     * @param {Cube} cube 
     */
    constructor(cube) {
        this.cube = cube
        this.cache = {}
        this.slice = new Group();
        this.cube.object.add(this.slice)
        this.q = this.slice.quaternion
        this.axis = new Vector3()
        this.children = []
        this.tween = null
        this.twistDuration = 500
        this.precision = Number.isInteger(this.cube.size - 1 / 2) ? 0 : 1
    }

    // DEPRECIATED! do not use
    // utility for keeping world transforms when reparenting (Object3D.attach())
    reparentAndBake(child, newParent) {
        const childWorldMatrix = child.matrixWorld.clone()
        child.parent.remove(child)
        newParent.add(child)
        child.matrix.copy(child.parent.worldToLocal(childWorldMatrix))
        child.matrix.decompose(child.position, child.quaternion, child.scale)
    }

    // sets slice that is currently being dragged 
    getSlice(axisIndex, layer, axis) {
        this.slice.clear()
        for (let i = 0; i < this.cube.cubelets.length; i++) {
            const cubelet = this.cube.cubelets[i]
            console.log(cubelet.position.toArray())
            if (Object.values(cubelet.userData.logicalPosition)[axisIndex] == layer) {
                cubelet.isMapped = false
                this.children.push(cubelet)
                // we must transfer cubelets from the cube group to the slice group 
                this.slice.attach(cubelet)
            }
        }
        console.log("Did we get the slice?", axisIndex, layer, this.children.length)
        this.axis.copy(axis) // passed axis is cubeLocalAxis 
    }

    update(angle) {
        this.q.setFromAxisAngle(this.axis, angle)
        this.slice.quaternion.copy(this.q)
    }
    
    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    finishTween() {
        this.cube.tweens.remove(this.tween)
        this.tween = null
    }

    quantize(cubelet) {
        quantizePositions(this.precision)(cubelet)
        quantizeRotation(cubelet)
        // cubelet.position.x = Math.round(cubelet.position.x);
        // cubelet.position.y = Math.round(cubelet.position.y);
        // cubelet.position.z = Math.round(cubelet.position.z);
        // const e = new Euler().setFromQuaternion(cubelet.quaternion);
        // e.x = Math.round(e.x / (Math.PI/2)) * (Math.PI/2);
        // e.y = Math.round(e.y / (Math.PI/2)) * (Math.PI/2);
        // e.z = Math.round(e.z / (Math.PI/2)) * (Math.PI/2);
        // cubelet.quaternion.setFromEuler(e);
        cubelet.updateMatrix();
        cubelet.updateMatrixWorld(true);
    }

    end(angle, targetAngle) {
        // we need to tween the angle for an snap animation
        // add Slicer to list of updateables referenced in the render loop, remove in tween callback 
        console.log("ender!", this.radiansToDegrees(angle), this.radiansToDegrees(targetAngle))
        const duration = Math.abs(targetAngle - angle) / (Math.PI / 2) * this.twistDuration
        this.tween = new Tween({angle})
            .to({angle: targetAngle}, duration)
            .easing(Easing.Quartic.Out)
            .onUpdate(({ angle }) => {
                this.update(angle)
            })
            .onComplete(() => {
                this.cube.object.updateMatrixWorld(true)
                console.log(this.children.length)
                const records = {}
                for (const cubelet of this.children) {
                    cubelet.updateMatrixWorld(true)
                    // cubelet.parent.remove(cubelet)
                    this.cube.object.attach(cubelet)
                    cubelet.updateMatrix();           
                    cubelet.updateMatrixWorld(true);
                    this.quantize(cubelet)

                    // remapping logic 
                    // REFACTOR: move to cube interaction to allow game logic simulation 
                    if (targetAngle != 0 && this.cube.board) {
                        //get rotation 
                        const rotation = rotationFromAngleAxis(this.axis.clone(), targetAngle)
                        // console.log(rotation, this.axis, targetAngle)
                        cubelet.mapCubeletRotationOnBoard(rotation, records)
                    }
                    cubelet.setLogicalPosition(cubelet.position.toArray())
                }
                this.cube.board?.bake(records)
                this.q.identity()
                this.children = []
                // also remove from render loop:
                this.finishTween()

            })
            .start()
        this.cube.tweens.add(this.tween)
    }

    tick(delta) {
        this.tween.update()
    }

    // convert this.axis to x, y, z value
    
}