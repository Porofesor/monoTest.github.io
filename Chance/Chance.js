let CHANCE_CARDS;
//to do update player position after moving
//to do check field after moving player
//to do lose money after enter other player field
async function CreateChanceCards() {
    //Get fields from json
    const response = await fetch('./Chance/Chance.json');
    const Cards = await response.json();
    //Get fields to global list for later
    CHANCE_CARDS = Cards
}
CreateChanceCards();
const getRandomChanceCard = () => {
    const position = Math.floor(Math.random() * (13 - 0) + 0)
    console.log("random card: ",position)
    return CHANCE_CARDS[position];
}

const chanceCard = (playerId) => {
    const card = getRandomChanceCard();
    console.log("chance: ",card.function)
    switch (card.function) {
        case 0:
            chance_0(playerId)
            break;
        case 1:
            chance_1(playerId)
            break;
        case 2:
            chance_2(playerId)
            break;
        case 3:
            chance_3(playerId)
            break;
        case 4:
            chance_4(playerId)
            break;
        case 5:
            chance_5(playerId)
            break;
        case 6:
            chance_6(playerId)
            break;
        case 7:
            chance_7(playerId)
            break;
        case 8:
            chance_8(playerId)
            break;
        case 9:
            chance_9(playerId)
            break;
        case 10:
            chance_10(playerId)
            break;
        case 11:
            chance_11(playerId)
            break;
        case 12:
            chance_12(playerId)
            break;
        case 13:
            chance_13(playerId)
            break;
        default:
            alert("something went wrong chance switch",card.function)
    }
    chanceHistory(playerId, card.content)

}

//When to just change position and when go thru the board

//PAY EACH PLAYER 50$
const chance_0 = (playerId) => {
    PLAYERS.forEach(element => {
        if (element.getPlayerId() != playerId) {
            element.addMoney(50)
            PLAYERS[findPlayerById(playerId)].payMoney(50)
        }
    })
}
//GET OUT OF JAIL FREE
const chance_1 = (playerId) => {
    PLAYERS[findPlayerById(playerId)].addOutOfJailCard()
}

//PAY POOR TAX OF 15$
const chance_2 = (playerId) => {
    PLAYERS[findPlayerById(playerId)].payMoney(15)
}

//ADVANCE TO GO
const chance_3 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerToGo() 
}

//TO DO Does this work????
//GO BACK 3 SPACES 
const chance_4 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(PLAYERS[findPlayerById(playerId)].currentPositionId - 3)
    checkField(PLAYERS[findPlayerById(playerId)]);
}

//to the nearest railroad
//TO DO This is a bit cheating
const chance_5 = (playerId) => { 
    const position = PLAYERS[findPlayerById(playerId)].getCurrentPositionId()
    switch (position) {
        case 7:
            PLAYERS[findPlayerById(playerId)].sendPlayerTo(5)
            checkField(PLAYERS[findPlayerById(playerId)]);
            break;
        case 22:
            PLAYERS[findPlayerById(playerId)].sendPlayerTo(25)
            checkField(PLAYERS[findPlayerById(playerId)]);
            break;
        case 36:
            PLAYERS[findPlayerById(playerId)].sendPlayerTo(35)
            checkField(PLAYERS[findPlayerById(playerId)]);
            break;
        default:
            alert("Chance card something went wrong")
    }
        
}

//GO TO JAIL
const chance_6 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(10);
    PLAYERS[findPlayerById(playerId)].decreseMove();
}

//YOU ARE LUCKY, COLLECT 150$
const chance_7 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].addMoney(150)
}

//BANK PAYS YOU 50$
const chance_8 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].addMoney(50)
}

//Go on a parking
const chance_9 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(20)
    checkField(PLAYERS[findPlayerById(playerId)]);
}

//ADVANCE TO Madrit
const chance_10 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(14)
    checkField(PLAYERS[findPlayerById(playerId)]);
}

//ADVANCE TOKEN TO NEAREST UTILITY
const chance_11 = (playerId) => { 
    const position = PLAYERS[findPlayerById(playerId)].getCurrentPositionId()

    if (Math.abs(position - 28) > Math.abs(position) - 12) {
        const newPosition = Math.abs(52 - PLAYERS[findPlayerById(playerId)].getCurrentPositionId())
        PLAYERS[findPlayerById(playerId)].updatePlayerPosition(newPosition)
        checkField(PLAYERS[findPlayerById(playerId)]);
    } else {
        const newPosition = Math.abs(68 - PLAYERS[findPlayerById(playerId)].getCurrentPositionId())
        PLAYERS[findPlayerById(playerId)].updatePlayerPosition(newPosition)
        checkField(PLAYERS[findPlayerById(playerId)]);
    }

}

//ADVANCE TO Frankfurt
const chance_12 = (playerId) => {
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(31)
    checkField(PLAYERS[findPlayerById(playerId)]);
}

//FOR EACH HOUSE PAY 25$ FOR EACH HOTEL 100$
const chance_13 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].fieldsOwned.forEach(element => {
        const moneyToPay = FIELDS_LIST[findFieldById(element)].getHouseAmmount * 25
        console.log("paid for houses: ",moneyToPay)
        PLAYERS[findPlayerById(playerId)].payMoney(moneyToPay)
    })
}