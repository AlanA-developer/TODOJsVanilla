export const functionImportanceTask = () => {
    setTimeout(() => {
        let menusValue = document.querySelectorAll('#menuSelect');
        console.log(menusValue);
        for (let i = 0; i < menusValue.length; i++) {
            menusValue[i].addEventListener('change', event => {
                if(event.target.value === 'No importante') {
                    event.target.parentElement.parentElement.style.backgroundColor = 'rgba(25,205,245,0.3)';
                }
    
                if(event.target.value === 'Importante') {
                    event.target.parentElement.parentElement.style.backgroundColor = 'rgba(248,60,114,0.3)';
                }
    
                if(event.target.value === 'Muy importante') {
                    event.target.parentElement.parentElement.style.backgroundColor = 'rgba(246,31,31,0.5)';
                }
                console.log('El menu acaba de cambiar a: ' + event.target.value);
            });
        }
    }, 50);
}