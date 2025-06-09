// GameFunctions.js
import * as script from './script.js'
import * as dialogue from './TextFunctions.js'
import { getProductInfo, searchProducts } from './productAPI.js'

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

  const $register = $('<img>')
    .addClass('scene-fg')
    .attr('src', './public/assets/environment/register.png')

  const $bag = $('<img>')
    .addClass('scene-fg')
    .attr('src', './public/assets/environment/gameScreenBag.png')

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

export function createGroceryZone() {
  const $groceryZone = $('<div>').addClass('grocery-zone')
  $('#app').append($groceryZone)
  return $groceryZone
}

// from chatgpt
export function loadFood(
  trackedFoodItems,
  groceries,
  $dropZone,
  $scanZone,
  $groceryZone
) {
  let startX = window.innerWidth * 0.01
  console.log(startX)
  let startY = window.innerHeight * 0.58
  const xSpacing = window.innerWidth * 0.2
  const zoneWidth = $groceryZone.width()
  const zoneHeight = $groceryZone.height()
  // Track which dia  logues have been triggered
  const triggeredDialogues = new Set()

  // Setup drop zone
  $dropZone.droppable({
    drop: function (event, ui) {
      const $draggedItem = ui.helper
      const foodIndex = $draggedItem.data('foodIndex')
      const indexToRemove = trackedFoodItems.findIndex(
        (item) => item && item.data('foodIndex') === foodIndex
      )

      if (indexToRemove !== -1) {
        trackedFoodItems.splice(indexToRemove, 1)
        $draggedItem.remove()

        // // Animate remaining items
        // trackedFoodItems.forEach(($item, newIndex) => {
        //   const newLeft = startX + newIndex * xSpacing
        //   $item.animate({ left: `${newLeft}px` }, 500)
        // })
      }
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

  // Flatten the groceries array and keep track of indices
  let foodIndex = 0
  // Loop through grocery groups in reverse
  groceries
    .slice()
    .reverse()
    .forEach((grocery, groupIndexOffset) => {
      const groupIndex = groceries.length - 1 - groupIndexOffset

      // Loop through items in each group in reverse
      grocery.food
        .slice()
        .reverse()
        .forEach((foodItem) => {
          const $item = $('<img>')
            .attr('src', foodItem.image)
            .css({
              cursor: 'grab',
              // border: '2px solid #000',
              zIndex: 50,
            })
            .attr('id', foodItem.key)
            .data('dialogue', grocery.dialogue)
            .data('foodName', foodItem.key)
            .data('foodIndex', foodIndex)
            .data('hasBeenScanned', false)
            .data('groupIndex', groupIndex)
            .data('barcode', foodItem.barcode)

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
                $dropZone.droppable('enable')
                $scanZone.addClass('scan-flash')
                setTimeout(() => $scanZone.removeClass('scan-flash'), 500)
                const groupIndex = $(this).data('groupIndex')
                if (!triggeredDialogues.has(groupIndex)) {
                  triggeredDialogues.add(groupIndex)
                  dialogue.onItemScanned($(this).data('dialogue'))
                }
                const barcode = $(this).data('barcode')
                if (barcode) {
                  getProductInfo(barcode).then((productData) => {
                    if (productData) {
                      console.log('Product Info:', productData)
                      // You could display this in the character textbox or a new UI element
                    } else {
                      console.log('No product info found')
                    }
                  })
                }
              }
            },
            stop: function () {
              $(this).css('z-index', '50')

              $(this).data('wasDropped', false)
            },
          })

          $item.on('dragstart', function () {
            if ($(this).data('hasBeenScanned')) {
              $dropZone.droppable('enable')
              console.log('drop zone enabled')
            } else {
              $dropZone.droppable('disable')
            }
          })

          trackedFoodItems.push($item)
          $('.grocery-zone').append($item)
          foodIndex++
        })
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
  $('#app').empty()
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

export async function loadNextDayScreen() {
  const $container = $('<div>').addClass('scene-bg')

  $container.css('background-color', 'white').appendTo('body').hide()
  await $container.fadeIn(1000).promise()
  await new Promise((resolve) => setTimeout(resolve, 5000))
  await $container.fadeOut(1000).promise()

  $container.remove()
}
export function checkCharacterComplete() {
  console.log('All items bagged')
  script.nextCharacter()
}

// export async function loadEndScreen() {
//   const $container = $('<div>')
//     .addClass('end-bg')
//     .hide()
//     .css('background-color', 'white')
//   console.log('Loading end screen')
//   // Create search UI elements
//   const $searchContainer = $('<div>').addClass('search-container')
//   const $searchInput = $('<input>')
//     .attr('type', 'text')
//     .attr('placeholder', 'Search for products...')
//     .addClass('search-input')
//   const $searchButton = $('<button>').text('Search').addClass('search-button')
//   const $resultsContainer = $('<div>').addClass('results-container')

//   // Add elements to container
//   $searchContainer.append($searchInput, $searchButton)
//   $container.append($searchContainer, $resultsContainer)

//   // Add event listeners
//   $searchButton.on('click', () =>
//     performSearch($searchInput.val(), $resultsContainer)
//   )
//   $searchInput.on('keypress', (e) => {
//     if (e.which === 13) {
//       // Enter key
//       performSearch($searchInput.val(), $resultsContainer)
//     }
//   })
//   $container.append($searchContainer, $resultsContainer)
//   $('#app').append($container)
//   await $container.fadeIn(1000).promise()
// }

// async function performSearch(query, $resultsContainer) {
//   if (!query || query.trim() === '') {
//     $resultsContainer.html(
//       '<p class="search-message">Please enter a search term</p>'
//     )
//     return
//   }

//   $resultsContainer.html('<p class="search-message">Searching...</p>')

//   try {
//     const products = await searchProducts(query)

//     if (products.length === 0) {
//       $resultsContainer.html(
//         '<p class="search-message">No products found. Try a different search term.</p>'
//       )
//       return
//     }

//     // Display top 5 products
//     const topProducts = products.slice(0, 5)
//     const $productList = $('<div>').addClass('product-list')

//     topProducts.forEach((product) => {
//       const $productCard = $('<div>').addClass('product-card')

//       // Create elements for each product property
//       const $name = $('<h3>').text(product.product_name || 'Name not available')
//       const $brand = $('<p>').html(
//         `<strong>Brand:</strong> ${product.brands || 'Not specified'}`
//       )
//       const $barcode = $('<p>').html(
//         `<strong>Barcode:</strong> ${product.code || 'N/A'}`
//       )

//       // Format ingredients (might be very long)
//       let ingredientsText =
//         product.ingredients_text || 'Ingredients not specified'
//       if (ingredientsText.length > 150) {
//         ingredientsText = ingredientsText.substring(0, 150) + '...'
//       }
//       const $ingredients = $('<p>').html(
//         `<strong>Ingredients:</strong> ${ingredientsText}`
//       )

//       // Add product image if available
//       let $image = $('<div>').addClass('product-image-placeholder')
//       if (product.image_url) {
//         $image = $('<img>')
//           .attr('src', product.image_url)
//           .attr('alt', product.product_name || 'Product image')
//           .addClass('product-image')
//       }

//       // Append all elements to product card
//       $productCard.append($image, $name, $brand, $barcode, $ingredients)
//       $productList.append($productCard)
//     })

//     $resultsContainer.empty().append($productList)
//   } catch (error) {
//     console.error('Search error:', error)
//     $resultsContainer.html(
//       '<p class="search-message error">An error occurred during search. Please try again.</p>'
//     )
//   }
// }
