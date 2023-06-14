let CHEST_CARDS;

//to do update player position after moving
//to do check field after moving player
//to do lose money after enter other player field

async function CreateChestCards() {
    //Get fields from json
    const response = await fetch('./Community_chest/Community_chest.json');
    const Cards = await response.json();
    //Get fields to global list for later
    CHEST_CARDS = Cards
}

CreateChestCards();

const getRandomChestCard = () => {
    const position = Math.floor(Math.random() * (14 - 0) + 0)
    console.log("random card: ",position)
    return CHEST_CARDS[position];
}

const chestCard = (playerId) => {
    const card = getRandomChestCard();
    console.log("chest: ",card.function)
    switch (card.function) {
        case 0:
            chest_0(playerId);
            break;
        case 1:
            chest_1(playerId);
            break;
        case 2:
            chest_2(playerId);
            break;
        case 3:
            chest_3(playerId);
            break;
        case 4:
            chest_4(playerId);
            break;
        case 5:
            chest_5(playerId);
            break;
        case 6:
            chest_6(playerId);
            break;
        case 7:
            chest_7(playerId);
            break;
        case 8:
            chest_8(playerId);
            break;
        case 9:
            chest_9(playerId);
            break;
        case 10:
            chest_10(playerId);
            break;
        case 11:
            chest_11(playerId);
            break;
        case 12:
            chest_12(playerId);
            break;
        case 13:
            chest_13(playerId);
            break;
        case 14:
            chest_14(playerId);
            break;
        default:
            alert("something went wrong chance switch", card.function)
    }
    communityChestHistory(playerId, card.description+" "+card.content)
}

//ADVANCE TO GO
const chest_0 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].sendPlayerToGo();
}

//YOU INHERIT 100$
const chest_1 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(100)
}

//COLLECT 50$ FROM EVERY PLAYER
const chest_2 = (playerId) => {
    PLAYERS.forEach(element => {
        if (element.getPlayerId() != playerId) {
            element.payMoney(50)
            PLAYERS[findPlayerById(playerId)].addMoney(50)
        }
    })
}

//GO TO JAIL
const chest_3 = (playerId) => { 
    PLAYERS[findPlayerById(playerId)].sendPlayerTo(10);
    PLAYERS[findPlayerById(playerId)].decreseMove();
}

//GET OUT OF JAIL FREE
const chest_4 = (playerId) => {
    PLAYERS[findPlayerById(playerId)].addOutOfJailCard()
}
//SECOND PRIZE IN A BEAUTY CONTEST COLLECT 30$
const chest_5 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(30)
}
//COLLECT 100$
const chest_6 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(100)
}
//FROM SALE OF STOCK YOU GET 45$
const chest_7 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(45)
}
//PAY 100$
const chest_8 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].payMoney(100)
}
//COLLECT 20$
const chest_9 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(45)
}
//PAY 50$
const chest_10 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].payMoney(50)
}
//COLLECT 200$
const chest_11 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(200)
}
//COLLECT 100$
const chest_12 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].addMoney(100)
}
//PAY 150$
const chest_13 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].payMoney(150)
}
//PAY 40$ FOR HOUSE
const chest_14 = (playerId) => {  
    PLAYERS[findPlayerById(playerId)].fieldsOwned.forEach(element => {
        const moneyToPay = FIELDS_LIST[findFieldById(element)].getHouseAmmount * 40
        console.log("paid for houses: ",moneyToPay)
        PLAYERS[findPlayerById(playerId)].payMoney(moneyToPay)
    })
}