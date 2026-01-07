export default class IdleHandler {
  constructor(cubeInteraction) {
    this.cubeInteraction = cubeInteraction;
  }

  transition(state) {
    this.cubeInteraction.setState(state);
  }

  canHandle(raycastResult) {
    return false;
  }
  onStart(event, raycastResult) {}
  onMove(event) {}
  onEnd(event) {}
}
