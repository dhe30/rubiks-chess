# rubiks-chess

11/22 - achieved highlighted, work out kinks with this.prev state correctly being set

10/27 - for next time: finish initFaces in cubelet class and finish rotation remapping in slicer class 

10/30 - for next time: 
* tile click event: 
1) get tile from cubelet and local face normal (access via object field returned from ray intersection function, and add local face normal)
2) check if the tile has a piece > grab all tiles from legal moves map > grab all (cubelet, face) pairs from tiletoCubelet map 

functions to implement: 
* (Cubelet.js) tileFromNormal(localFaceNormal) : Tile (used in mouseup event)
* (Cubelet.js) highlight(face) : void
* (GameController.js) getLegalTiles(pieceID) : [Tiles]
* dispatchHighlight([Tiles]) : void () (for each tile (cubelet, face) lookup, call cubelet.highlight)

MVP: have a piece render, upon click, highlight legal tiles, upon click, move to legal tile 
* CubeInteraction deals with the above click logic
* GameController deals with setting correct legal moves 

todo log (non-priority):
* make cubelet and cube extend THREE.Mesh instead of storing the mesh in this.object 