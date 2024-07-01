/*eslint-disable*/

export const displayMap = (locations, startLocation, mapToken) => {
  locations.push(startLocation);
  mapboxgl.accessToken = mapToken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/alextonkov2004/cly05dy6g003a01qp56vu0fxt',
    //center: [-118.155614, 33.976076],
    //zoom: 1,
    //interactive: true
    scrollZoom: false,
  });
  map.on('style.load', () => {
    map.setFog({});
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;
    //Create marker
    const el = document.createElement('div');
    loc.day === undefined
      ? (el.className = 'marker-orange')
      : (el.className = 'marker');
    let paragraph;
    loc.day === undefined
      ? (paragraph = `<p>Start: ${loc.address}</p>`)
      : (paragraph = `<p>Day ${loc.day}: ${loc.description}</p>`);

    //Add Pop up
    const popUp = new mapboxgl.Popup({
      offset: 30,
      closeButton: false,
      closeOnClick: false,
    }).setHTML(paragraph);

    //Add marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .setPopup(popUp)
      .addTo(map);

    const markerDiv = marker.getElement();
    markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
    markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
    // Extends map bounds to include current location
    bounds.extend([lng, lat]);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100,
    },
  });
};
