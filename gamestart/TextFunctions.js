export async function loadCharacterTextBox() {
  const $charactertextbox = $('<div>').addClass('charactertextbox')
  $('#app').append($charactertextbox)

  hideCharacterTextBox()
}

export async function hideCharacterTextBox() {
  $('#app').find('.charactertextbox').hide()
}

export async function showCharacterTextBox(text) {
  $('#app').find('.charactertextbox').show()
  $('#app').find('.charactertextbox').text(text)
}

export async function onItemScanned(text) {
  showCharacterTextBox(text)
}
