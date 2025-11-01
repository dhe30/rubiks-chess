import { Vector3 } from "three";

export const faceVectors = {
  front: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  top: new Vector3(0, 1, 0),
  right: new Vector3(1, 0, 0),
  bottom: new Vector3(0, -1, 0),
  back: new Vector3(0, 0, -1)
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

getTileFromNormal(cubelet, normal)