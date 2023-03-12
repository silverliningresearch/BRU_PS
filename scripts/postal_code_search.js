var postalCodeList;
var rawList = [];
var postalCodeShortList = [];
function find_postal_code(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_postal_code() {
  console.log("load_postal_code started...");

  var country = api.fn.answers().Q55_Recoded;
  if (country ==='Belgium' || country ==='比利时' || country ==='Belgique' 
   || country ==='Belgien')  {
    rawList = JSON.parse(postalCodeBelgium);
  }
  else if (country ==='France' || country ==='法国' || country ==='France' 
  || country ==='Frankreich' ) {
    rawList = JSON.parse(postalCodeFrance);
  }
  else if (country ==='Germany' || country ==='德国'|| country ==='Allemagne' 
    || country ==='Deutschland') {
    rawList = JSON.parse(postalCodeGermany);
  }
  else if (country ==='Luxembourg' || country ==='卢森堡' || country ==='Luxembourg' 
  || country ==='Luxemburg') {
    rawList = JSON.parse(postalCodeLuxembourg);
  }
  else if (country ==='Netherlands' || country ==='荷兰' || country ==='Pays-Bas' 
  || country ==='Niederlande' )  {
    rawList = JSON.parse(postalCodeNetherlands);
  }
  else {
    rawList = JSON.parse(postalCodeNone);
  }
  
  postalCodeList = [];
  postalCodeList.length = 0;
  for (i = 0; i < rawList.length; i++) {
    var item = rawList[i];
    item.show = item.code + "-" + item.name;
    postalCodeList.push(item);
  }

  api.fn.answers({Q56_Catchment:  "No"}); //Clear it
  console.log("load_postal_code done!");
}

function update_postal_code_search_box() {
  var input = document.getElementById('inputPostalCodeID').value;
  var list = document.getElementById('postalCodehtmlList');
  
  list.innerHTML = '';
  input = input.toLowerCase();

  postalCodeShortList = [];
  postalCodeShortList.length = 0;
  
  var count = 0;
  for (i = 0; i < postalCodeList.length; i++) {
    let postcalCode = postalCodeList[i];

    if (postcalCode.show.toLowerCase().includes(input)) {
      const elem = document.createElement("option");
      elem.value = postcalCode.show;
      list.appendChild(elem);
      postalCodeShortList.push(postcalCode);
      count++;
    }
    if (count > 30) break;
  }

  if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeID').value);
  }
}

function select_postal_code() {
  var selectedPostalCode = document.getElementById('inputPostalCodeID').value;
  api.fn.answers({Q56_postal_code:  selectedPostalCode});

  for (i = 0; i < postalCodeShortList.length; i++) {
    var currentPostalCode = postalCodeShortList[i];
    if (currentPostalCode.show == selectedPostalCode) { 
      console.log("selectedPostalCode: ", currentPostalCode);
      api.fn.answers({Q56_Catchment:  currentPostalCode.catchment});
    }
  }

  if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
    console.log("Select found ", document.getElementById('inputPostalCodeID').value);
  }
  else{
    console.log("Select not found ", document.getElementById('inputPostalCodeID').value);
    alert("Please select a postal code from the list.");
  }
}

function show_postal_code_search_box() {
    load_postal_code();  

    $('.rt-element.rt-text-container').append(`<input list="postalCodehtmlList" onchange="select_postal_code()"  onkeyup="update_postal_code_search_box()" name="inputPostalCodeID" id="inputPostalCodeID" >
    <datalist id="postalCodehtmlList"> </datalist>`);
    document.getElementById('inputPostalCodeID').value = "";

    var currentValue  = api.fn.answers().Q56_postal_code;
    if (currentValue) {
      if (currentValue !== "") {
        document.getElementById('inputPostalCodeID').value = currentValue;
      }
    }

    if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
      console.log("Found ", document.getElementById('inputPostalCodeID').value);
    }
    else{
      console.log("not found ", document.getElementById('inputPostalCodeID').value);
    }

    //$('.rt-btn.rt-btn-next').hide(); 
    $('#inputPostalCodeID').show(); 
}

function hide_postal_code_search_box() {
  $('#inputPostalCodeID').hide();
}

