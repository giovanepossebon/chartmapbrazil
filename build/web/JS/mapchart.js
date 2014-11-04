var map = L.map('map', {zoomControl:false, }).setView([-15.8, -51], 4);
L.tileLayer('http://{s}.tiles.mapbox.com/v3/giovanepossebon.jnhj7ngk/{z}/{x}/{y}.png', {
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

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#FFFFFF',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}


// get color depending on population density value
function getColor(d) {
    return  d > 10000 ? '#053664' :
            d > 200 ? '#A2A636' :
            d > 50 ? '#FCBA05' :
            '#C9193A';
}

function style(feature) {
    return {
        opacity: 0.9,
        weight: 2,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.UF)
    };
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
        mouseout: resetHighlight
//        click: zoomToFeature
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

