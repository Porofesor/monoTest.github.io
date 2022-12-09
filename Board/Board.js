//Create board to play

let FIELDSLIST_JSON;

async function CreateField() {
  //Get fields from json
  const response = await fetch('./Board/Fields.json');
  const Fields = await response.json();
  //Get fields to global list for later
  FIELDSLIST_JSON = Fields;

  //Create board
  let FieldsArray;
  const Board = document.getElementById("Board")
  document.getElementById("Main").innerHTML = ""  
  
  Fields.forEach(element => {
    //console.log(typeof(element.content), " ", "_",element.content,"_",JSON.stringify(element.content))
    switch (String(element.content)) {
      case "None":
        FieldsArray=`
          <div class="Field" id="item-${element.id}">
            <div class="Players_box" id='playerbox-${element.id}'></div>
          </div>
        `
        break;
      case 'Bottom':
        FieldsArray=`
          <div class="Field-Upper-Bottom" id='item-${element.id}'>
            <div class="ColoredBox-${element.country}" id="ColoredBox-${element.id}"></div>
            <div class="field__name">${element.title}</div>
            <div class="Players_box" id='playerbox-${element.id}'></div>
      
            <div class="field__price">$${element.property_value}</div>
          </div>
        `
        break;
      case "Left":
        FieldsArray=`
          <div class="Field-Left-Right" id='item-${element.id}'>
            <div class="field__price">$${element.property_value}</div>
            
            <div class="Players_box" id='playerbox-${element.id}'></div>
            <div class="field__name">${element.title}</div>
            <div class="ColoredBox-${element.country}" id="ColoredBox-${element.id}"></div>
          </div>
        `
        break;
      case "Upper":
        FieldsArray=`
          <div class="Field-Upper-Bottom" id='item-${element.id}'>
            <div class="field__name">${element.title}</div>
            <div class="field__price">$${element.property_value}</div>
            <div class="Players_box" id='playerbox-${element.id}'></div>
            <div class="ColoredBox-${element.country}" id="ColoredBox-${element.id}"></div>
          </div>
        `
        break;
      case "Right":
        FieldsArray=`
          <div class="Field-Left-Right" id='item-${element.id}'>
            <div class="ColoredBox-${element.country}" id="ColoredBox-${element.id}"></div>
            <div class="field__name">${element.title}</div>
            <div class="Players_box" id='playerbox-${element.id}'></div>
            
            <div class="field__price">$${element.property_value}</div>
          </div>
        `
        break;
      case "Midle":
        FieldsArray =`
        <div class="Field-Left-Right" id='item-${element.id}'>
          <div class="Field" id="ControlPanel">
            <div class="MainBox">ControlPanel</div>
          </div>
        </div>
        `
        break;
      default:
        FieldsArray=`
          <div class="Field" id='item-${element.id}'>
            <div class="MainBox"><p>None</p></div>
          </div>
        `
        break;
    }
    Board.innerHTML+=FieldsArray
  });
  
  //Game
  startGame()
}