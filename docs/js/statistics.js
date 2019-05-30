var members = [];

var app = new Vue({
	el: '#app',
	data: {
		estadisticasVUE: {},
	}
});

fetch('https://api.propublica.org/congress/v1/113/senate/members.json', {
		method: "GET",
		headers: {
			"X-API-Key": "DjNNmiLeTt8Lmjurho6Q3kXwwBCUBj31PqRGkZIk"
		}
	})
	//.then(function (response) {
	//var data = response.json();
	//console.log(data);

	//})
	.then( resp => resp.json())
  .then( data => {members = data.results[0].members})
  .then(function(){guardarEstadisticas(members)})
  .catch(error =>console.log(error));


/*.catch(function (error) {
	alert("hay un error")
	// If there is any error you will catch them here
});*/



var DataRep = [];
var DataDem = [];
var DataInd = [];

function guardarEstadisticas(members) {
	var estadisticas = //create fields for all the statistics the client has requested
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

	estadisticas.numberD = DataDem.length; //to get number of members in each party
	//console.log(estadisticas.numberD);
	estadisticas.numberR = DataRep.length;
	//console.log(estadisticas.numberR);
	estadisticas.numberI = DataInd.length;
	//console.log(estadisticas.numberI)
	estadisticas.numberTOTAL = DataDem.length + DataRep.length + DataInd.length;
	//console.log(JSON.stringify(estadisticas));


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

	function TablaAtAGlance() {
		var tabla = "<thead> <tr> <th> Party </th>  <th> Number of Reps </th> <th> % Voted with Party </th> </tr> </thead> "
		tabla += "<tbody>"
		tabla += "<tr> <td> Democrats </td>  <td> " + estadisticas.numberD + " </td> <td> " + (estadisticas.vwpDem).toFixed(2) + " % </td></tr>"
		tabla += "<tr> <td> Republicans </td>  <td> " + estadisticas.numberR + " </td> <td> " + (estadisticas.vwpRep).toFixed(2) + " % </td></tr>"
		tabla += "<tr> <td> Independents </td>  <td> " + estadisticas.numberI + " </td> <td> " + (estadisticas.vwpInd).toFixed(2) + " % </td></tr>"
		tabla += "<tr> <td> Total </td>  <td> " + estadisticas.numberTOTAL + " </td> <td> " + (estadisticas.vwpTOTAL).toFixed(2) + " % </td></tr>"
		tabla += "</tbody>"
		document.getElementById("senate-house-at-a-glance").innerHTML = tabla;
	}




	//Math.trunc devuelve la parte entera removiendo any fractorial digits
	//ordenar array de members descendentemente por sus missed votes. diez porciento
	members.sort(function (a, b) {
		return b.missed_votes_pct - a.missed_votes_pct
	})
	for (i = 0; i < Math.trunc(members.length / 10); i++) { //para cada miembro de ese 10% lo guardamos en estadisticas
		estadisticas.least_engaged[i] = members[i]
	}

	function TablaLeastEngaged() {
		var tabla = "<thead> <tr> <th> Name </th>  <th> Number of Missed Votes </th> <th> % Votes Missed </th> </tr> </thead> "
		tabla += "<tbody>"
		estadisticas.least_engaged.forEach(function (element) {
			tabla += "<tr>"
			if (element.middle_name === null) {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + " </td> <td>" + element.missed_votes + " </td> <td>" + element.missed_votes_pct + " % </td> </tr>"
			} else {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + " </td> <td>" + element.missed_votes + " </td> <td>" + element.missed_votes_pct + " % </td> </tr>"
			}
		});
		tabla += "</tbody>"
		document.getElementById("senate-house-least-engaged").innerHTML = tabla;
	}




	//ordenar array de members ascendentemente por sus missed votes. diez porciento
	members.sort(function (a, b) {
		return a.missed_votes_pct - b.missed_votes_pct
	})
	for (i = 0; i < Math.trunc(members.length / 10); i++) { //para cada miembro de ese 10% lo guardamos en estadisticas
		estadisticas.most_engaged[i] = members[i]
	}

	function TablaMostEngaged() {
		var tabla = "<thead> <tr> <th> Name </th>  <th> Number of Missed Votes </th> <th> % Votes Missed </th> </tr> </thead> "
		tabla += "<tbody>"
		estadisticas.most_engaged.forEach(function (element) {
			tabla += "<tr>"
			if (element.middle_name === null) {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + " </td> <td>" + element.missed_votes + " </td> <td>" + element.missed_votes_pct + " % </td> </tr>"
			} else {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + " </td> <td>" + element.missed_votes + " </td> <td>" + element.missed_votes_pct + " % </td> </tr>"
			}
		});
		tabla += "</tbody>"
		document.getElementById("senate-house-most-engaged").innerHTML = tabla;
	}





	members.sort(function (a, b) {
		return a.votes_with_party_pct - b.votes_with_party_pct
	})
	for (i = 0; i < Math.trunc(members.length / 10); i++) {
		estadisticas.least_loyal[i] = members[i]
	}

	function TablaLeastLoyal() {
		var tabla = "<thead> <tr> <th> Name </th>  <th> Number of Party Votes </th> <th> % Party Votes </th> </tr> </thead> "
		tabla += "<tbody>"
		estadisticas.least_loyal.forEach(function (element) {
			tabla += "<tr>"
			if (element.middle_name === null) {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + " </td> <td>" + element.total_votes + " </td> <td>" + element.votes_with_party_pct + " % </td> </tr>"
			} else {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + " </td> <td>" + element.total_votes + " </td> <td>" + element.votes_with_party_pct + " % </td> </tr>"
			}
		});
		tabla += "</tbody>"
		document.getElementById("senate-house-least-loyal").innerHTML = tabla;
	}




	members.sort(function (a, b) {
		return b.votes_with_party_pct - a.votes_with_party_pct
	})
	for (i = 0; i < Math.trunc(members.length / 10); i++) {
		estadisticas.most_loyal[i] = members[i]
	}

	function TablaMostLoyal() {
		var tabla = "<thead> <tr> <th> Name </th>  <th> Number of Party Votes </th> <th> % Party Votes </th> </tr> </thead> "
		tabla += "<tbody>"
		estadisticas.most_loyal.forEach(function (element) {
			tabla += "<tr>"
			if (element.middle_name === null) {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + " </td> <td>" + element.total_votes + " </td> <td>" + element.votes_with_party_pct + " % </td> </tr>"
			} else {
				tabla += "<tr> <td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + " </td> <td>" + element.total_votes + " </td> <td>" + element.votes_with_party_pct + " % </td> </tr>"
			}
		});
		tabla += "</tbody>"
		document.getElementById("senate-house-most-loyal").innerHTML = tabla;
	}

	app.estadisticasVUE = estadisticas;

}
