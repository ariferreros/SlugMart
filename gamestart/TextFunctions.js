export async function loadCharacterTextBox() {
  const $charactertextbox = $('<div>').addClass('charactertextbox').hide()
  $('#app').append($charactertextbox)
}

export async function showCharacterTextBox(text) {
  return new Promise((resolve) => {
    const $textbox = $('#app').find('.charactertextbox')
    $textbox.text(text).hide().fadeIn(400, resolve) // Hide first then fade in
  })
}

export async function hideCharacterTextBox() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const $textbox = $('#app').find('.charactertextbox')
      $textbox.fadeOut(400, resolve)
    }, 1700) // Wait 3 seconds before fading out
  })
}

export async function onItemScanned(text) {
  await showCharacterTextBox(text)
  await new Promise((resolve) => setTimeout(resolve, 4000))
}
