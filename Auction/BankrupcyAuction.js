//zmienne pomocnicze
let bankrupt_player;

//show main panel for selling field
const starBankrupcyAuction = (playeryId) => {
    bankrupt_player = PLAYERS[playeryId];

    let auction = document.getElementById('interface__bankrupcy');
    auction.innerHTML=``;
    auction.innerHTML =`
    <div class="interface__bankrupcy_container">
        <div class="interface__bankrupcy__announce">You are bankrupt</div>
        <div id="interface__bankrupcy__playerName">Player name: ${bankrupt_player.getPlayerName()}</div>
        <div id="interface__bankrupcy__Money">Current ammount of money: $${bankrupt_player.getMoney()}</div>
        <div id="interface__bankrupcy__fields">${addFieldCard2(bankrupt_player).innerHTML}</div>
    </div>
    `;  
    //addFieldCard(bankrupt_player)
}
//Show sell house button in there are more than 1 houses
const showSellHouseButton = (fieldId) => {
    const field = FIELDS_LIST[findFieldById(fieldId)];

    if(field.getHouseAmmount() > 0){
        let buttons = `<button onclick="SellHouse(${fieldId})" id='sell__house__${fieldId}'>Sell house</button>`;
        return buttons;
    }
    return "";
}

//sell house 
const SellHouse = (fieldId) => {
    const field = FIELDS_LIST[findFieldById(fieldId)];
    if(field.getHouseAmmount() > 0){
        //remove house
        field.decreseHouse()
        //get player
        let player = PLAYERS[(field.getFieldOwnerId())];
        //give him money for selling house
        player.addMoney(field.getPriceForHouse());
        if(player.getMoney() > 0){
            prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())]);
        }
    }
    if(field.getHouseAmmount() <= 0){
        document.getElementById(`sell__house__${fieldId}`).remove();
    }
}

//Start auction
//TO DO give money to player after
const SellField = (playerId ,fieldId) =>{
    const player = PLAYERS[playerId];
    const field = FIELDS_LIST[findFieldById(fieldId)];

    //sell houses
    if(field.getHouseAmmount() > 0){
        PLAYERS[playerId].addMoney(field.getPriceForHouse() * field.getHouseAmmount());
        PLAYERS[playerId].Field_house_ammount = 0;
    }
        //sell field
    if(field.getFieldOwnerId() == player.getPlayerId()){
        document.getElementById('interface__bankrupcy').innerHTML = '';
        startAuction(playerId, field);
        //document.getElementById('interface__bankrupcy').style.display = 'block';
    }
}

const goBackToBankrupcyAuction = () =>{
    //end auction
    // if(bankrupt_player.getMoney()<0){
    //     if(bankrupt_player.fieldsOwned.length == 0){
    //         bankrupcy(bankrupt_player);
    //         return;
    //     }
    //     starBankrupcyAuction(playeryId)
    //     return;
    // }
    // return;
}


const addFieldCard2 = (player) =>{
    const newDiv = document.createElement("div");
    newDiv.classList.add("interface__bankrupcy__field__info");
    player.fieldsOwned.forEach(element => {
        field = FIELDS_LIST[findFieldById(element)]
        newDiv.innerHTML += `
        <div class='interface__bankrupcy__field__info'>
            <div class="field__wraper" >
                <div class="ColoredBox-${field.getFieldFamily()}" id="ColoredBox-${element}"></div>
                <div class="interface__bankrupcy__text">${field.getFieldTitle()}</div>
                <div class="interface__bankrupcy__text">Houses: ${field.getHouseAmmount()}</div>
                <div class="interface__bankrupcy__text">$${field.getFieldPropertyValue()}</div>
            </div>
            <div class="interface__bankrupcy__Buttons" id="interface__bankrupcy__Buttons${element}">
                <button onclick="SellField(${player.id},${element})" id="sell__field__${element}">Sell property</button>
                ${showSellHouseButton(element)}
            </div>
        </div>
        `
    });

    return newDiv;
}