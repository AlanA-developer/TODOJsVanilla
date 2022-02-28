export const toggleDarkMode = () => {
  // Localizamos y guardamos el elemento checkbox
  const checkbox = document.getElementById('checkbox')

  // Localizamos y guardamos la etiqueta body
  const body = document.querySelector('body')

  // Detectamos el evento change en el checkbox
  checkbox.addEventListener('change', () => {
    // Si el checkbox está activado entonces se activa el darkmode y si no se desactiva
    if (checkbox.checked) {
      body.classList.add('dark')

      checkbox.nextElementSibling.style.border = '1px solid white'
      checkbox.nextElementSibling.innerHTML = 'Dark mode: On 🌑'
    } else {
      body.classList.remove('dark')

      checkbox.nextElementSibling.style.border = '1px solid black'
      checkbox.nextElementSibling.innerHTML = 'Dark mode: Off ☀'
    }
  })
}
