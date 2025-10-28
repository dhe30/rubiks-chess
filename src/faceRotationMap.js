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

