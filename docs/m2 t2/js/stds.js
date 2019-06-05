var DataJson = JSON.parse(JSON.stringify(data));
var DataRep = [];
var DataDem = [];
var DataInd = [];

var estadisticas = {
  numberD: 0,
  numberR: 0,
  numberI: 0,
  VWPD: 0,
  VWPR: 0,
  VWPI: 0,
  membersTop: [],
  membersBotton: []
}


for (i = 0; i < DataJson.results[0].members.length; i++) {
  if (DataJson.results[0].members[i].party == 'R') {
    DataRep.push(DataJson.results[0].members[i]);
  } else if (DataJson.results[0].members[i].party == 'D') {
    DataDem.push(DataJson.results[0].members[i]);
  } else if (DataJson.results[0].members[i].party == 'I') {
    DataInd.push(DataJson.results[0].members[i]);
  }
}
estadisticas.numberD = DataDem.length;
//console.log(estadisticas.numberD);
estadisticas.numberR = DataRep.length;
//console.log(estadisticas.numberR);
estadisticas.numberI = DataInd.length;
//console.log(JSON.stringify(estadisticas));

DataDem.forEach(e => {
  estadisticas.VWPD+= e.votes_with_party_pct;
});
estadisticas.VWPD /=estadisticas.numberD;
estadisticas.VWPD=estadisticas.VWPD.toFixed(2); //numero de decimales despues de la coma
console.log(estadisticas.VWPD);

DataRep.forEach(e => {
  estadisticas.VWPR+= e.votes_with_party_pct;
});
estadisticas.VWPR /=estadisticas.numberR,
estadisticas.VWPR=estadisticas.VWPR.toFixed(2);
console.log(estadisticas.VWPR);

estadisticas.VWPD = sumarVotos(DataDem);
estadisticas.VWPR = sumarVotos(DataRep);
estadisticas.VWPI = sumarVotos(DataInd);

function sumarVotos(datos){
  suma=0;
  datos.forEach(e => {
  suma+= e.votes_with_party_pct;
  });
  suma /=estadisticas.numberI;
  estadisticas.VWPI=estadisticas.VWPI.toFixed(2);
  console.log(estadisticas.VWPI);
 return suma;
}



$("#table-data").append('<thead class="bg-light">'
	+ '<tr>'
	+ '<th>Name</th>'
	+ '<th>Party</th>'
	+ '<th>State</th>'
	+ '<th>Years in office</th>'
	+ '<th>%Votes w/party</th>'/* */
	+ '</tr>'
	+ '</thead>'
	+ '<tbody>'
);
