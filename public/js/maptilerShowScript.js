maptilersdk.config.apiKey = maptilerAPI;

const map = new maptilersdk.Map({
    container: 'map', 
    style: maptilersdk.MapStyle.STREETS,
    center: campsiteGeometry.coordinates, 
    zoom: 12, 
});

map.scrollZoom.disable();

const marker = new maptilersdk.Marker()
    .setLngLat(campsiteGeometry.coordinates)
    .setPopup(
        new maptilersdk.Popup()
            .setHTML(
                `<h5>${campsiteTitle}</h5><p>${campsiteLocation}</p>`
            )
    )
    .addTo(map)
