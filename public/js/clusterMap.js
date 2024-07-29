maptilersdk.config.apiKey = maptilerAPI;

const map = new maptilersdk.Map({
    container: 'map',
    zoom: 4,
    center: [-99.99361649136092, 39.84495136563171],
    style: maptilersdk.MapStyle.STREETS
});

map.scrollZoom.disable();

map.on('load', function () {

    map.addSource('campsites', {
        'type': 'geojson',
        'data': campsites,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50 
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campsites',
        filter: ['has', 'point_count'],
        paint: {

            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#a4c3b2',
                100,
                '#f6f1f7',
                750,
                '#ef233c'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campsites',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campsites',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    map.on('click', 'clusters', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campsites').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    map.on('click', 'unclustered-point', function (e) {

        const { popupMark } = e.features[0].properties;

        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(popupMark)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});