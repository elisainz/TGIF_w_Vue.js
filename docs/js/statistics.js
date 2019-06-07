var members = [];
var estadisticas = {};

var app = new Vue({
    el: '#app',
    data: {
        estadisticasVUE: {},
        miembrosFiltrados: []
    }
});

if (document.title === "TGIF Senate Attendance" || document.title === "TGIF Senate Party Loyalty") {
    url = 'https://api.propublica.org/congress/v1/113/senate/members.json'
} else if (document.title === "TGIF House Attendance" || document.title === "TGIF House Party Loyalty") {
    url = 'https://api.propublica.org/congress/v1/113/house/members.json'
}

fetch(url, {
        method: "GET",
        headers: {
            "X-API-Key": "DjNNmiLeTt8Lmjurho6Q3kXwwBCUBj31PqRGkZIk"
        }
    })
    .then(resp => resp.json())
    .then(data => {
        members = data.results[0].members
    })
    .then(function () {
        guardarEstadisticas()
    })
    .catch(error => console.log(error));

var DataRep = [];
var DataDem = [];
var DataInd = [];

function guardarEstadisticas() {
    estadisticas = //create fields for all the statistics the client has requested
        {
            numberD: 0,
            numberR: 0,
            numberI: 0,
            numberTOTAL: 0,
            vwpDem: 0,
            vwpRep: 0,
            vwpInd: 0,
            vwpTOTAL: 0,
            least_engaged: [],
            most_engaged: [],
            least_loyal: [],
            most_loyal: []
        }

    llenarPartidos();
    calcularCantidadesTotales();
    calcularSumatoriaPorPartido();    
    calcularPorcentajes();

    app.estadisticasVUE = estadisticas;
}


function llenarPartidos(){
    for (i = 0; i < members.length; i++) //contando number of members in each party
    {
        if (members[i].party == 'R') {
            DataRep.push(members[i]);
        } else if (members[i].party == 'D') {
            DataDem.push(members[i]);
        } else if (members[i].party == 'I') {
            DataInd.push(members[i]);
        }
    }
}

function calcularCantidadesTotales(){
    estadisticas.numberD = DataDem.length; //to get number of members in each party
    estadisticas.numberR = DataRep.length;
    estadisticas.numberI = DataInd.length;
    estadisticas.numberTOTAL = DataDem.length + DataRep.length + DataInd.length;
}

function calcularSumatoriaPorPartido(){
    //sumatoria de los votos para c/u
    for (i = 0; i < members.length; i++) {
        if (members[i].party == 'D') {
            estadisticas.vwpDem += +(members[i].votes_with_party_pct / estadisticas.numberD).toFixed(2)
        } else if (members[i].party == 'R') {
            estadisticas.vwpRep += +(members[i].votes_with_party_pct / estadisticas.numberR).toFixed(2)
            //console.log(estadisticas.vwpRep)
        } else if (members[i].party == 'I') {
            estadisticas.vwpInd += +(members[i].votes_with_party_pct / estadisticas.numberI).toFixed(2)
        }
    }

    if (estadisticas.vwpInd == 0) {
        estadisticas.vwpTOTAL += +(estadisticas.vwpDem + estadisticas.vwpRep + estadisticas.vwpInd).toFixed(2) / 2 //porque no hay independientes en house
    } else {
        estadisticas.vwpTOTAL += +(estadisticas.vwpDem + estadisticas.vwpRep + estadisticas.vwpInd).toFixed(2) / 3
    }
}

function calcularPorcentajes(){
    //Math.trunc devuelve la parte entera removiendo any fractorial digits
    //ordenar array de members descendentemente por sus missed votes. diez porciento
    members.sort(function (a, b) {
        return b.missed_votes_pct - a.missed_votes_pct
    })
    for (i = 0; i < Math.trunc(members.length / 10); i++) { //para cada miembro de ese 10% lo guardamos en estadisticas
        estadisticas.least_engaged[i] = members[i]
    }

    //ordenar array de members ascendentemente por sus missed votes. diez porciento
    members.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct
    })
    for (i = 0; i < Math.trunc(members.length / 10); i++) { //para cada miembro de ese 10% lo guardamos en estadisticas
        estadisticas.most_engaged[i] = members[i]
    }

    members.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct
    })
    for (i = 0; i < Math.trunc(members.length / 10); i++) {
        estadisticas.least_loyal[i] = members[i]
    }

    members.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    })
    for (i = 0; i < Math.trunc(members.length / 10); i++) {
        estadisticas.most_loyal[i] = members[i]
    }
}