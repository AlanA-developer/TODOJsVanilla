export const toggleDarkMode = () => {
    const checkbox = document.getElementById('checkbox');
    const body = document.querySelector('body');
    const h1 = document.querySelector('h1');
    const h3 = document.querySelector('h3');

    checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        body.classList.add('dark');
        h1.classList.add('dark-font');
        h3.classList.add('dark-font');
        checkbox.nextElementSibling.style.border = '1px solid white';
        checkbox.nextElementSibling.innerHTML = 'Dark mode: On 🌑';
    } else {
        body.classList.remove('dark');
        h1.classList.remove('dark-font');
        h3.classList.remove('dark-font');
        checkbox.nextElementSibling.style.border = '1px solid black';
        checkbox.nextElementSibling.innerHTML = 'Dark mode: Off  ☀';
    }  
    });
}