// lambdas for game controller

export const boundedWalk = (record) => (tile) => {
  if (tile.piece) {
    return true
  }
  record.add(tile)
  return false
} 

export const boundedWalkThreat = (piece) => (record) => (tile) => {
  tile.threats.add(piece)
  return boundedWalk(record)(tile)
}

export const spyWalk = (id, group, record) => (tile) => {
  if (tile.piece && tile.piece.id == id && tile.piece.group == group) {
    record.add(tile)
    return true
  } else if (tile.piece) {
    return true
  }
  return false
}