// GameFunctions.js
import * as script from './script.js'
// import * as character from './character/data.js'
export async function clearScene() {
  $('#app').empty()
}

// adds game scene background to scene-container
export async function loadBackground() {
  const $bg = $('<div>').addClass('scene-bg')
  $bg.css(
    'background-image',
    'url(./public/assets/environment/gameScreenBG.png)'
  )

  $('#app').append($bg)
  return $bg
}

export async function loadCharacter(character) {
  const image = character.image
  const name = character.name
  console.log('loading character', name)
  const $character = $('<img>').addClass('character').attr('src', `${image}`)

  $('#app').append($character)
}

export async function loadForeground() {
  const $foreground = $('<div>').addClass('scene-fg')

  // Create and position foreground elements
  const $counter = $('<img>')
    .addClass('scene-fg')
    .attr('src', './public/assets/environment/belt.png')
  // .css({
  //   width: 'auto',
  //   height: '100%',
  //   'object-fit': 'contain',
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  // })

  const $register = $('<img>')
    .addClass('scene-fg')
    .attr('src', './public/assets/environment/register.png')
  // .css({
  //   width: 'auto',
  //   height: '100%',
  //   'object-fit': 'contain',
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  // })

  const $bag = $('<img>')
    .addClass('scene-fg')
    .attr('src', './public/assets/environment/gameScreenBag.png')
  // .css({
  //   width: 'auto',
  //   height: '100%',
  //   'object-fit': 'contain',
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  // })

  $foreground.append($counter, $register, $bag)
  $('#app').append($foreground)
  return $foreground
}

export function createDropZone() {
  const $dropZone = $('<div>').addClass('drop-zone')
  $('#app').append($dropZone)
  return $dropZone
}

export function createScanZone() {
  const $scanZone = $('<div>').addClass('scan-zone')
  $('#app').append($scanZone)
  return $scanZone
}

export function loadFood(trackedFoodItems, foodItems, $dropZone, $scanZone) {
  const startX = window.innerWidth * 0.2
  const yPos = window.innerHeight * 0.17
  const xSpacing = window.innerWidth * 0.1
  //   const foodItems = character[characterName][day].food
  //   console.log(foodPath)
  foodItems.forEach((foodPath, i) => {
    const $item = $('<img>')
      .addClass('draggable')
      .attr('src', foodPath)
      .css({
        width: '100px',
        height: 'auto',
        left: `${startX + i * xSpacing}px`,
        top: `${yPos}px`,
      })

    // Make draggable
    let isDragging = false
    let offsetX, offsetY

    $item.on('mousedown', function (e) {
      isDragging = true
      offsetX = e.clientX - $(this).offset().left
      offsetY = e.clientY - $(this).offset().top
      $(this).css('z-index', '100')
    })

    $(document).on('mousemove', function (e) {
      if (!isDragging) return

      $item.css({
        left: `${e.clientX - offsetX}px`,
        top: `${e.clientY - offsetY}px`,
      })
    })

    $(document).on('mouseup', function () {
      if (!isDragging) return
      isDragging = false

      // Check if dropped in drop zone
      const itemRect = $item[0].getBoundingClientRect()
      const dropRect = $dropZone[0].getBoundingClientRect()

      if (
        itemRect.left < dropRect.right &&
        itemRect.right > dropRect.left &&
        itemRect.top < dropRect.bottom &&
        itemRect.bottom > dropRect.top
      ) {
        // Item is in drop zone
        $item.remove()
        const index = trackedFoodItems.indexOf($item)
        if (index > -1) {
          trackedFoodItems.splice(index, 1)
        }

        if (trackedFoodItems.length === 0) {
          checkCharacterComplete()
        }
      }
    })

    trackedFoodItems.push($item)
    $('#app').append($item)
  })
}
// adds scene-bg to scene-container
// creates startbutton with class button and id start-button
// on click runs start day 1 script
export async function loadHomeScreen() {
  const $container = $('<div>').addClass('scene-bg')
  $container.css(
    'background-image',
    'url(./public/assets/environment/homescreen.png)'
  )

  const $startButton = $('<img>')
    .addClass('button')
    .attr('id', 'start-button')
    .attr('src', './public/assets/environment/startbutton.png')

  $startButton.on('click', async function () {
    // start the first day with the first character
    script.startDay(0, 0)
  })

  $container.append($startButton)
  $('#app').append($container)
  return $container
}

export function checkCharacterComplete() {
  console.log('All items bagged')
  script.nextCharacter()
}

// export function checkDayComplete() {
//   console.log('All items bagged AND all customers have left')

//   console.log('Starting next day')
//   script.nextCharacter()
// }
