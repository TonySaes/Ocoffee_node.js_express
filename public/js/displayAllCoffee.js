const btnElt = document.getElementById('see-all-products-button');
const listElt = document.getElementById('articles-list');

if (btnElt && listElt) {
    btnElt.addEventListener('click', () => {
        listElt.classList.remove('only-display-4-articles');
    });
}

