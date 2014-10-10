var map = L.map('map', {zoomControl:false, }).setView([-15.8, -51], 4);
L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
}).addTo(map);
L.geoJson(statesData).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Sorteados</h4>' + (props ?
            '<b>' + props.ESTADO + '</b><br />' + props.UF + ' sorteados'
            : 'Selecione Estado');
};

info.addTo(map);

// get color depending on population density value
function getColor(d) {
    return d > 4000 ? '#800026' :
            d > 1500 ? '#BD0026' :
            d > 1000 ? '#E31A1C' :
            d > 500 ? '#FC4E2A' :
            d > 100 ? '#FD8D3C' :
            d > 50 ? '#FEB24C' :
            d > 10 ? '#FED976' :
            '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.UF)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

legend.addTo(map);

