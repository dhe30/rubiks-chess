export default faceRotationMap = {
  yCW: { // +90° around Y
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
  yCCW: { // -90° around Y
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
  xCW: { // +90° around X
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
  xCCW: { // -90° around X
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
  zCW: { // +90° around Z
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
  zCCW: { // -90° around Z
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

// map axis value and angle to faceRotationMap value
// assume axis is normalized and local to the cube and angle +/- 90*
export function rotationFromAngleAxis(axis, angle) {
  let rotation = ""
  if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
    axis.negate();
    angle = -angle;
  }

  if (Math.round(axis.x) == 1) {
    rotation += "x"
  } else if (Math.round(axis.y) == 1) {
    rotation += "y"
  } else (Math.round(axis.z) == 1) {
    rotation += "z"
  }

  if (angle > 0) {
    rotation += "CW"
  } else if (angle < 0) {
    rotation += "CCW"
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

