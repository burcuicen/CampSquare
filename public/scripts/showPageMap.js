

        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: coordinates,
        zoom: 9 // starting zoom
        });

// Create a default Marker and add it to the map.
new mapboxgl.Marker()
.setLngLat(coordinates)
.setPopup(
    new mapboxgl.Popup({ closeOnClick: false })
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
)
.addTo(map);