// script.js
// import {
//   loadForeground,
//   loadBackground,
//   loadFood,
//   createDropZone,
// } from '../GameFunctions.js'
// import { food } from '../Char1/text.js'
import * as game from './GameFunctions.js'
import * as dialog from './TextFunctions.js'
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
  dialog.loadCharacterTextBox()
  const trackedFoodItems = []
  game.loadFood(
    trackedFoodItems,
    data.days[dayIndex].characters[characterIndex].groceries,
    dropZone,
    scanZone
  )

  characterEnter()

  // beginDialog()
}

async function characterEnter() {
  await new Promise((resolve) => {
    $('.character').animate({ left: '5%' }, 1000, resolve)
    console.log('Character enters')
  })
  dialog.showCharacterTextBox(
    data.days[currentDay].characters[currentChar].startDialogue
  )
}

export async function nextCharacter() {
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

  // Wait for characterLeave to complete before starting next day
  await characterLeave()
  startDay(currentDay, currentChar)
}

async function characterLeave() {
  try {
    // Show leaving dialogue
    await dialog.showCharacterTextBox(
      data.days[currentDay].characters[currentChar].endDialogue
    )

    // wait for character to leave the sceen
    await new Promise((resolve) => {
      $('.character').animate({ left: '120%' }, 3000, resolve)
    })
    console.log('Character leaves')

    // Hide the text box with fade out
  } catch (error) {
    console.error('Error in characterLeave:', error)
  }
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
