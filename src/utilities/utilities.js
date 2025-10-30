import { Vector3 } from "three";

export const faceVectors = {
  front: new Vector3(0, 0, 1),
  left: new Vector3(-1, 0, 0),
  top: new Vector3(0, 1, 0),
  right: new Vector3(1, 0, 0),
  bottom: new Vector3(0, -1, 0),
  back: new Vector3(0, 0, -1)
}

getTileFromNormal(cubelet, normal)