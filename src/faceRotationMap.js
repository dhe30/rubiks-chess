export const faceRotationMap = {
  yCCW: { // +90° around Y
    front: "right",
    right: "back",
    back: "left",
    left: "front",
    top: "top",
    bottom: "bottom",
    twist: (x, y, z, offset = 0) => {
      return {
        x: z, 
        y: y, 
        z: -x + (2*offset)
      }
    }
  },
  yCW: { // -90° around Y
    front: "left",
    left: "back",
    back: "right",
    right: "front",
    top: "top",
    bottom: "bottom",
    twist: (x, y, z, offset = 0) => {
      return {
        x: -z + (2*offset), 
        y: y, 
        z: x
      }
    }
  },
  xCW: { // -90° around X
    top: "back",
    back: "bottom",
    bottom: "front",
    front: "top",
    left: "left",
    right: "right",
    twist: (x, y, z, offset = 0) => {
      return {
        x: x, 
        y: -z + (2*offset), 
        z: y
      }
    }
  },
  xCCW: { // +90° around X
    top: "front",
    front: "bottom",
    bottom: "back",
    back: "top",
    left: "left",
    right: "right",
    twist: (x, y, z, offset = 0) => {
      return {
        x: x, 
        y: z, 
        z: -y + (2*offset)
      }
    }
    
  },
  zCCW: { // +90° around Z
    top: "left",
    left: "bottom",
    bottom: "right",
    right: "top",
    front: "front",
    back: "back",
    twist: (x, y, z, offset = 0) => {
      return {
        x: -y + (2*offset), 
        y: x, 
        z: z
      }
    }
  },
  zCW: { // -90° around Z
    top: "right",
    right: "bottom",
    bottom: "left",
    left: "top",
    front: "front",
    back: "back",
    twist: (x, y, z, offset = 0) => {
      return {
        x: y, 
        y: -x + (2*offset), 
        z: z
      }
    }
  }
};

export function mapToBoard(face, x, y, z) {
    switch (face) {
        case "front":
            return {face: "FRONT", x, y}
        case "back":
            return {face: "BACK", x, y}
        case "left":
            return {face: "LEFT", x: y, y: z}
        case "right":
            return {face: "RIGHT", x: y, y: z}
        case "bottom":
            return {face: "BOTTOM", x, y: z}
        case "top":
            return {face: "TOP", x, y: z}
    }
}

export function mapToCube(face, x, y, size = 8) {
  switch (face) {
    case "FRONT":
        return {face: "front", x, y, z: size - 1}
    case "BACK":
        return {face: "back", x, y, z: 0}
    case "LEFT":
        return {face: "left", x: 0, y: x, z: y}
    case "RIGHT":
        return {face: "right", x: size - 1, y: x, z: y}
    case "BOTTOM":
        return {face: "bottom", x, y: 0, z: y}
    case "TOP":
        return {face: "top", x, y: size - 1, z: y}
  }
}

// map axis value and angle to faceRotationMap value
// assume axis is normalized and local to the cube and angle +/- 90*
export function rotationFromAngleAxis(axis, angle) {
  let rotation = ""
  if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
    axis.negate();
    angle = -angle;
    // console.log("NEGATED", axis, angle)
  }

  if (Math.round(axis.x) == 1) {
    rotation += "x"
  } else if (Math.round(axis.y) == 1) {
    rotation += "y"
  } else if (Math.round(axis.z) == 1) {
    rotation += "z"
  } else {
    return null
  }

  if (angle > 0) {
    rotation += "CCW"
  } else if (angle < 0) {
    rotation += "CW"
  } else {
    return null
  }

  return rotation
}

// functions for hashing 
export function bStringId(a) {
    return `${a.face} ${a.x} ${a.y}`
}

export function extractBCoords(a) {
  const coords = a.split(" ")
  return {
    face: coords[0],
    x: +coords[1],
    y: +coords[2]
  }
}
function negateAndFlip(command, negateX, negateY, flip) {
  if (negateX) {
    command[0] *= -1
  }

  if (negateY) {
    command[1] *= -1
  }

  if (flip) {
    const tmp = command[0]
    command[0] = command[1]
    command[1] = tmp
  }
} 
// when a piece moves to another face, transform not only the commands, but the piece.moves as well 
export const transitions = {
  FRONT: {
    up: { face: "TOP", transform: (pos) => negateAndFlip(pos, false, true, false), orient: ([x, y]) =>  [x, Number.POSITIVE_INFINITY] },
    down: { face: "BOTTOM", transform: (pos) => {}, orient: ([x, y]) =>  [x, Number.POSITIVE_INFINITY] },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, true, false, true), orient: ([x, y]) =>  [y, Number.POSITIVE_INFINITY] },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, false, true, true), orient: ([x, y]) =>  [y, Number.POSITIVE_INFINITY] }
  },
  LEFT: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, false, false, true), orient: ([x, y]) =>  [0, x] },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, true, false, true), orient: ([x, y]) =>  [0, x] },
    left: { face: "BOTTOM", transform: (pos) => negateAndFlip(pos, true, false, false), orient: ([x, y]) =>  [0, y] },
    right: { face: "TOP", transform: (pos) => {}, orient: ([x, y]) =>  [0, y] }
  },
  TOP: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, false, true, false), orient: ([x, y]) =>  [x, Number.POSITIVE_INFINITY] },
    down: { face: "BACK", transform: (pos) => {}, orient: ([x, y]) =>  [x, Number.POSITIVE_INFINITY] },
    left: { face: "LEFT", transform: (pos) => {}, orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, y] },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, false, true, false), orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, y] }
  },
  RIGHT: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, true, false, true), orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, x] },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, false, false, true), orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, x] },
    left: { face: "BOTTOM", transform: (pos) => {}, orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, y] },
    right: { face: "TOP", transform: (pos) => negateAndFlip(pos, true, false, false), orient: ([x, y]) =>  [Number.POSITIVE_INFINITY, y] }
  },
  BOTTOM: {
    up: { face: "FRONT", transform: (pos) => {}, orient: ([x, y]) =>  [x, 0] },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, false, true, false), orient: ([x, y]) =>  [x, 0] },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, true, false, false), orient: ([x, y]) =>  [0, y] },
    right: { face: "RIGHT", transform: (pos) => {}, orient: ([x, y]) =>  [0, y] }
  },
  BACK: {
    up: { face: "TOP", transform: (pos) => {}, orient: ([x, y]) =>  [x, 0] },
    down: { face: "BOTTOM", transform: (pos) => negateAndFlip(pos, false, true, false), orient: ([x, y]) =>  [x, 0] },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, false, true, true), orient: ([x, y]) =>  [y, 0] },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, false, false, true), orient: ([x, y]) =>  [y, 0] }
  },
}

export function getTransform(faces) { // list of faces, usually only 2 provided
  const record = [1, 2]
  console.log("COMPILING TRANSFORMS FOR", faces)
  compileTransforms(null, faces, record)
  let flip = false, negateX = false, negateY = false
  if (Math.abs(record[0]) != 1) flip = true
  if (record[0] < 0) negateX = true
  if (record[1] < 0) negateY = true
  const test = [1, 2]
  console.log("COMPILED TO", {flip, negateX, negateY}, "TEST:", test)
  negateAndFlip(test, negateX, negateY, flip)
  console.log("TRANSFORMING COMMAND", test)
  return (command) => negateAndFlip(command, negateX, negateY, flip)
}

function compileTransforms(face, faces, record) {
  if (faces.length < 2) return 
  if (!face) face = faces.shift() // pop from faces 
  const nextFace = faces[0]
  console.log(face, transitions[face])
  const search = Object.values(transitions[face])
  const hit = search.filter(a => a.face === nextFace)
  if (!hit.length) {
    search[0].transform(record)
    compileTransforms(search[0].face, faces, record)
  } else {
    faces.shift()
    hit[0].transform(record)
    compileTransforms(nextFace, faces, record)
  }
}



