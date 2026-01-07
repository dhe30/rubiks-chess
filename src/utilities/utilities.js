import { Euler, Matrix3, Matrix4, Vector3 } from "three";
import Cubelet from "../Cubelet";

export const faceVectors = {
  front: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  top: new Vector3(0, 1, 0),
  right: new Vector3(1, 0, 0),
  bottom: new Vector3(0, -1, 0),
  back: new Vector3(0, 0, -1)
}

export const toRadians = (angle) => {
  return angle * (Math.PI / 180);
}

export const quantizePositions = (precision) => (cubelet) => {
  cubelet.position.x = Number(cubelet.position.x.toFixed(precision))
  cubelet.position.y = Number(cubelet.position.y.toFixed(precision))
  cubelet.position.z = Number(cubelet.position.z.toFixed(precision))
}

export const quantizeRotation = (cubelet) => {
  const e = new Euler().setFromQuaternion(cubelet.quaternion);
  e.x = Math.round(e.x / (Math.PI/2)) * (Math.PI/2);
  e.y = Math.round(e.y / (Math.PI/2)) * (Math.PI/2);
  e.z = Math.round(e.z / (Math.PI/2)) * (Math.PI/2);
  cubelet.quaternion.setFromEuler(e);
}

/**
 * 
 * @param {Vector3} vector 
 */
function quantizeVector3(vector) {
  vector.x = Math.round(vector.x)
  vector.y = Math.round(vector.y)
  vector.z = Math.round(vector.z)
}

/**
 * @param {Cubelet} cubelet 
 * @param {Vector3} normal 
 * @returns 
 */
export function getCubeFaceFromNormal(cubelet, normal) {
  cubelet.updateMatrixWorld(true)
  const parentInvert = new Matrix4().copy(cubelet.parent.matrixWorld).invert()
  const cubeLocal = new Matrix4().multiplyMatrices(parentInvert, cubelet.matrixWorld)
  const normalMatrix = new Matrix3().getNormalMatrix(cubeLocal)
  const cubeNormal = normal.clone().applyMatrix3(normalMatrix).normalize()
  quantizeVector3(cubeNormal)

  for (const [face, vector] of Object.entries(faceVectors)) {
    if (vector.equals(cubeNormal)) return face.toUpperCase()
  }
}

export const boundPos = (min, max) => (bcoor) => {
    if (bcoor.x < min) {
      bcoor.x = min
    } else if (bcoor.x >= max) {
      bcoor.x = (max - 1)
    }

    if (bcoor.y < min) {
      bcoor.y = min
    } else if (bcoor.y >= max) {
      bcoor.y = (max - 1)
    }
  }
