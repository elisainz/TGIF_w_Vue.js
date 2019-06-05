/*&& = and
|| = or
!  = not*/

var members = [];

var app = new Vue({
	el: '#app',
	data: {
		miembrosFiltrados: [],
		listaEstados: [],
	}
});

if (document.title === "TGIF Senate") {
  url= 'https://api.propublica.org/congress/v1/113/senate/members.json'
} 
else if (document.title === "TGIF House") {
  url= 'https://api.propublica.org/congress/v1/113/house/members.json'
} 


fetch(url, { 
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
  .then(function(){filterTable()},function(){createDropdown(members)} )
  .catch(error =>console.log(error));





function createSenateTabla() {
//	var tablaFormateada = renderSenTable(filterTable(members));
	app.miembrosFiltrados = []//lista filtrada;
}




/*function renderSenTable(membersArray) {
	var tabla = "<thead> <tr><th> Name </th> <th> Party </th> <th> State </th> <th> Years in Office </th> <th> % Votes w/ Party </th> </tr> </thead> "
	tabla += "<tbody>"
	membersArray.forEach(function (element) {
		tabla += "<tr>"

		if (element.middle_name === null) {
			tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
		} else {
			tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
		}

		
	})
	tabla += "</tbody>"
	return tabla;
}*/

function getSenatorsHeaders(data) {
	return "<tr><th></th>" + data.results[0].members(function (dest) /*destination*/ {
		return "<th>" + dest + "</th>";
	}).join("") + "</tr>";
}

function renderSenHeaders(data) {
	var html = getSenatorsHeaders(data);
	document.getElementById("senators-table-headers").innerHTML = html;
}



//document.getElementsByClassName("samerow").onchange = filterTable(members)

function filterTable() {
	var checkedBoxes = Array.from(document.querySelectorAll('input[name=party]:checked'));
	var state = document.querySelector('select').value
	checkboxes = ["R", "D", "I"]
	checkedBoxes = checkedBoxes.map(element => element.value);
	app.miembrosFiltrados = members.filter(members => checkedBoxes.includes(members.party) && (state == "" ? true : members.state == state));
}



function createDropdown(members) {
	 var members =  members.map(member => member.state).filter((value, index, arr) => {
		return app.listaEstados = arr.indexOf(value) === index;
		 //para que no se muestren estados repetidos
	}).sort();
	
	var output = '<option value="">All</option>';
  members.forEach(member => {
    app.listaEstados = output +=
  `<option value = ${member}> ${member} </option>`;
	
  });
  return app.listaEstados
	}
  document.getElementById("estados").innerHTML= createDropdown(members)






