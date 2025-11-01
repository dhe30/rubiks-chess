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
// when a piece moves to another face, transform not only the commands, but the moves of the piece as well 
const transitions = {
  FRONT: {
    up: { face: "TOP", transform: (pos) => negateAndFlip(pos, false, true, false), flip: false },
    down: { face: "BOTTTOM", transform: (pos) => {}, flip: false },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, true, false, true), flip: true },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, true, false, true), flip: true }
  },
  LEFT: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, false, false, true), flip: true },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, false, true, true), flip: true },
    left: { face: "BOTTOM", transform: (pos) => negateAndFlip(pos, true, false, false), flip: false },
    right: { face: "TOP", transform: (pos) => {}, flip: false }
  },
  TOP: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, false, true, false), flip: false },
    down: { face: "BACK", transform: (pos) => {}, flip: false },
    left: { face: "LEFT", transform: (pos) => {}, flip: false },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, false, true, false), flip: false }
  },
  RIGHT: {
    up: { face: "FRONT", transform: (pos) => negateAndFlip(pos, false, true, true), flip: true },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, false, false, true), flip: true },
    left: { face: "BOTTOM", transform: (pos) => {}, flip: false },
    right: { face: "TOP", transform: (pos) => negateAndFlip(pos, true, false, false), flip: false }
  },
  BOTTOM: {
    up: { face: "FRONT", transform: (pos) => {}, flip: false },
    down: { face: "BACK", transform: (pos) => negateAndFlip(pos, false, true, false), flip: false },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, true, false, false), flip: false },
    right: { face: "RIGHT", transform: (pos) => {}, flip: false }
  },
  BACK: {
    up: { face: "TOP", transform: (pos) => {}, flip: false },
    down: { face: "BOTTOM", transform: (pos) => negateAndFlip(pos, false, true, false), flip: false },
    left: { face: "LEFT", transform: (pos) => negateAndFlip(pos, true, false, true), flip: true },
    right: { face: "RIGHT", transform: (pos) => negateAndFlip(pos, false, false, true), flip: true }
  },
}

export function shouldTraverse(face, x, y) {
  const size = 8
  let direction = null
  if (x < 0) {
    direction = "left"
  } else if (x >= size) {
    direction = "right"
  } else if (y < 0) {
    direction = "down"
  } else if (y >= size) {
    direction = "up"
  } else {
    return direction
  }
  return transitions[face][direction]
}


