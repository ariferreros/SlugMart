import { Sprite } from 'pixi.js'

// Class for making the food items draggable
export class DraggableItem extends Sprite {
  constructor(texture) {
    super(texture)

    this.anchor.set(0.5)
    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointermove', this.onDragMove)
  }

  dragging = false
  dragData = null

  onDragStart(event) {
    this.dragData = event.data
    this.dragging = true
    this.alpha = 0.7
  }

  onDragEnd() {
    this.dragData = null
    this.dragging = false
    this.alpha = 1
  }

  onDragMove() {
    if (this.dragging && this.dragData) {
      const newPosition = this.dragData.getLocalPosition(this.parent)
      this.position.set(newPosition.x, newPosition.y)
    }
  }
}
