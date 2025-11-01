import { extractBCoords, mapToBoard, shouldTraverse } from "./faceRotationMap";
import Tile from "./Tile";
import { boundPos } from "./utilities/utilities";

export default class Board {
  constructor(cube) {
    this.cube = cube;
    this.offset = (cube.size - 1) / 2;
    const size = cube.size;
    this.bound = boundPos(0, size) // exlusive of size (bouned to size - 1)
    this.FRONT = { tiles: this.initFace(size, "FRONT") };
    this.BACK = { tiles: this.initFace(size, "BACK") };
    this.LEFT = { tiles: this.initFace(size, "LEFT") };
    this.RIGHT = { tiles: this.initFace(size, "RIGHT") };
    this.TOP = { tiles: this.initFace(size, "TOP") };
    this.BOTTOM = { tiles: this.initFace(size, "BOTTOM") };

    // init neighbors
    this.FRONT.up = this.TOP;
    this.FRONT.left = this.LEFT;
    this.FRONT.right = this.RIGHT;
    this.FRONT.down = this.BOTTOM;

    this.BACK.up = this.TOP;
    this.BACK.left = this.LEFT;
    this.BACK.right = this.RIGHT;
    this.BACK.down = this.BOTTOM;

    this.LEFT.up = this.FRONT;
    this.LEFT.left = this.BOTTOM;
    this.LEFT.right = this.TOP;
    this.LEFT.down = this.BACK;

    this.RIGHT.up = this.TOP;
    this.RIGHT.left = null;
  }

  step(command) {
    const res = { x: 0, y: 0 };
    if (command[0]) {
      const sign = command[0] > 0 ? 1 : -1;
      res.x = sign;
      command[0] += -1 * sign;
    }
    if (command[1]) {
      const sign = command[1] > 0 ? 1 : -1;
      res.y = sign;
      command[1] += -1 * sign;
    }
    return res;
  }

  walk(pos, commands, stepFn, visited) {
    for (const direction of commands) {
      while (Math.abs(direction[0]) > 0 || Math.abs(direction[1]) > 0) {
        const step = step(direction)
        pos.x += step.x
        pos.y += step.y
        const traversal = shouldTraverse(pos.face, pos.x, pos.y)
        if (traversal) {
          const { face, transform, flip } = traversal
          this.bound(pos)
          if (flip) {
            const tmp = pos.x
            pos.y = pos.y
            pos.x = tmp
          }
          pos.face = face
          for (const command of commands) {
            transform(command)
          }
        }
      }
    }
  }
  
  walkAll(bcoor, commands, stepFn) {
    for (const command of commands) {
      walk({...bcoor}, [...command], stepFn, new Set())
    }
  }


  diagonalAtCorner(x, y) {
    return (
      (x >= this.size && y >= this.size) ||
      (x < 0 && y < 0) ||
      (x < 0 && y >= this.size) ||
      (x >= this.size && y < 0)
    );
  }

  initFace(size, value = "none") {
    const face = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(new Tile(value));
      }
      face.push(row);
    }
    return face;
  }

  // both tile getters serve the same purpose, just exposed to different classes that store positions differently (3D vs 2D)
  getTileReference(face, positionArray) {
    const mapping = mapToBoard(
      face,
      positionArray[0],
      positionArray[1],
      positionArray[2]
    );
    return this[mapping.face].tiles[mapping.x][mapping.y];
  }

  getTile(bcoor) {
    return this[bcoor.face].tiles[bcoor.x][bcoor.y]
  }

  bake(records) {
    for (const record of Object.keys(records)) {
      const pos = extractBCoords(record);
      // console.log(record, pos)
      this[pos.face].tiles[pos.x][pos.y] = records[record];
    }
  }
}
