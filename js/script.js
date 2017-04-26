// Default variables
var mapContainer = 'map';
var brazilCoordinates = [-15, -55];
var brazilDefaultZoom = 5;
var basemapURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var basemapAttribution = { attribution: 'Mapa base por <a href="http://osm.org/copyright">OpenStreetMap</a> | Dados do <a href="http://lavajato.mpf.mp.br">Ministério Público Federal</a> | <a href="http://github.com/nighto/lavajato">GitHub</a>' };
var geoJSONURL = 'geojson/1aInstancia.geojson';

// Map initialization
var map = L.map(mapContainer).setView(brazilCoordinates, brazilDefaultZoom);

L.tileLayer(basemapURL, basemapAttribution).addTo(map);

// Data fetch
axios.get(geoJSONURL).then(geoJSONLoadSuccess);

function geoJSONLoadSuccess(response){
    L.geoJSON(response.data, {
        style: function (feature) {
            return {color: 'blue'};//feature.properties.color};
        }
    }).bindPopup(pointPopup)
    .addTo(map);
}

// Popup text
function pointPopup(layer){
    var obj = layer.feature.properties;
    var popupText = '';

    popupText += '<h2>' + obj.phase + 'ª Fase - ' + (+(obj.id)) + 'ª Denúncia</h2>';
    popupText += '<h3>' + obj.title + '</h3>';
    popupText += '<p>' + obj.description + '</p>';
    popupText += '<p>Íntegra da denúncia: <strong><a href="raw/1aInstancia/pdf/' + obj.id + '.pdf" target="_blank">pdf</a></strong> | <strong><a href="raw/1aInstancia/txt/' + obj.id + '.txt" target="_blank">txt (OCR)</a></strong> | <strong><a href="https://github.com/nighto/lavajato/blob/master/raw/1aInstancia/markdown/' + obj.id + '.md" target="_blank">md (revisado)</a></strong></p>';
    popupText += '<p>Local: <strong>' + obj.place + '</strong></p>';
    popupText += '<p>Denunciados:<ul>';
    for(var person of obj.people){
        popupText += '<li><strong>' + person.name + '</strong>';
            popupText += '<ul>';
                popupText += person.nationality      ? '<li>Nacionalidade: '      + translateNationality(person.nationality)     + '</li>' : '';
                popupText += person.maritalStatus    ? '<li>Estado civil: '       + translateMaritalStatus(person.maritalStatus) + '</li>' : '';
                popupText += person.birthDate        ? '<li>Data de Nascimento: ' + formatDate(person.birthDate)                 + '</li>' : '';
                popupText += person.parents          ? '<li>Pais: '               + person.parents.join(' e ')                   + '</li>' : '';
                if(person.birthCity){
                    popupText += '<li>Natural de: ' + person.birthCity;
                    if(person.birthState){
                        popupText += '/' + person.birthState;
                    }
                    popupText += '</li>';
                }
                popupText += person.instructionLevel ? '<li>Grau de Instrução: '  + person.instructionLevel                      + '</li>' : '';
                popupText += person.profession       ? '<li>Profissão: '          + person.profession                            + '</li>' : '';
                popupText += person.cpf              ? '<li>CPF: '                + formatCPF(person.cpf)                        + '</li>' : '';
                popupText += person.rg               ? '<li>RG: '                 + person.rg                                    + '</li>' : '';
                popupText += person.address          ? '<li>Endereço: '           + person.address                               + '</li>' : '';
            popupText += '</ul>';
        popupText += '</li>';
    }
    popupText += '</ul></p>';
    //popupText += '<p><small>Clique no nome de um denunciado para expandir informações.</small></p>';
    return popupText;
}

function formatDate(dateStr){
    var dateArray = dateStr.split('-');
    return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
}

function formatCPF(cpf){
    return cpf.substring(0,3) + '.' + cpf.substring(3,6) + '.' + cpf.substring(6,9) + '-' + cpf.substring(9,11);
}

function translateNationality(nationality){
    if(nationality === 'brazilian'){
        return 'brasileira';
    }
    return '';
}

function translateMaritalStatus(maritalStatus){
    if(maritalStatus === 'married'){
        return 'casado';
    }
    return '';
}