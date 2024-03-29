//colors of players 
const player_color = [`rgba(255, 0, 0, 1)`, `rgba(208, 255, 0,1)`, `#4EABDB`, `rgba(0, 167, 31 ,1)`];


//Create interface to display and interact with game
const createInterface = () => {
    const controlPanel = document.getElementById("ControlPanel");
    
    controlPanel.innerHTML = `
    <div class="interface" id='interface'>
        <div id='interface__main'>
            <div id="interface__history">
                    <textarea id="interface__history__textarea" contenteditable="true" name="history"></textarea>
            </div>
            <div id="interface__current">
                <div id="current__player"></div>
                <div id='interface__dice__result'></div>
                <div id="interface__dice__endTurn"></div>
                <div id="interface__buy__field"></div>
            </div>
            <div id="players__list">t</div>
        </div>
        <div id="interface__auction"></div>
        <div id="interface__bankrupcy"></div>
        <div id="interface__players__info"></div>
    </div>`
}

//Role dice button
const updateDiceButton = (player) => {
    document.getElementById('interface__dice__endTurn').innerHTML = `
    <button onclick="roll_dice(${player.id})" class="Roll" id="Roll">Roll the dice</button>
    `
}

//End your turn
const endTurnButton = (player) => {
    document.getElementById('interface__dice__endTurn').innerHTML = `
    <button onclick="endTurn(${player.id})" class="endTurn" id="endTurn">End your turn</button>
    `
}

//Buy property button
const buyFieldButton = (playerId, fieldId) => {
    let player = PLAYERS[playerId];
    let field = FIELDS_LIST[fieldId];
    let decision = player.decisionBuyField(field);
    //worth
    if(decision < 0 && decision > -200){
        document.getElementById(`interface__buy__field`).innerHTML+=
        `<button onclick="buyField(${playerId}, ${fieldId})" class="buyField worth" id="buyField">Buy property
            <div class="support_message">
                Its worth to buy
            </div>
        </button>`
        return;
    }
    //more worth
    if(decision <= -200){
        document.getElementById(`interface__buy__field`).innerHTML+=
        `<button onclick="buyField(${playerId}, ${fieldId})" class="buyField more_worth" id="buyField">Buy property
            <div class="support_message">
                Its very good idea to buy
            </div>
        </button>`
        return;
    }
    //not worth
    if(decision >= 0 && decision < 200){
        document.getElementById(`interface__buy__field`).innerHTML+=
        `<button onclick="buyField(${playerId}, ${fieldId})" class="buyField not_worth" id="buyField">Buy property
            <div class="support_message">
                Its not worth
            </div>
        </button>`
        return;
    }
    //Not even close
    if(decision >= 200){
        document.getElementById(`interface__buy__field`).innerHTML+=
        `<button onclick="buyField(${playerId}, ${fieldId})" class="buyField Not_even_close" id="buyField">Buy property
            <div class="support_message">
                Its not really worth 
            </div>
        </button>`
        return;
    }

    //document.getElementById('interface__buy__field').innerHTML = `
    //<button onclick="buyField(${playerId}, ${fieldId})" class="buyField" id="buyField">Buy this property</button>
    //`
}

//remove buy property button
const removeBuyFieldButton = () => {
    document.getElementById('interface__buy__field').innerHTML = "";
}

// Show dice roll result
const updateDiceResult = (result_1, result_2) => {
    document.getElementById('interface__dice__result').innerHTML = `${result_1} ;  ${result_2}`;
}

//Remove dice role result
const removeDiceResult = () => {
    document.getElementById('interface__dice__result').innerHTML = ``;
}

//Show buy house button //TO DO change arguments
const updateBuyHouse = (player, field) => {
    if(field.getFieldFamily() === 9 || field.getFieldFamily() === 10){ //if utility or railways
        return;
    }
    let decision = player.decisionBuyHouse(field, 200);
    //worth
    if(decision < 0 && decision > -200){
        document.getElementById(`interface__buy__field`).innerHTML=
        `<button onclick="buyHouse(${player.getPlayerId()},${field.getFieldId()})" class="buyField worth" id="buyField">Buy house
            <div class="support_message">
                Its worth to buy
            </div>
        </button>`
        return;
    }
    //more worth
    if(decision <= -200){
        document.getElementById(`interface__buy__field`).innerHTML=
        `<button onclick="buyHouse(${player.getPlayerId()},${field.getFieldId()})" class="buyField more_worth" id="buyField">Buy house
            <div class="support_message">
                Its very good idea to buy
            </div>
        </button>`
        return;
    }
    //not worth
    if(decision >= 0 && decision < 200){
        document.getElementById(`interface__buy__field`).innerHTML=
        `<button onclick="buyHouse(${player.getPlayerId()},${field.getFieldId()})" class="buyField not_worth" id="buyField">Buy house
            <div class="support_message">
                Its not worth buying
            </div>
        </button>`
        return;
    }
    //Not even close
    if(decision >= 200){
        document.getElementById(`interface__buy__field`).innerHTML=
        `<button onclick="buyHouse(${player.getPlayerId()},${field.getFieldId()})" class="buyField Not_even_close" id="buyField">Buy house
            <div class="support_message">
                Its not really worth buying
            </div>
        </button>`
        return;
    }
    //document.getElementById('interface__buy__field').innerHTML = `
    //<button onclick="buyHouse(${player.getPlayerId()},${field.getFieldId()})" class="buyField" id="buyField">Buy house</button>`
}

const updateCurrentPlayer = (player) => {
    document.getElementById('current__player').innerHTML = `<p class="player-${player.getPlayerId()}">Current player: 
    ${player.getPlayerName()}</p>
    `
}
//Create interface
// in Game.js prepareInterface()
// createinterface();

//Show list of players
const updatePlayerList = (list) => {
    document.getElementById("players__list").innerHTML = ""
    let i = 1;
    let newElements=``;
    PLAYERS.forEach(element => {
        newElements +=`<div class="player_info"><p class="player-${element.getPlayerId()}">${element.getPlayerName()} ${i}: </p><p>${element.getMoney()} $</P>`
        newElements += `<div class='player_info_list'>`
        element.fieldsOwned.forEach(fieldElement => {
            field = FIELDS_LIST[findFieldById(fieldElement)];
            newElements += `
                            <div class='player_info_card'>
                                <div class="player_info_field__wraper" >
                                    <div class="ColoredBox-${field.getFieldFamily()} ColoredBox-player_list" id="ColoredBox-${fieldElement}"></div>
                                    <div class="interface__bankrupcy__text">${field.getFieldTitle()}</div>
                                    <div class="interface__bankrupcy__text">Houses: ${field.getHouseAmmount()}</div>
                                    <div class="interface__bankrupcy__text">$${field.getFieldPropertyValue()}</div>
                                </div>
                            </div>`
        })
        newElements += `</div>`;
        newElements += `</div>`;
        i += 1;
    });
    document.getElementById("players__list").innerHTML+= newElements;

    //interface
    updateFieldinfo();
}

const changeBackGroundColor = (playerId, field) => {
    document.getElementById(`item-${field.getFieldId()}`).style.backgroundColor=player_color[findPlayerById(playerId)]
}


const clearButtons = () => {
    document.getElementById('interface__buy__field').innerHTML = ``;
    removeBuyFieldButton();
    document.getElementById('interface__dice__endTurn').innerHTML = ``;
}

const addHouseToInterface = (fieldId) => {
    document.getElementById(`ColoredBox-${fieldId}`).innerHTML += `<img alt="Prefab House icon" srcset="https://img.icons8.com/ios-filled/512/prefab-house.png 2x" style="width: 20%; height: 20%; filter: invert(0%) sepia(98%) saturate(9%) hue-rotate(325deg) brightness(106%) contrast(101%);">`
}

const removeHouseFromInterface = (fieldId) => {
    const field = FIELDS_LIST[findFieldById(fieldId)];
    let content = document.getElementById(`ColoredBox-${fieldId}`).innerHTML = ``;
    for(let i=0; i<field.getHouseAmmount(); i++) {
        content += `<img alt="Prefab House icon" srcset="https://img.icons8.com/ios-filled/512/prefab-house.png 2x" style="width: 20%; height: 20%; filter: invert(0%) sepia(98%) saturate(9%) hue-rotate(325deg) brightness(106%) contrast(101%);">`
    }
}


const updateFieldinfo = () => {
    for(let i=0; i<40;i++){
        field = FIELDS_LIST[i];
        if(field.getFieldFunction() !== 1){
            continue;
        }
        document.getElementById(`Field_info_${i}`).innerHTML=`
        <div class="Field_info">
                <div class="ColoredBox-${field.Field_country}" style="width:100%; height:20%;"></div>
                <div class="field__name"> ${field.title}</div>
                <div class="Owner"> Owner: ${field.getFieldOwnerId() == "None"? "None": PLAYERS[field.getFieldOwnerId()].getPlayerName()}</div>
                <div class="Houeses"> Houses: ${field.Field_house_ammount}</div>
                <div class="field__price"> Value: ${field.Field_property_value}$</div>
                <div> Rent: ${field.getField_penalty()}$</div>
              </div>
        `;
    }
}