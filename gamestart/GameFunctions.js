// GameFunctions.js
import * as script from './script.js'
import * as dialogue from './TextFunctions.js'
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

// from chatgpt
export function loadFood(trackedFoodItems, foodItems, $dropZone, $scanZone) {
  let startX = window.innerWidth * 0.2
  let startY = window.innerHeight * 0.17
  const xSpacing = window.innerWidth * 0.1

  // Setup drop zone
  $dropZone.droppable({
    drop: function (event, ui) {
      const $draggedItem = ui.helper
      const foodIndex = $draggedItem.data('foodIndex')

      trackedFoodItems = trackedFoodItems.filter(
        (item) => item && item.data('foodIndex') !== foodIndex
      )
      $draggedItem.remove()

      console.log('Remaining food:', trackedFoodItems.length)
      if (trackedFoodItems.length === 0) {
        checkCharacterComplete()
      }
    },
  })

  foodItems.forEach((food, i) => {
    const $item = $('<img>')
      .attr('src', food.image)
      .css({
        position: 'fixed',
        width: '100px',
        height: 'auto',
        left: `${startX + i * xSpacing}px`,
        top: `${startY}px`,
        cursor: 'grab',
      })
      .data('dialogue', food.dialogue)
      .data('foodName', food.key)
      .data('foodIndex', i)
      .data('hasBeenScanned', false) // Permanent flag for scan status
      .data('originalLeft', `${startX + i * xSpacing}px`)
      .data('originalTop', `${startY}px`)

    $item.draggable({
      start: function () {
        $(this).css('z-index', '100')
      },
      drag: function (event, ui) {
        const itemRect = ui.helper[0].getBoundingClientRect()
        const scanRect = $scanZone[0].getBoundingClientRect()
        const isOverlapping = checkOverlap(itemRect, scanRect)

        if (isOverlapping && !$(this).data('hasBeenScanned')) {
          $(this).data('hasBeenScanned', true)
          dialogue.onItemScanned($(this).data('dialogue'))
        }
      },
      stop: function () {
        $(this).css('z-index', '')
        // If not scanned and not dropped in zone, return to original position
        if (!$(this).data('hasBeenScanned') && !$(this).data('wasDropped')) {
          $(this).animate(
            {
              left: $(this).data('originalLeft'),
              top: $(this).data('originalTop'),
            },
            200
          )
        }
        $(this).data('wasDropped', false)
      },
    })

    // Make droppable only if scanned
    $item.on('dragstart', function () {
      if ($(this).data('hasBeenScanned')) {
        $dropZone.droppable('enable')
      } else {
        $dropZone.droppable('disable')
      }
    })

    trackedFoodItems.push($item)
    $('#app').append($item)
  })

  function checkOverlap(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    )
  }
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
