// script.js
// import {
//   loadForeground,
//   loadBackground,
//   loadFood,
//   createDropZone,
// } from '../GameFunctions.js'
// import { food } from '../Char1/text.js'
import * as game from './GameFunctions.js'
const data = await importJSON()
let maxDays = data.days.length
let maxChars = data.days[0].characters.length
let currentDay = 0
let currentChar = 0
export function startDay(dayIndex, characterIndex) {
  console.log(data)
  console.log('Starting Day 1 and first character')

  game.clearScene()
  game.loadBackground()
  game.loadCharacter(data.days[dayIndex].characters[characterIndex])
  game.loadForeground()
  const scanZone = game.createScanZone()
  const dropZone = game.createDropZone()
  const trackedFoodItems = []
  game.loadFood(
    trackedFoodItems,
    data.days[dayIndex].characters[characterIndex].food,
    dropZone,
    scanZone
  )
}
export function nextCharacter() {
  currentChar++
  if (currentChar >= maxChars) {
    currentChar = 0
    currentDay++
    console.log('proceeding to next day')
    if (currentDay >= maxDays) {
      console.log('all done')
      return
    }
  }
  startDay(currentDay, currentChar)
}
export function startHome() {
  console.log('Starting Home')
  game.loadHomeScreen()
  //   $('#app').append(homeScreen)
}

async function importJSON() {
  const response = await fetch('./day/data.json')
  const data = await response.json()
  return data
}
