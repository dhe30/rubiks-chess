import { Vector2, Matrix4, Raycaster, Vector3, Plane } from "three";
import Cube from "./Cube";
// import { getFaceFromNormal } from "./utilities/utilities";
import GameController from "./GameController";
import SliceDragHandler from "./eventHandlers/SliceDragHandler";
import ClickHandler from "./eventHandlers/ClickHandler";
import IdleHandler from "./eventHandlers/IdleHandler";
import OrbitDragHandler from "./eventHandlers/OrbitDragHandler";

export const InteractionState = {
  IDLE: "idle",
  DRAGGING_SLICE: "dragging_slice",
  CLICK: "click",
  DRAGGING_ORBIT: "dragging_orbit",
};

export default class CubeInteraction {
  /**
   * @param {import('three').WebGLRenderer} renderer
   * @param {Cube} cube
   * @param {HTMLElement} container
   * @param {GameController} gameController
   */
  constructor(cube, container, gameController) {
    this.cube = cube;
    this.gameController = gameController;

    this.container = container;
    this.renderer = cube.renderer.renderer;
    this.camera = cube.renderer.camera;
    this.mouse = new Vector2(); // normalized device coordinates (NDC) formula https://stackoverflow.com/questions/58293221/convert-screen-coordinates-to-metals-normalized-device-coordinates
    this.raycaster = new Raycaster();
    this.dragSpeed = 1.3; // magic number from Chrome Cube Lab source couce https://github.com/devdude123/Chrome-Cube-Lab---Cuber/blob/master/cuber/src/scripts/interaction.js#L44
    this.dragThreshold = 0.5;
    this.cross = new Vector3();
    this.dragVector = new Vector3();
    this.initEventListeners();
    this.isDragging = false;

    this.state = InteractionState.IDLE;
    this.handlers = {
      [InteractionState.IDLE]: new IdleHandler(this),
      [InteractionState.DRAGGING_SLICE]: new SliceDragHandler(this),
      [InteractionState.CLICK]: new ClickHandler(this),
      [InteractionState.DRAGGING_ORBIT]: new OrbitDragHandler(this),
    };
    this.activeHandler = null;
  }

  initEventListeners() {
    this.container.addEventListener(
      "mousedown",
      (e) => {
        e.preventDefault();
        // this.container.setPointerCapture(e.pointerId)
        this.onMouseDown(e);
      },
      { passive: false }
    );
    this.container.addEventListener("mousemove", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.onMouseMove(e);
    });
    this.container.addEventListener("mouseup", (e) => {
      // this.container.releasePointerCapture && this.container.releasePointerCapture(e.pointerId);
      this.onMouseUp(e);
    });
  }
  /**
   * @param {MouseEvent} event
   */
  getRaycastIntersection(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    // convert pixel coords to NDC (mapped onto near clipping plane)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // ray from camera to NDC on near clipping plane (into scene)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.cube.cubelets.map((c) => c), // Refactor if map is not needed
      true
    );
    if (!intersects.length) return null;

    const intersection = intersects[0];
    const cubelet = intersection.object;

    const faceWorldNormal = intersection.face.normal
      .clone()
      .applyMatrix4(new Matrix4().extractRotation(cubelet.matrixWorld));
    const point = intersection.point.clone();
    const plane = new Plane().setFromNormalAndCoplanarPoint(
      faceWorldNormal,
      point
    );
    return {
      intersection,
      object: cubelet,
      faceWorldNormal,
      faceLocalNormal: intersection.face.normal,
      point,
      plane,
    };
  }

  setState(newState) {
    this.state = newState;
    this.activeHandler = this.handlers[newState];
  }

  reset() {
    this.active = null; // cubelet clicked
    this.faceWorldNormal = null; // clicked face of cubelet
    this.start = null;
    this.time = null;
    this.plane = null;
    this.cube.slicer.slice.clear();

    this.axisDefined = false;

    this.angle = 0;
  }
  /**
   *
   * @param {import('three').Mesh} object
   * @returns
   */
  onMouseDown(event) {
    console.log("down");
    this.reset(); // clears vars associated with previous mouse down event
    const raycastResult = this.getRaycastIntersection(event);
    // if (!raycastResult) return;
    // console.log("not null!");
    // this.active = raycastResult.object;
    // this.start = raycastResult.point;
    // this.faceWorldNormal = raycastResult.faceWorldNormal;
    // this.faceLocalNormal = raycastResult.faceLocalNormal;
    this.time = Date.now();
    // this.plane = raycastResult.plane;
    this.isDragging = true;

    for (const [state, handler] of Object.entries(this.handlers)) {
      if (handler.canHandle(raycastResult)) {
        this.state = state;
        this.activeHandler = handler;
        this.activeHandler.onStart(event, raycastResult);
        break;
      }
    }
  }

  onMouseMove(event) {
    this.activeHandler?.onMove(event);
  }

  onMouseUp(event) {
    this.activeHandler?.onEnd(event);
  }
}
