import { Sprite } from 'pixi.js'
export class DraggableItem extends Sprite {
  constructor(texture, onRemoveCallback) {
    super(texture)
    this.onRemoveCallback = onRemoveCallback
    this.anchor.set(0.5)
    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove)
  }

  dragging = false
  dragData = null
  dropZone = null

  onDragStart(event) {
    this.dragData = event.data
    this.dragging = true
    this.alpha = 0.7
    this.zIndex = 1
  }

  onDragEnd() {
    if (!this.dragging) return

    const newPosition = this.dragData.getLocalPosition(this.parent)
    this.position.set(newPosition.x, newPosition.y)

    // Check if we're over a drop zone
    if (this.dropZone && this.isOverDropZone()) {
      this.removeFromParent()
    }

    this.dragData = null
    this.dragging = false
    this.alpha = 1
    this.zIndex = 0
  }

  onDragMove() {
    if (this.dragging && this.dragData) {
      const newPosition = this.dragData.getLocalPosition(this.parent)
      this.position.set(newPosition.x, newPosition.y)
    }
  }

  isOverDropZone() {
    // Get the global position of the item's center
    const itemPos = this.getGlobalPosition()

    // Get the drop zone bounds in global coordinates
    const dropBounds = this.dropZone.getBounds()

    // Check if item center is within drop zone bounds
    return (
      itemPos.x >= dropBounds.x &&
      itemPos.x <= dropBounds.x + dropBounds.width &&
      itemPos.y >= dropBounds.y &&
      itemPos.y <= dropBounds.y + dropBounds.height
    )
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
