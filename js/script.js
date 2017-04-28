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
    popupText += '<p>' + obj.description.replace(/\n/g, '<br>') + '</p>';
    popupText += '<p>Íntegra da denúncia: <strong><a href="raw/1aInstancia/pdf/' + obj.id + '.pdf" target="_blank">pdf</a></strong> | <strong><a href="raw/1aInstancia/txt/' + obj.id + '.txt" target="_blank">txt (OCR)</a></strong> | <strong><a href="https://github.com/nighto/lavajato/blob/master/raw/1aInstancia/markdown/' + obj.id + '.md" target="_blank">md (revisado)</a></strong></p>';
    popupText += obj.place ? '<p>Local: <strong>' + obj.place + '</strong></p>' : '';
    popupText += '<p>Denunciados:<ul>';
    for(var person of obj.people){
        // Extra information
        var extraInformation = '';
        extraInformation += person.nationality      ? 'Nacionalidade: '      + translateNationality(person.nationality)     + '\n' : '';
        extraInformation += person.maritalStatus    ? 'Estado civil: '       + translateMaritalStatus(person.maritalStatus) + '\n' : '';
        extraInformation += person.birthDate        ? 'Data de Nascimento: ' + formatDate(person.birthDate)                 + '\n' : '';
        extraInformation += person.parents          ? 'Pais: '               + person.parents.join(' e ')                   + '\n' : '';
        if(person.birthCity){
            extraInformation += 'Natural de: ' + person.birthCity;
            if(person.birthState){
                extraInformation += '/' + person.birthState;
            }
            extraInformation += '\n';
        }
        extraInformation += person.instructionLevel ? 'Grau de Instrução: '  + person.instructionLevel                      + '\n' : '';
        extraInformation += person.profession       ? 'Profissão: '          + person.profession                            + '\n' : '';
        extraInformation += person.cpf              ? 'CPF: '                + formatCPF(person.cpf)                        + '\n' : '';
        extraInformation += person.rg               ? 'RG: '                 + person.rg                                    + '\n' : '';
        extraInformation += person.address          ? 'Endereço: '           + person.address                               + '\n' : '';

        // Person item
        popupText += '<li title="' + extraInformation + '"><strong>' + person.name + '</strong>';
        popupText += person.alias ? ' (vulgo <strong>' + person.alias + '</strong>)': '';
        popupText += '</li>';
    }
    popupText += '</ul></p>';
    popupText += '<p><small>Deixe o mouse sobre o nome de um denunciado para exibir mais informações, como endereço, CPF etc.</small></p>';
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
    switch(maritalStatus){
        case 'married':
            return 'casado';   break;
        case 'single':
            return 'solteiro'; break;
        default:
            return '';
    }
}