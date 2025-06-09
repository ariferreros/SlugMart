// script.js
// import {
//   loadForeground,
//   loadBackground,
//   loadFood,
//   createDropZone,
// } from '../GameFunctions.js'
// import { food } from '../Char1/text.js'
import { food } from '../game/src/Char1/text.js'
import * as game from './GameFunctions.js'
import * as dialog from './TextFunctions.js'
import * as endScreen from './EndScreenFunctions.js'

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
  const groceryZone = game.createGroceryZone()
  const scanZone = game.createScanZone()
  const dropZone = game.createDropZone()
  dialog.loadCharacterTextBox()
  const trackedFoodItems = []
  game.loadFood(
    trackedFoodItems,
    data.days[dayIndex].characters[characterIndex].groceries,
    dropZone,
    scanZone,
    groceryZone
  )
  foodEnter()
  characterEnter()

  // beginDialog()
}

async function foodEnter() {
  await new Promise((resolve) => {
    $('.grocery-zone').animate({ left: '-.5%' }, 2000, resolve)
    console.log('Food enters')
  })
}

async function characterEnter() {
  await new Promise((resolve) => {
    $('.character').animate({ left: '5%' }, 1000, resolve)
    console.log('Character enters')
  })
  if (data.days[currentDay].characters[currentChar].startDialogue) {
    dialog.showCharacterTextBox(
      data.days[currentDay].characters[currentChar].startDialogue
    )
  }
}

export async function nextCharacter() {
  await characterLeave()
  currentChar++
  if (currentChar >= maxChars) {
    currentChar = 0
    currentDay++
    console.log('proceeding to next day')
    await proceedtoNextDay()
    if (currentDay >= maxDays) {
      console.log('game complete')
      await endScreen.loadEndScreen()
      return
    }
  }

  // Wait for characterLeave to complete before starting next day
  startDay(currentDay, currentChar)
}

async function proceedtoNextDay() {
  await game.loadNextDayScreen()
}
async function characterLeave() {
  try {
    // Show leaving dialogue
    await dialog.showCharacterTextBox(
      data.days[currentDay].characters[currentChar].endDialogue
    )
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    await dialog.hideCharacterTextBox()
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
