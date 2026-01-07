/**
 * @param {MouseEvent} event
 */
export function getRaycastIntersection(event) {
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

export function getIntersectionOnPlane(event, plane) {
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
