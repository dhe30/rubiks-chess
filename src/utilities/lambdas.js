  // lambdas for game controller

  export const boundedWalk = (record) => (tile) => {
    if (tile.piece) {
      return true
    }
    record.add(tile)
    return false
  } 