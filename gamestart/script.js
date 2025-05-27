// script.js
// import {
//   loadForeground,
//   loadBackground,
//   loadFood,
//   createDropZone,
// } from '../GameFunctions.js'
// import { food } from '../Char1/text.js'
import * as game from './GameFunctions.js'
export function startDay1() {
  console.log('Starting Day 1')
  game.clearScene()
  game.loadBackground()
  game.loadCharacter('jim')
  game.loadForeground()
  const dropZone = game.createDropZone()
  const trackedFoodItems = []
  game.loadFood(trackedFoodItems, 'jim', 'day1', dropZone)

  //   const sceneManager = window.sceneManager

  // Load background first
  //   const background = await loadBackground()
  //   await sceneManager.changeScene(() => Promise.resolve(background))

  //   // Then add foreground
  //   const foreground = await loadForeground()
  //   sceneManager.addToScene(foreground)

  //   const dropZone = createDropZone()
  //   sceneManager.addToScene(dropZone)

  //   const trackedFoodItems = []
  //   loadFood(foreground, trackedFoodItems, dropZone, food.Day1)
}
export function startHome() {
  console.log('Starting Home')
  game.loadHomeScreen()
  //   $('#app').append(homeScreen)
}
