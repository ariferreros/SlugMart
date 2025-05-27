export class Character extends Sprite {
  constructor(texture, onRemoveCallback) {
    super(texture)
    this.onRemoveCallback = onRemoveCallback

    this.anchor.set(0.5)
  }

  enterScene() {
    this.texture.console.log('character entered')
    // this.position.set()
  }
  leaveScene() {
    this.texture.console.log('character left')
    this.removeFromParent()
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.removeChild(this)
      this.destroy()
      // notify the caller of the specific item that was removed
      if (this.onRemoveCallback) {
        this.onRemoveCallback(this)
      }
    }
  }
}
