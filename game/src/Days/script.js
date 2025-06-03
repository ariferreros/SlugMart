import {
  loadForeground,
  loadBackground,
  loadFood,
  createDropZone,
} from '../GameFunctions.js'
import * as Char1 from '../Char1/text.js'
import * as SceneManager from '../SceneManager.js'
// script for day 1
export async function startDay1(app) {
  const sceneManager = app.sceneManager

  // Load background first
  const background = await loadBackground(app)
  await sceneManager.changeScene(() => Promise.resolve(background))

  // Then add foreground
  const foreground = await loadForeground(app)
  sceneManager.addToScene(foreground)

  const dropZone = createDropZone(app)
  sceneManager.addToScene(dropZone)
  // Load food

  //   console.log(foodSet)
  const trackedFoodItems = []
  loadFood(foreground, trackedFoodItems, dropZone, Char1.food.Day1, app)
}
