export async function loadCharacterTextBox() {
  const $charactertextbox = $('<div>')
    .addClass('charactertextbox')
    .hide() // Start completely hidden
    .css('opacity', 0) // Set initial opacity to 0
  $('#app').append($charactertextbox)
}

export async function showCharacterTextBox(text) {
  return new Promise((resolve) => {
    const $textbox = $('#app').find('.charactertextbox')
    $textbox.text(text)

    // Reset any previous animations
    $textbox.stop(true, true)

    // Show and fade in simultaneously
    $textbox.show().animate({ opacity: 1 }, 400, resolve)
  })
}

export async function hideCharacterTextBox() {
  return new Promise((resolve) => {
    const $textbox = $('#app').find('.charactertextbox')

    $textbox.animate({ opacity: 0 }, 400, () => {
      $textbox.hide()
      resolve()
    })
  })
}

export async function onItemScanned(text) {
  await showCharacterTextBox(text)
  await new Promise((resolve) => setTimeout(resolve, 4000))
}
