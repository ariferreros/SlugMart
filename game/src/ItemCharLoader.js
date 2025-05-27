import { DraggableItem } from './Classes/DraggableItem.js'
export async function loadFood(scene, food) {
  for (let i = 0; i < food.length; i++) {
    const item = new DraggableItem(foodTexture, handleItemRemoved)

    item.scale.set(0.3)
    item.anchor.set(0.5)
    item.position.set(screen.width * (0.3 + i * 0.1), screen.height * 0.3)
    item.dropZone = dropZone

    scene.addChild(item)
    itemsTracker.add(item)
  }
}
