//zmienne pomocnicze
let bankrupt_player;

//show main panel for selling field
const starBankrupcyAuction = (playeryId) => {
    bankrupt_player = PLAYERS[findPlayerById(playeryId)];

    let auction = document.getElementById('interface__bankrupcy');
    auction.innerHTML=``;
    auction.innerHTML =`
    <div class="interface__bankrupcy_container">
        <div class="interface__bankrupcy__announce">You are bankrupt</div>
        <div id="interface__bankrupcy__playerName">Player name: ${bankrupt_player.getPlayerName()}</div>
        <div id="interface__bankrupcy__Money">Current money: $${bankrupt_player.getMoney()}</div>
        <div id="interface__bankrupcy__fields">${addFieldCard2(bankrupt_player).innerHTML}</div>
    </div>
    `;  
    //addFieldCard(bankrupt_player)
}

//Show card with field info
// const addFieldCard = (player) =>{
//     let cards = document.getElementById('interface__bankrupcy__fields');
//     cards.innerHTML =``;
//     //element = fieldId
//     console.log("Fields owned: ",player.fieldsOwned)
//     player.fieldsOwned.forEach(element => {
//         field = FIELDS_LIST[findFieldById(element)]
//         cards.innerHTML += `
//         <div class='interface__bankrupcy__field__info'>
//             <div class="Field-Upper-Bottom" >
//                 <div class="ColoredBox-${field.getFieldFamily()}" id="ColoredBox-${element}"></div>
//                 <div class="field__name">${field.getFieldTitle()}</div>
//                 <div id="house_ammount">${field.getHouseAmmount()}</div>
//                 <div class="field__price">$${field.getFieldPropertyValue()}</div>
//             </div>
//             <div id="interface__bankrupcy__Buttons${element}">
//                 <button onclick="SellField(${player.id},${element})" id="sell__field__${element}">Sell field</button>
//             </div>
//         </div>
//         `
//         //Add sell house button
//         showSellHouseButton(element)
//     });
//     console.log("Endof add Field card");
// }

//Show sell house button in there are more than 1 houses
const showSellHouseButton = (fieldId) => {
    const field = FIELDS_LIST[findFieldById(fieldId)];

    if(field.getHouseAmmount() > 0){
        document.getElementById(`interface__bankrupcy__Buttons${element}`);
        buttons.innerHTML += `<button onclick="SellHouse(${fieldId})" id='sell__house__${fieldId}'>Sell house</button>`
    }
}

//sell house 
const SellHouse = (fieldId) => {
    const field = FIELDS_LIST[findFieldById(fieldId)];
    if(field.getHouseAmmount() > 0){
        //remove house
        field.decreseHouse()
        //get player
        let player = PLAYERS[findPlayerById(field.getFieldOwnerId())];
        //give him money for selling house
        player.addMoney(field.getPriceForHouse());
    }
    if(field.getHouseAmmount() <= 0){
        document.getElementById(`sell__house__${fieldId}`).remove();
    }
}

//Start auction
//TO DO give money to player after
const SellField = (playerId ,fieldId) =>{
    const player = PLAYERS[findPlayerById(playerId)];
    const field = FIELDS_LIST[findFieldById(fieldId)];

    //sell houses
    if(field.getHouseAmmount() > 0){
        PLAYERS[findPlayerById(playerId)].addMoney(field.getPriceForHouse() * field.getHouseAmmount());
        PLAYERS[findPlayerById(playerId)].Field_house_ammount = 0;
    }
        //sell field
    if(field.getFieldOwnerId() == player.getPlayerId()){
        document.getElementById('interface__bankrupcy').style.display = 'none';
        startAuction(playerId, field);
        //document.getElementById('interface__bankrupcy').style.display = 'block';
    }
}

const goBackToBankrupcyAuction = () =>{
    //end auction
    if(bankrupt_player.getMoney()<0){
        starBankrupcyAuction(playeryId)
        return;
    }
    return;
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
                <button onclick="SellField(${player.id},${element})" id="sell__field__${element}">Sell field</button>
            </div>
        </div>
        `
    });

    return newDiv;
}