const btnElt = document.getElementById('see-all-products-button');
const listElt = document.getElementById('articles-list');

if (btnElt && listElt) {
    btnElt.addEventListener('click', () => {
        const isReduced = listElt.classList.toggle('only-display-5-articles');
        btnElt.textContent = isReduced ? 'Voir tout les produits' : 'Réduire';
    });
}

