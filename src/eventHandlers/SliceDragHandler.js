class SliceDragHandler {
  constructor(cubeInteraction) {
    this.cubeInteraction = cubeInteraction;
    this.dragThreshold = 0.5; // minimum drag distance to define axis
    this.dragSpeed = 1.3; // magic number from Chrome Cube Lab source couce https://github.com/devdude123/Chrome-Cube-Lab---Cuber/blob/master/cuber/src/scripts/interaction.js#L44

    this.cross = new Vector3();
    this.dragVector = new Vector3();
    this.mouse = new Vector2();
  }

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

  getIntersectionOnPlane(event, plane) {
    const rect =
      this.cubeInteraction.renderer.domElement.getBoundingClientRect();
    // convert pixel coords to NDC (mapped onto near clipping plane)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // ray from camera to NDC on near clipping plane (into scene)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectionPoint = new Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    return intersectionPoint;
  }

  canHandle(raycastResult) {
    if (!raycastResult) return false;
    return true;
  }

  onStart(event, raycastResult) {
    this.start = raycastResult.point;
    this.plane = raycastResult.plane;
    this.axisDefined = false;
    this.active = raycastResult.object;
    this.time = Date.now();
  }

  onMove(event) {
    const point = this.getIntersectionOnPlane(event, this.plane);
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
        this.cubeInteraction.cube.object.matrixWorld
      );
      const invCubeRotation = cubeRotation.clone().invert();
      const cubeLocalAxis = axis
        .clone()
        .applyMatrix4(invCubeRotation)
        .normalize();
      const index = this.snapVectorToBasis(cubeLocalAxis); // snap axis and return axis as index
      const layer = Math.round(
        Object.values(this.active.userData.logicalPosition)[index]
      );
      this.cubeInteraction.cube.slicer.getSlice(index, layer, cubeLocalAxis); // sets slice for rotation (slice is relative to the cube, so we use cubeLocalAxis)
      this.axis = cubeLocalAxis.applyMatrix4(cubeRotation).normalize();

      // direction of rotation (essentially drag vector but perpendicular)
      this.cross.crossVectors(this.axis, this.faceWorldNormal);

      this.axisDefined = true;
    }
    if (this.axisDefined) {
      const dot = this.cross.dot(dragVector);
      const angle = (dot / this.cubeInteraction.cube.size) * this.dragSpeed;
      this.angle = angle; // record to calculate snap on mouse up
      this.cubeInteraction.cube.slicer.update(angle); // updates slice defined in previous block
    }
  }

  onEnd(event) {
    if (this.axisDefined) {
      let snappedAngle =
        Math.round((this.angle / Math.PI) * 0.5 * 4.0) * Math.PI * 0.5;
      const interactionVelocity =
        this.dragVector.length() / (Date.now() - this.time);
      // NOTE: if gameController is activated, only 90* turns are permitted and interaction velocity doesn't add additional turns
      if (interactionVelocity > 0.3) {
        snappedAngle +=
          this.cross.dot(this.dragVector.normalize()) > 0
            ? Math.PI / 2
            : -(Math.PI / 2);
      }

      //REFACTOR: add remapping simulation and baking here instead of in Slicer

      this.cubeInteraction.cube.slicer.end(this.angle, snappedAngle);
    }
  }
}
