import { Matrix3, Matrix4, Vector3 } from "three";
import Cubelet from "../Cubelet";

export const faceVectors = {
  front: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  top: new Vector3(0, 1, 0),
  right: new Vector3(1, 0, 0),
  bottom: new Vector3(0, -1, 0),
  back: new Vector3(0, 0, -1)
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
  const parentInvert = new Matrix4.copy(cubelet.parent.matrixWorld).invert()
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
