// GameScreen.js
import { Container, Graphics, Assets, Sprite } from 'pixi.js'
import { DraggableItem } from './DraggableItem.js'
export async function loadGameScreen(app) {
  const scene = new Container()
  let draggableItems = new Set()
  // Load textures
  const backgroundTexture = await Assets.load(
    './assets/environment/gameScreenBG.png'
  )
  const bagTexture = await Assets.load('./assets/environment/gameScreenBag.png')
  const counterTexture = await Assets.load('./assets/environment/belt.png')
  const registerTexture = await Assets.load('./assets/environment/register.png')
  const foodTexture = await Assets.load(
    './assets/environment/filler_food_item_replace_later.png'
  )

  // Background
  const background = new Sprite(backgroundTexture)
  background.height = app.screen.height
  background.scale.x = background.scale.y
  background.anchor.set(0.5)
  scene.addChild(background)

  // Counter
  const counter = new Sprite(counterTexture)
  counter.height = app.screen.height
  counter.scale.x = counter.scale.y
  counter.anchor.set(0.5)
  scene.addChild(counter)

  // Register
  const register = new Sprite(registerTexture)
  register.height = app.screen.height
  register.scale.x = register.scale.y
  register.anchor.set(0.5)
  scene.addChild(register)

  // Bag
  const bag = new Sprite(bagTexture)
  bag.height = app.screen.height
  bag.scale.x = bag.scale.y
  bag.anchor.set(0.5)
  scene.addChild(bag)

  // Create drop zone
  const dropZone = createDropZone(app.screen)
  scene.addChild(dropZone)

  // Create and track draggable items
  createDraggableItems(scene, draggableItems, dropZone, foodTexture, app.screen)

  // Configure container
  scene.scale.set(0.5)
  scene.position.set(app.screen.width * 0.5, app.screen.height * 0.5)

  return scene
}

// Helper function to create the drop zone
function createDropZone(screen) {
  const dropZone = new Graphics().rect(0, 0, 200, 200).fill(0x000000)
  return dropZone
}

// Helper function to create and track items
function createDraggableItems(scene, itemsTracker, dropZone, texture, screen) {
  const itemCount = 5

  const handleItemRemoved = (removedItem) => {
    itemsTracker.delete(removedItem)
    checkAllItemsRemoved(itemsTracker)
  }

  for (let i = 0; i < itemCount; i++) {
    const item = new DraggableItem(texture, handleItemRemoved)

    item.scale.set(0.3)
    item.anchor.set(0.5)
    item.position.set(screen.width * (0.3 + i * 0.1), screen.height * 0.3)
    item.dropZone = dropZone

    scene.addChild(item)
    itemsTracker.add(item)
  }
}

// Helper function to check when all items are gone
function checkAllItemsRemoved(itemsTracker) {
  if (itemsTracker.size === 0) {
    console.log('All items removed - level complete!')
    // Add your completion logic here
  }
}
