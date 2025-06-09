import {
  createGroceryZone,
  createScanZone,
  createDropZone,
  loadBackground,
  loadForeground,
  loadHomeScreen,
} from './GameFunctions.js'
import { startDay } from './script.js'
import { searchProducts, getProductInfo } from './productAPI.js'

let currentSearchResults = []
let trackedItems = []

export async function loadEndScreen() {
  // Clear the scene
  $('#app').empty()

  // Load background and foreground
  await loadBackground()
  await loadForeground()

  // Create zones
  const $groceryZone = createGroceryZone()
  const $scanZone = createScanZone()
  const $dropZone = createDropZone()

  // Create header with three sections
  const $header = $('<div>').addClass('search-header').css({
    display: 'flex',
    justifyContent: 'space-between', // Distribute space between sections
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fffbdb',
    border: 'solid 5px rgb(45, 38, 38)',
    borderRadius: '4px',
    zIndex: 200,
    fontSize: '20px',
    paddingbottom: '20px',
  })

  // Left section - Home button
  const $leftSection = $('<div>').css({ display: 'flex', alignItems: 'center' })
  const $homeButton = $('<button>')
    .text('Home')
    .addClass('search-button')
    .css({ fontSize: '20px', padding: '10px 20px' })

  $homeButton.on('click', loadHomeScreen)
  $leftSection.append($homeButton)

  // Center section - Title and search
  const $centerSection = $('<div>').css({
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    alignItems: 'center',
  })
  $centerSection.append($('<h1>').text("What's in your cart?"))

  const $searchContainer = $('<div>').addClass('search-container')
  const $searchInput = $('<input>')
    .attr('type', 'text')
    .attr('placeholder', 'Search here...')
    .addClass('search-input')
  const $searchButton = $('<button>').text('Search').addClass('search-button')

  $searchContainer.append($searchInput, $searchButton)
  $centerSection.append($searchContainer)

  // Right section - Start button
  const $rightSection = $('<div>').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  })

  const $startButton = $('<img>')
    .addClass('button')
    .attr('id', 'start-button')
    .attr('src', './public/assets/environment/startbutton.png')
    .css({ height: '70px' }) // Adjust size as needed

  $startButton.on('click', async function () {
    startDay(0, 0)
  })
  $rightSection.append($startButton)

  // Assemble header
  $header.append($leftSection, $centerSection, $rightSection)
  $('#app').append($header)

  // Event listeners
  $searchButton.on('click', () => {
    performSearch($searchInput.val(), $groceryZone, $scanZone, $dropZone)
    $('.grocery-zone').css('left', '-50%')
  })
  $searchInput.on('keypress', (e) => {
    if (e.which === 13)
      performSearch($searchInput.val(), $groceryZone, $scanZone, $dropZone)
  })
}

async function performSearch(query, $groceryZone, $scanZone, $dropZone) {
  if (!query || query.trim() === '') return

  // Clear previous results
  $groceryZone.empty()
  trackedItems = []
  currentSearchResults = []

  try {
    const products = await searchProducts(query)
    currentSearchResults = products.slice(0, 5)

    if (currentSearchResults.length > 0) {
      await loadSearchResults(
        currentSearchResults,
        $groceryZone,
        $scanZone,
        $dropZone
      )
    }
  } catch (error) {
    console.error('Search error:', error)
  }
}

async function loadSearchResults(products, $groceryZone, $scanZone, $dropZone) {
  const startX = window.innerWidth * 0.01
  const startY = window.innerHeight * 0.58
  const xSpacing = window.innerWidth * 0.2

  // Setup drop zone
  $dropZone.droppable({
    drop: function (event, ui) {
      const $draggedItem = ui.helper
      $draggedItem.remove()
      trackedItems = trackedItems.filter((item) => item !== $draggedItem)
      $('.product-popup').remove()
    },
  })

  products.forEach((product, index) => {
    const $item = $('<img>')
      .addClass('food-item')
      .css({
        cursor: 'grab',
        // border: '2px solid #000',
        zIndex: 100,
      })
      .data('product', product)
      .data('hasBeenScanned', false)

    // Set image if available, otherwise use placeholder
    if (product.image_url) {
      $item.attr('src', product.image_url)
    } else {
      $item.css({
        'background-color': '#ccc',
        // border: '2px dashed #999',
      })
    }

    $item.draggable({
      start: function () {
        $(this).css('z-index', '100')
      },
      drag: function (event, ui) {
        const itemRect = ui.helper[0].getBoundingClientRect()
        const scanRect = $scanZone[0].getBoundingClientRect()
        const isOverlapping = checkOverlap(itemRect, scanRect)

        if (isOverlapping && !$(this).data('hasBeenScanned')) {
          $scanZone.addClass('scan-flash')
          setTimeout(() => $scanZone.removeClass('scan-flash'), 500)
          $(this).data('hasBeenScanned', true)
          showProductPopup($(this).data('product'))
        }
      },
    })

    trackedItems.push($item)
    $groceryZone.append($item)
  })
  await new Promise((resolve) => {
    $('.grocery-zone').animate({ left: '0%' }, 2000, resolve)
    console.log('Food enters')
  })
}

function showProductPopup(product) {
  // css by chatgpt
  const $popup = $('<div>').addClass('product-popup').css({
    display: 'flex',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '80vh',
    padding: '20px',
    width: '80%',
    zIndex: 2000,
    backgroundColor: '#fffbdb',
    boxShadow: '0 5px 30px rgba(0,0,0,0.3)',
    border: 'solid 5px rgb(45, 38, 38)',
    overflow: 'hidden',
  })

  // Create content container
  const $content = $('<div>').css({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '20px',
    gap: '25px',
  })

  // Image container
  const $imageContainer = $('<div>').css({
    flex: '0 0 35%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6ecc0',
    borderRadius: '10px',
    padding: '15px',
  })

  if (product.image_url) {
    $imageContainer.append(
      $('<img>').attr('src', product.image_url).css({
        maxHeight: '250px',
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
      })
    )
  } else {
    $imageContainer.append(
      $('<div>').text('No Image').css({
        color: '#999',
        fontSize: '16px',
        textAlign: 'center',
      })
    )
  }

  // Details container
  const $details = $('<div>').css({
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '65vh',
    paddingRight: '10px',
  })

  // Product name
  $details.append(
    $('<h2>')
      .text(product.product_name || 'Name not available')
      .css({
        margin: '0 0 15px 0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
      })
  )

  // Metadata section
  const $metadata = $('<div>').css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
  })

  $metadata.append(
    $('<div>').html(
      `<strong>Brand:</strong> ${product.brands || 'Not specified'}`
    ),
    $('<div>').html(`<strong>Barcode:</strong> ${product.code || 'N/A'}`)
  )

  $details.append($metadata)

  // Ingredients section
  let ingredientsText = product.ingredients_text || 'Ingredients not specified'
  if (ingredientsText.length > 500) {
    ingredientsText = ingredientsText.substring(0, 500) + '...'
  }

  $details.append(
    $('<div>')
      .css({ marginBottom: '20px' })
      .append(
        $('<h3>').text('Ingredients').css({
          fontSize: '18px',
          margin: '0 0 8px 0',
          fontWeight: '600',
        }),
        $('<p>').text(ingredientsText).css({
          fontSize: '15px',
          lineHeight: '1.4',
          color: '#555',
        })
      )
  )

  // Nutrition section
  if (product.nutriments) {
    const nutriments = product.nutriments
    const $nutrition = $('<div>').css({ marginBottom: '20px' })

    $nutrition.append(
      $('<h3>').text('Nutrition Information (per 100g)').css({
        fontSize: '18px',
        margin: '0 0 15px 0',
        fontWeight: '600',
      })
    )

    const $nutrientGrid = $('<div>').css({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '12px',
    })

    const nutrients = [
      { name: 'Energy', value: nutriments['energy-kcal_100g'], unit: 'kcal' },
      { name: 'Fat', value: nutriments.fat_100g, unit: 'g' },
      { name: 'Carbs', value: nutriments.carbohydrates_100g, unit: 'g' },
      { name: 'Sugar', value: nutriments.sugars_100g, unit: 'g' },
      { name: 'Protein', value: nutriments.proteins_100g, unit: 'g' },
      { name: 'Salt', value: nutriments.salt_100g, unit: 'g' },
    ]

    nutrients.forEach((nutrient) => {
      if (nutrient.value !== undefined) {
        $nutrientGrid.append(
          $('<div>')
            .css({
              backgroundColor: '#f6ecc0',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
            })
            .append(
              $('<div>').text(nutrient.name).css({
                fontWeight: '600',
                fontSize: '15px',
                marginBottom: '5px',
              }),
              $('<div>').text(`${nutrient.value} ${nutrient.unit}`).css({
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#e8684b',
              })
            )
        )
      }
    })

    $nutrition.append($nutrientGrid)
    $details.append($nutrition)
  }

  // Close button
  const $closeButton = $('<button>')
    .text('✕ Close')
    .css({
      alignSelf: 'flex-end',
      padding: '8px 20px',
      backgroundColor: '#e8684b',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'background-color 0.2s',
    })
    .on('click', () => $popup.remove())

  $details.append($closeButton)
  $content.append($imageContainer, $details)
  $popup.append($content)
  $('#app').append($popup)
}

function checkOverlap(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  )
}
