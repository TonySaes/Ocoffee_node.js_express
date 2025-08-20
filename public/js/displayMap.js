  // 1) Crée la carte centrée 
  const map = L.map('map').setView([48.873058319092, 2.316605091095], 10);

  // 2) Ajoute le fond de carte
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 3) Place un marqueur
  L.marker([48.873058319092, 2.316605091095]).addTo(map)
    .bindPopup('10 Rue de Penthièvre, 75008 Paris')
    .openPopup();