//TO DO when ai starts aucion it blows up
let PASS = []
let CURRENT_BIDER;
let highest_bider = "None";
let highest_bid = 0;
let auction_field;
//Auction display //interface__auction
const startAuction = (playerId, field) => {
    let auction = document.getElementById('interface__auction')
    auction_field = field;
    highest_bider = "None";

    highest_bid = Math.floor(field.getFieldPropertyValue()/2)
    PASS.push(playerId)

    const auctionGrid = document.createElement("div");
    auctionGrid.classList.add("auction");
    auctionGrid.innerHTML = `
    <div id='auction__field__info'>
        <p>Propety name: ${field.title}</p>
        <p>Property value: ${field.getFieldPropertyValue()}</p>
    </div>
    <div id='highest_bid'>${highest_bid}$</div>
    `

    const playerInfo = document.createElement("div");
    playerInfo.classList.add("player__info");

    for (let i = 0; i < PLAYERS.length; i++){
            playerInfo.innerHTML += `
            <div class="auction__player__info" id='player__info__${i}'>
                <p class="player__name__${i}">Player name: ${PLAYERS[i].getPlayerName()}</p>
                <p id="player__info__${i}__money">Player money: ${PLAYERS[i].getMoney()}$</p>            
            </div>
            `
    }

    const playerButtons = document.createElement("div");
    playerButtons.classList.add("player__buttons");

    for (let i = 0; i < PLAYERS.length; i++){
        if (PLAYERS[i].getPlayerId() != playerId) {
            playerInfo.innerHTML += `
            <div id='player__buttons__${i}'></div>
            `
        }
    }

    auctionGrid.appendChild(playerInfo);
    auctionGrid.appendChild(playerButtons);

    auction.appendChild(auctionGrid);

    firstBid(playerId)
}

//Display bid button
const bidButton = () => {
    document.getElementById(`player__buttons__${findPlayerById(CURRENT_BIDER)}`).innerHTML+=`<button onclick="bid()">bid</button>`
}
//Display pass button
const passButton = () => {
    document.getElementById(`player__buttons__${findPlayerById(CURRENT_BIDER)}`).innerHTML+=`<button onclick="pass()">pass</button>`
}
//remove buttons
const removeBidPassButtons = () => {
    document.getElementById(`player__buttons__${findPlayerById(CURRENT_BIDER)}`).innerHTML=``
}

//chose first bider
const firstBid = (playerId) => {
    if (playerId != PLAYERS[0].getPlayerId()) {
        CURRENT_BIDER = PLAYERS[0].getPlayerId()
        if (PLAYERS[findPlayerById(CURRENT_BIDER)].Type == "AI") {
            PLAYERS[findPlayerById(CURRENT_BIDER)].auctionAI(auction_field, highest_bid)
        } else {
            bidButton()
            passButton()
        }
        
    } else {
        CURRENT_BIDER = PLAYERS[1].getPlayerId()
        if (PLAYERS[findPlayerById(CURRENT_BIDER)].Type == "AI") {
            PLAYERS[findPlayerById(CURRENT_BIDER)].auctionAI(auction_field, highest_bid)
        } else {
            bidButton()
            passButton()
        }
    }

}

//After bid button is clicked
//Add +5 to highest value 
const bid = () => {
    console.log("BID")
    if (PLAYERS[findPlayerById(CURRENT_BIDER)].getMoney() < (highest_bid + 5)) {
        //printInHistory("not enought money (bid)")
        pass();
        return;
    }
    highest_bid += 5;
    highest_bider = CURRENT_BIDER;
    updateHighestBid();
    removeBidPassButtons();
    nextBider()
}
//Add to pass array and go to next player
const pass = () => {
    PASS.push(CURRENT_BIDER)
    console.log("PASS!")
    removeBidPassButtons()
    nextBider()
}

const nextBider = () => {
    console.log("NEXT-BIDER ", highest_bider, "-_-", PASS)
    //End auction if all playes passed and nobody wanted field
    if ((PASS.length) == PLAYERS.length && highest_bider == "None") {
        //end aution
        //clear interface and reset values
        document.getElementById('interface__auction').innerHTML = ``;
        PASS = [];
        //highest_bider = "None";
        //Show in history who won auction
        printInHistory("Nobody bought field in auction")

        //prepare for next player to move
        prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER)])
        return;
    }

    //End auction if N-1 players passed and someone bided for field
    if ((PASS.length + 1) == PLAYERS.length && highest_bider != "None") {
        //END AUCTION
        //If buyer doesnt have enought money in case nobody has money 
        if (PLAYERS[findPlayerById(highest_bider)].getMoney() < highest_bid) {
            document.getElementById('interface__auction').innerHTML = ``;
            PASS = [];
            //highest_bider = "None";
            return
        }
        //buy field
        buyField(highest_bider, auction_field.getFieldId(), highest_bid)
        
        //clear interface and reset values
        document.getElementById('interface__auction').innerHTML = ``;
        PASS = [];

        //Show in history who won auction
        endAuctionHistory(highest_bider, highest_bid)

        //prepare for next player to move
        prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER)])
        //highest_bider = "None";
        return;
    }

    //Find next bider
    while ((PASS.length) != PLAYERS.length) {
        //console.log("CURRE:",CURRENT_BIDER)
        CURRENT_BIDER = PLAYERS[findNextPlayer(CURRENT_BIDER)].getPlayerId()
        //console.log("CURRE2:",CURRENT_BIDER)
        if (!(PASS.includes(CURRENT_BIDER))) {
            //If player isnt in pass array
            console.log("break")
            break;
        }
    }

    console.log("next bider:",PLAYERS[findPlayerById(CURRENT_BIDER)])
    //CURRENT_BIDER = findNextPlayer(CURRENT_BIDER)
    if (PLAYERS[findPlayerById(CURRENT_BIDER)].Type == "AI" && !(PASS.includes(CURRENT_BIDER))) {
        PLAYERS[findPlayerById(CURRENT_BIDER)].auctionAI(auction_field ,highest_bid)
    } else {
        bidButton()
        passButton()
    }
    
}

const updateHighestBid = () => {
    const bid = document.getElementById(`highest_bid`);
    bid.innerHTML = `${highest_bid}$`
    bid.style.backgroundColor = player_color[findPlayerById(highest_bider)];
}