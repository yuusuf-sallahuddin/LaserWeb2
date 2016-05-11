
function initList() {

  $("#useProfile").change(function (){
    setVals();
  });


  var profile = $('#useProfile').val()
  if (profile) {
    if (profile.indexOf('none') == 0) {
      console.log('Using profile: none')
    } else if (profile.indexOf('K40') == 0) {
      console.log('Using profile: K40')
      k40();
    } else if (profile.indexOf('Shapeoko') == 0) {
      //shapeoko();
    }
  }
}

function setVals() {
  var profile = $('#useProfile').val()
  if (profile) {
    if (profile.indexOf('none') == 0) {
      console.log('Setting profile: none')
    } else if (profile.indexOf('K40') == 0) {
      console.log('Setting profile: K40')
      k40defaults();
    } else if (profile.indexOf('Shapeoko') == 0) {
      //shapeoko();
    }
}
}
