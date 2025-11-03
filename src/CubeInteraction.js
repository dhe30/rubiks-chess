import { Vector2, Matrix4, Raycaster, Vector3, Plane } from "three";
import Cube from "./Cube";
import { getFaceFromNormal } from "./utilities/utilities";
import GameController from "./GameController";
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
    this.prevState = {
      tile: null,
      face: null,
      cubelet: null
    }


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

  }

  initEventListeners() {
    this.container.addEventListener("mousedown", (e) => {
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
      faceLocalNormal : intersection.face.normal,
      point,
      plane,
    };
  }
  getIntersectionOnPlane(event, plane) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    // convert pixel coords to NDC (mapped onto near clipping plane)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // ray from camera to NDC on near clipping plane (into scene)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectionPoint = new Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    return intersectionPoint;
  }
  /**
   * @param {Vector3} vector
   */
  // modifies input vector and returns the index of dominant direction (0:x,1:y,2:z)
  snapVectorToBasis(vector) {
    let max = Math.max(
      Math.abs(vector.x),
      Math.abs(vector.y),
      Math.abs(vector.z)
    );
    vector.x = (vector.x / max) | 0;
    vector.y = vector.x ? 0 : (vector.y / max) | 0;
    vector.z = vector.x || vector.y ? 0 : (vector.z / max) | 0;
    return Math.abs(vector.x)
      ? 0
      : Math.abs(vector.y)
      ? 1
      : Math.abs(vector.z)
      ? 2
      : -1;
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
    const { intersection, object, faceWorldNormal, faceLocalNormal, point, plane } =
      this.getRaycastIntersection(event);
    if (!intersection) return;
    console.log("not null!");
    this.active = object;
    this.start = point;
    this.faceWorldNormal = faceWorldNormal;
    this.faceLocalNormal = faceLocalNormal;
    this.time = Date.now();
    this.plane = plane;
    this.isDragging = true;
  }

  onMouseMove(event) {
    if (!this.isDragging) return;
    console.log("moving!");
    if (!this.active) return;
    const point = this.getIntersectionOnPlane(event, this.plane);
    if (!point) return;
    // console.log("dragging!")
    const dragVector = this.dragVector.subVectors(point, this.start); // direction
    const projected = dragVector.projectOnPlane(this.faceWorldNormal); // project drag vector onto face

    if (!this.axisDefined && dragVector.length() > this.dragThreshold) {
      // axis of rotation (not perpendicular, so we need to snap to x, y, or z)
      const axis = new Vector3()
        .crossVectors(this.faceWorldNormal, projected)
        .normalize();

      // snapping is very easy if we're snapping to global x, y, z: +/-[1, 0, 0], +/-[0, 1, 0], +/-[0, 0, 1]
      // but the cube might be rotated! so:
      // we need to un-rotate the axis accoording to the cube's rotation, snap to the global axis, and re-rotate
      const cubeRotation = new Matrix4().extractRotation(
        this.cube.object.matrixWorld
      );
      const invCubeRotation = cubeRotation.clone().invert();
      const cubeLocalAxis = axis
        .clone()
        .applyMatrix4(invCubeRotation)
        .normalize();

      const index = this.snapVectorToBasis(cubeLocalAxis); // snap axis and return axis as index
      const layer = Math.round(this.active.position.toArray()[index]);
      this.cube.slicer.getSlice(index, layer, cubeLocalAxis); // sets slice for rotation (slice is relative to the cube, so we use cubeLocalAxis)

      // return axis to the cube
      this.axis = cubeLocalAxis.applyMatrix4(cubeRotation).normalize();

      // direction of rotation (essentially drag vector but perpendicular)
      this.cross.crossVectors(this.axis, this.faceWorldNormal);

      this.axisDefined = true;
    }

    if (this.axisDefined) {
      const dot = this.cross.dot(dragVector);
      const angle = (dot / this.cube.size) * this.dragSpeed;
      this.angle = angle; // record to calculate snap on mouse up
      this.cube.slicer.update(angle); // updates slice defined in previous block
    }
  }

  onMouseUp(event) {
    this.isDragging = false;
    if (this.axisDefined) {
      let snappedAngle = Math.round((this.angle / Math.PI) * 0.5 * 4.0) * Math.PI * 0.5;
      const interactionVelocity =this.dragVector.length() / (Date.now() - this.time);
      // NOTE: if gameController is activated, only 90* turns are permitted and interaction velocity doesn't add additional turns
      if (interactionVelocity > 0.3) {
        snappedAngle +=
          this.cross.dot(this.dragVector.normalize()) > 0
            ? Math.PI / 2
            : -(Math.PI / 2);
      }

      //REFACTOR: add remapping simulation and baking here instead of in Slicer

      this.cube.slicer.end(this.angle, snappedAngle);
    } else { // ADD CONDITIONAL: if not rotating cube
        // no drag, procced as tile click event
        if (!this.active) {
          this.clearGameState()
          return
        } 
        const clickedTile = this.active.tileFromFaceNormal(this.faceLocalNormal)
        const face = getCubeFaceFromNormal(this.active, this.faceLocalNormal)
        gameLoop(clickedTile, face)
    }
  }

  clearGameState() {
    this.prev.tile = null
    this.prev.face = null
    this.prev.cubelet = null
    if (this.highlighted) {
      this.toggleHighlights(this.highlighted, false)
    }
    this.highlighted = null
  }

  gameLoop(tile, face) {
    if (this.highlighted) {
      if(this.highlighted.has(tile)) { // click legal move
        this.gameController.move(this.prev.tile, this.prev.face, tile, face)
        this.endTurn()
      } else if (tile.piece && tile.piece.group == this.gameController.turn) { // click another piece
        this.clearGameState()
        this.highlighted = this.gameController.getMoves(tile)
        this.toggleHighlights(this.highlighted)
      } else { // click random tile 
        this.clearGameState()
        return
      }
    } else {
      this.highlighted = this.gameController.getMoves(tile)
      this.toggleHighlights(this.highlighted)
    
    }
  }

  toggleHighlights(tileList, on = true) {
    for (const tile of tileList) {
      const { cubelet, face } = this.cube.tileToCubelet.get(tile)
      if (on) {
        cubelet.highight(face)
      } else {
        cubelet.unhighlight(face)
      }
    }
  }

  endTurn() {
    this.gameController.endTurn()
    this.clearGameState()
  }
}
