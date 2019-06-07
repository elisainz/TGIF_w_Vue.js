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
	.then( resp => resp.json())
  .then( data => {
	  members = data.results[0].members;
	  filterTable();
	  createDropdown(members);
	})
  .catch(error =>console.log(error));





function createSenateTabla() {
//	var tablaFormateada = renderSenTable(filterTable(members));
	app.miembrosFiltrados = []//lista filtrada;
}


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
	 var estados =  members.map(member => member.state).filter((value, index, arr) => {
		return estados = arr.indexOf(value) === index;
		 //para que no se muestren estados repetidos
	}).sort();

	app.listaEstados = estados;
}





