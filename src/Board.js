import { extractBCoords, mapToBoard, shouldTraverse } from "./faceRotationMap";
import Tile from "./Tile";
import { boundPos } from "./utilities/utilities";

export default class Board {
  constructor(size) {
    // this.cube = cube;
    this.offset = (size - 1) / 2;
    const size = size;
    this.bound = boundPos(0, size) // exlusive of size (bouned to size - 1)
    this.FRONT = { tiles: this.initFace(size, "FRONT") };
    this.BACK = { tiles: this.initFace(size, "BACK") };
    this.LEFT = { tiles: this.initFace(size, "LEFT") };
    this.RIGHT = { tiles: this.initFace(size, "RIGHT") };
    this.TOP = { tiles: this.initFace(size, "TOP") };
    this.BOTTOM = { tiles: this.initFace(size, "BOTTOM") };

    // init neighbors

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

  walk(pos, commands, visited, onStep, onComplete) {
    for (const direction of commands) {
      while (Math.abs(direction[0]) > 0 || Math.abs(direction[1]) > 0) {
        const step = step(direction)
        pos.x += step.x
        pos.y += step.y
        const traversal = shouldTraverse(pos.face, pos.x, pos.y)
        
        if (traversal) { // change pos and commands to preserve canonical directions for new face frame
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
        // get tile at pos and check visited set 
        const tile = this.board.getTile(pos)
        if (visited.has(tile)) {
          onComplete()
          return 
        } else {
          visited.add(tile)
        }
        
        // invoke step function 
        onStep(tile)
      }
    }

    // invoke on complete function 
    onComplete()
  }
  
  walkAll(bcoor, commands, stepFn, onComplete = () => {}) {
    const origin = this.board.getTile(bcoor)
    for (const command of commands) {
      const visited = new Set()
      visited.add(origin)
      walk({...bcoor}, [...command], visited, stepFn, onComplete)
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
