//TO DO !!! ADD CURRENT PLAYER and change other functions!!!
let CURRENT_PLAYER;
let PLAYERS = []  //players list
let IsGameGoing = true;
let FIELDS_LIST = []; // list of fields
//TO DO kary za domki
//czy ma to być lista wszystkich pól czy tylko tych do kupienia?
const createFildList = () => {
    FIELDSLIST_JSON.forEach(element => {
        //List of filed that can be entered by player
        if (element.id <= 39)
        FIELDS_LIST.push(new Field(element))
    })
}

//Create players from list
const createPlayers = () => {
    let i = 1;
    PLAYERLIST.forEach(element => {
        if (element.Type == "AI") {
            const p = new AI(element.Name, element.Type, i)
            PLAYERS.push(p)
            //console.log("create ai",p)
        } else {
            const p = new Player(element.Name, element.Type, i)
            PLAYERS.push(p)
            //console.log("create player",p)
        }
        i = i + 1;
    })
}

//TO DO change few things
const startGame = () => {
    //Create Players //Game
    createPlayers();
    createFildList();
    //Place them on "go" / start
    PLAYERS.forEach(element => {
        element.placeOnStart()
    })
    createinterface();
    //Create interface for player 1 //Interface

    //setTimeout(() => { console.log("World!"); }, 5000);
    
    //TO DO make it invoke after every turn 
    updatePlayerList(PLAYERS);
    //sleep(3000);
    if (PLAYERS[0].Type == "AI") {
        PLAYERS[0].startTurn()
        return;
    }

    prepareInterface(PLAYERS[0])
    
}


//Prepare interface for next player
const prepareNextPlayer = (player) => {
    if (player.Type == "AI") {
        clearButtons();
        player.startTurn()
        return;
    }
    updatePlayerList(PLAYERS)
    prepareInterface(player)
}

//Not used
const playerTurn = (player) => {
    //TO DO 
    if (player.moves < 1) return;
}

//Prepares interface for player
// TO DO fix 
const prepareInterface = (player) => {
    //Interface
    CURRENT_PLAYER = player.getPlayerId();
    removeBuyFieldButton();
    updateCurrentPlayer(player);
    updateDiceButton(player);
}

//TO DO check if cheat works
const roll_dice = (playerId) => {
    //cheat
    // console.log("ID;",playerId)
    // console.log("id-",findPlayerById(playerId))
    let player = PLAYERS[findPlayerById(playerId)]
    // let dice1 = Math.floor(Math.random() * 6);
    // let dice2 = Math.floor(Math.random() * 6);
    let dice1 = (Math.random() * 6)+1;
    let dice2 = (Math.random() * 6)+1;
    //console.log("original dice roles ", dice1, " ", dice2)

    dice1 = Math.floor(dice1)
    dice2 = Math.floor(dice2)
    //console.log("after round dice roles ", dice1, " ", dice2)

    //If double add one more move or take one //Player
    // console.log(player)
    if (dice1 != dice2) player.decreseMove();
    // if (dice1 == dice2) player.addMove();
    // else player.decreseMove();

    //Interface
    //updateDiceResult(dice1, dice2);

    //Player // change position on board and check if passed "go"
    player.updatePlayerPosition(dice1 + dice2)
    
    //Show dice rolle in history
    //diceRolleHistory(playerId, dice1, dice2);
    
    //Check if
    checkField(player)

    //Does player can roll dice again?
    checkTurns(player)

    PLAYERS[findPlayerById(playerId)] = player;
}

const firstTurn = () => {
    startGame();
}

//After you enter field, check everything
const checkField = (player) => {
    let Field = FIELDS_LIST[(player.getCurrentPositionId())];
    //console.log(Field)
    //console.log(player)
    //if Nobody owns it and can be bought // 1 = can be bought, 0 = can't be bought
    if (Field.getFieldOwnerId() == "None" && Field.getFieldFunction() == 1) {
        //console.log("1")
        buyFieldButton(player.getPlayerId(), Field.getFieldId())
    }
    //if someone else own it
    if (Field.getFieldOwnerId() != "None" && Field.getFieldOwnerId() != player.getPlayerId() && Field.getFieldFunction()==1) {
        //console.log("2")
        penalty(player, Field);
    }
    //if current player owns it
    if (Field.getFieldOwnerId() === player.getPlayerId()) {
        //Buy house //interface
        //Might not work properly
        //console.log("3")
        if(checkFieldFamily(player.getPlayerId(), Field.getFieldId())){
            updateBuyHouse(player, Field)
        }
    }
    //if its jail 
    //TO DO change out_of_jail to USE_OUT_OF_JAIL_CARD
    if (Field.getFieldFunction() == "Jail") {
        //console.log("4")
        if (player.OutofJail > 0) {
            player.OutofJail -= 1;
        } else {
            player.sendPlayerTo(10);
            player.decreseMove();
            player.decreseMove();
        }
        //Test if after going to jail fields swaps
        return;
    }
    //if its chance
    if (Field.getFieldFunction() == "Chance") {
        //Chance.js
        chanceCard(player.getPlayerId())
        //console.log("5")
        //Test if after going to jail fields swaps
        return;
    }
    //if Community chest
    if (Field.getFieldFunction() == "Chest") {
        //Chance.js
        chestCard(player.getPlayerId())
        //console.log("6")
        //Test if after going to jail fields swaps
        return;
    }
    //if its parking / tax
    if (Field.getFieldFunction() == "Tax") {
        player.payMoney(200)
        taxIncomeHistory(player)
    }
    console.log("7")
    FIELDS_LIST[(player.getCurrentPositionId())] = Field;
    //if 
}

//TO DO TEST
const penalty = (player, field) => {
    //Take money out of player
    player.payMoney(field.getField_penalty())
    //Find player position in list
    const p = findPlayerById(field.getFieldOwnerId());
    //Give owner money
    PLAYERS[p].addMoney(field.getField_penalty())
}

//Returns player position in PLAYERLIST using id
const findPlayerById = (id) => {
    //console.log("findPlayerByID = ", id)
    for (let i = 0; i < PLAYERS.length; i++) {
        if (PLAYERS[i].getPlayerId() == id) {
            //console.log("player (id) position is: ",i)
            return i;
        }
    }
    //alert("player  id not found with id ", id)
    return i
}

//Find field by id 
const findFieldById = (id) => {
    //console.log("findFieldById:", id)
    //console.log(FIELDS_LIST);
    for (let i = 0; i < FIELDS_LIST.length; i++) {
        if (FIELDS_LIST[i].getFieldId() == id) {
            console.log("find field by id: ", i)
            return i;
        }
    }
    //alert("field id not found")
    return i
}

//TO DO finish function, add info for player
//TO DO update ammount on houses on board (interface)
//TO DO playerId fieldID
//TO error z find fieldID
const buyHouse = (playerId, fieldId) => {
    let player = PLAYERS[findPlayerById(playerId)];
    let field = FIELDS_LIST[findFieldById(fieldId)];

    //if nobody owns id (just in case)
    if (field.getFieldOwnerId() == "None") {
        //console.log("Nobody owns field");
        return;
    }
    //if someone else owns it (just in case)
    if (field.getFieldOwnerId() != player.getPlayerId()) {
        //console.log("Someone else owns field");
        return;
    }
    //check if player has all fields from family
    if(!player.fieldsOwned.includes(field_family.get(field.getFieldFamily()))){
        //console.log("Player has not all fields from family");
        return;
    }

    //Not enough money
    if (player.getMoney() < field.getFieldPropertyValue()) {
        //console.log("Not enought money");
        return;
    }

    if (field.getHouseAmmount() >= 8) {
        //console.log("Max ammount of houses")
        return
    }
    //Buy house
    //Take money from player
    player.payMoney(field.getPriceForHouse())

    //show in interface
    //buyHouseHistory(playerId, fieldId)

    //Interface update player list info
    //updatePlayerList(PLAYERS)
    //Add house
    field.addHouse()

    PLAYERS[findPlayerById(playerId)] = player;
    FIELDS_LIST[findFieldById(fieldId)] = field;
    
    //console.log("House was added", field.getHouseAmmount())
}

//TO DO bid the field
//TEST CHEAT
const checkTurns = (player) => {
    //did player bought field? then bid
    //FIELDS_LIST(player.getCurrentPositionId());
    //does he have one more turn?
    if (player.getMoves() >= 1) {
        //interface //show end turn button
        updateDiceButton(player);
        return
    }
    //next turn
    if (player.getMoves() <= 0) {
        //interface //show end turn button
        endTurnButton(player);
        return
    }
}

//Returns position of next player in list (PLAYERS)
const findNextPlayer = (playerId) => {
    for (let i = 0; i < (PLAYERS.length - 1); i++){
        if (playerId === PLAYERS[i].getPlayerId()) {
            return i+1;
        }
    }
    return 0;
}


//What happens after you press end turn button
//TO DO change to async function to pause generatin new buttons
const endTurn = (playerId) => {
    PLAYERS[findPlayerById(playerId)].addMove()

    //If field wasnt bought star auction
    //TO DO finish startAuction
    // console.log("KONIEC TURY ", playerId)
    const playerPosition = PLAYERS[findPlayerById(CURRENT_PLAYER)].getCurrentPositionId()
    // console.log("player position (endturn)",playerPosition)
    const field = FIELDS_LIST[findFieldById(playerPosition)]
    // console.log(playerPosition, " --_--", field)
    // console.log("koniec tury field:",field)
    if (field.getFieldOwnerId() == "None") {
        //console.log("LICYTACJA")
        //Show auction in history
        //startAuctionHistory(playerId, field.getFieldId())
        //Start auction
        startAuction(playerId, field)
        return;
    }
    
    //creates intrface for next player //interface
    //CURRENT_PLAYER = playerId;
    if (PLAYERS[findNextPlayer(playerId)].Type == "AI") {
        //console.log("end turn tw:", PLAYERS[findNextPlayer(playerId)])
        //sleep(1000);
        //clearButtons();
        PLAYERS[findNextPlayer(playerId)].startTurn();
        return;
    }
    
    // console.log("PREPARE INTERFACE",PLAYERS[findNextPlayer(CURRENT_PLAYER)])
    prepareInterface(PLAYERS[findNextPlayer(CURRENT_PLAYER)])

    //Interface update player list info
    updatePlayerList(PLAYERS)
}

//buy field button 
//TO DO change alert
//TO DO test cheat
const buyField = (playerId, fieldId , value = 0) => {
    //console.log("buy field ids: ", playerId," ",fieldId)
    //console.log("test cheat, ", PLAYERS[findPlayerById(playerId)])
    let player = PLAYERS[findPlayerById(playerId)];
    let field = FIELDS_LIST[findFieldById(fieldId)];

    if (value == 0) {
        value = field.getFieldPropertyValue();   
    }

    //If not enough money
    if (player.getMoney() < value) {
        //alert("Not enough money")
        return
    }

    //If other player was owner of field
    if(field.getFieldOwnerId() !=   "None"){
        //give player money for his field
        PLAYERS[findPlayerById(findFieldById(fieldId).getFieldOwnerId())].addMoney(values);
        //remove field from list of his fields
        PLAYERS[findPlayerById(findFieldById(fieldId).getFieldOwnerId())].fieldsOwned.filter(item => item !== fieldId)
        //Go back to bankrupcy autcion if it continues 
        goBackToBankrupcyAuction();
    }

    //Make player pay
    player.payMoney(value);
    //Change owner of field
    field.changeOwner(player.getPlayerId());
    //Add to player fields list
    player.addToFieldList(field.getFieldId());
    //Remove button to buy field
    //removeBuyFieldButton()

    //Interface update player list info
    //updatePlayerList(PLAYERS)
    
    //Change background //Interface
    //changeBackGroundColor(playerId, field)

    //show buy house button //TO DO chane arguments
    // if(checkFieldFamily(playerId, fieldId)){
    //     updateBuyHouse(player, field)
    // }

    //Show in history
    buyFieldHistory(playerId, fieldId, value);

    PLAYERS[findPlayerById(playerId)] = player;
    FIELDS_LIST[findFieldById(fieldId)] = field;
    //console.log("test cheat, after ",PLAYERS[findPlayerById(playerId)])

}
//startGame()

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

//Check if player has all fields in family
const checkFieldFamily = (playerId, fieldId) =>{
    let player = PLAYERS[findPlayerById(playerId)];
    let field = FIELDS_LIST[findFieldById(fieldId)];

    if(!player.fieldsOwned.includes(field_family.get(field.getFieldFamily()))){
        console.log("Player has not all fields from family");
        return false;
    }else{
        return true;
    }
}

//TO DO needs to be finished
const countFieldFamily = (playerId, fieldId) =>{
    let player = PLAYERS[findPlayerById(playerId)];
    let field = FIELDS_LIST[findFieldById(fieldId)];

    if(!player.fieldsOwned.includes(field_family.get(field.getFieldFamily()))){
        console.log("Player has not all fields from family");
        return 0;
    }else{
        return 1;
    }
}