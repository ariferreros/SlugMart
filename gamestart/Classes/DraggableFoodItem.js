export default class DraggableFoodItem {
  constructor(element, scanZone, dropZone, trackedItems, onComplete) {
    this.element = element
    this.scanZone = scanZone
    this.dropZone = dropZone
    this.trackedItems = trackedItems
    this.onComplete = onComplete
    this.hasScanned = false
    this.initialize()
  }

  initialize() {
    this.element.attr('draggable', true)

    this.element.on('dragstart', this.handleDragStart.bind(this))
    this.element.on('dragend', this.handleDragEnd.bind(this))
    this.scanZone.on('dragover', this.handleScanZoneOver.bind(this))
    this.dropZone.on('dragover', this.handleDropZoneOver.bind(this))
    this.dropZone.on('drop', this.handleDrop.bind(this))
  }

  handleDragStart(e) {
    e.originalEvent.dataTransfer.setData('text/plain', 'foodItem')
    this.element.css('opacity', '0.4')
  }

  handleDragEnd() {
    this.element.css('opacity', '1')
  }

  handleScanZoneOver(e) {
    e.preventDefault()
    this.hasScanned = true
  }

  handleDropZoneOver(e) {
    e.preventDefault()
  }

  handleDrop(e) {
    e.preventDefault()
    if (this.hasScanned) {
      const itemRect = this.element[0].getBoundingClientRect()
      const dropRect = this.dropZone[0].getBoundingClientRect()

      if (this.checkOverlap(itemRect, dropRect)) {
        this.element.remove()
        const index = this.trackedItems.indexOf(this.element)
        if (index > -1) {
          this.trackedItems.splice(index, 1)
        }

        if (this.trackedItems.length === 0 && this.onComplete) {
          this.onComplete()
        }
      }
    }
    this.hasScanned = false
  }

  checkOverlap(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    )
  }
}
