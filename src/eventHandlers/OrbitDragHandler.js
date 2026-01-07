import { Euler, Quaternion } from 'three';
import { InteractionState } from '../CubeInteraction';
import { toRadians } from '../utilities/utilities.js';
import IdleHandler from './IdleHandler.js';
export default class OrbitDragHandler extends IdleHandler {
    constructor(cubeInteraction) {
        super(cubeInteraction);
        this.rotationSpeed = 0.5;
        this.deltaRotationQuaternion = new Quaternion();
        this.previousMousePosition = { x: 0, y: 0 };
    }
    canHandle(raycastResult) {
        return !raycastResult; // only handle if no intersection
    }
    onStart(event, raycastResult) {
        this.previousMousePosition = {x: event.clientX, y: event.clientY};
    }
    onMove(event) {
        const deltaMove = {
            x: event.clientX - this.previousMousePosition.x,
            y: event.clientY - this.previousMousePosition.y
        };

        this.deltaRotationQuaternion.setFromEuler(new Euler(
            toRadians(deltaMove.y * this.rotationSpeed),
            toRadians(deltaMove.x * this.rotationSpeed),
            0,
            'XYZ'
        ));
        this.cubeInteraction.cube.object.quaternion.multiplyQuaternions(this.deltaRotationQuaternion, this.cubeInteraction.cube.object.quaternion);
        this.previousMousePosition = {x: event.clientX, y: event.clientY};
    }
    onEnd(event) {
        this.transition(InteractionState.IDLE)
    }
}