/*&& = and
|| = or
!  = not*/
var members = data.results[0].members; //variable global
createDropdown(members);
createSenateTabla();


function createSenateTabla() {
  var tablaFormateada = renderSenTable(filterTable(members));
  var tablaFinal = document.getElementById("senate-house-data");
  tablaFinal.innerHTML = tablaFormateada;
}




function renderSenTable(membersArray) {
  var tabla = "<thead> <tr><th> Name </th> <th> Party </th> <th> State </th> <th> Years in Office </th> <th> % Votes w/ Party </th> </tr> </thead> "
  tabla += "<tbody>"
  membersArray.forEach(function (element) {
    tabla += "<tr>"

    if (element.middle_name === null) {
      tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
    } else {
      tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.middle_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
    }

    /*  */
  })
  tabla += "</tbody>"
  return tabla;
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

function filterTable(membersArray) {
  var checkedBoxes = Array.from(document.querySelectorAll('input[name=party]:checked'));
  var state = document.querySelector('select').value
  console.log(state)
  //checkboxes = ["R", "D", "I"]
  checkedBoxes = checkedBoxes.map(element => element.value);
  console.log(checkedBoxes);
  var miembrosFiltrados = [];
  miembrosFiltrados = membersArray.filter(miembro => checkedBoxes.includes(miembro.party) && (state == "" ? true : miembro.state == state ));
  console.log(miembrosFiltrados)
  return miembrosFiltrados;


}



function createDropdown(members) {
  var members = members.map(member => member.state).filter((value, index, arr) => //para que no se muestren estados repetidos
    {
      return arr.indexOf(value) === index;
    }).sort();


  var output = '<option value="">All</option>';
  members.forEach(member => {
    output +=
  `<option value = ${member}> ${member} </option>`;



  });

  document.querySelector("#select-state").innerHTML = output;

}
createDropdown(members);










/*function getFilters(membersArray) {

  membersArray.map(function (element) {
        tabla += "<tr>"
        if (element.party === R) {
          tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
        }

        if (element.party === D) {
          tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
        }
        if (element.party === I) {
          tabla += "<td>" + "<a href='" + element.url + "'>" + element.first_name + "&nbsp;" + element.last_name + "</td><td>" + "</a>" + element.party + "</td><td>" + element.state + "</td><td>" + element.seniority + "</td><td>" + element.votes_with_party_pct + '%' + "</td>";
        }
      }
      tabla += "</tbody>"
      return tabla;







      /*console.log(data.results[0]/*al ser un array poner []/.members); */



/* var planta = {
   nombre: "fedeeee",
   edad: 26
 };

 var persona = {
   nombre: "fede",
   edad: 26
 };

 function pruebaNombre(p) {
   return p.nombre;

 }
 pruebaNombre(planta); */

////*console.log(JSON.stringify()) o make the data variable's contents a string (easier to read)*///
