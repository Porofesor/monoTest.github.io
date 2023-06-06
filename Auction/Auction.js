//TO DO when ai starts aucion it blows up
let PASS = []
let CURRENT_BIDER;
let highest_bider = "None";
let highest_bid = 0;
let auction_field;
let FieldOwner = "None";
//Auction display //interface__auction
const startAuction = (playerId, field) => {
    console.log("Auction player id: " + playerId);
    let auction = document.getElementById('interface__auction')
    auction_field = field;
    highest_bider = "None";
    FieldOwner = auction_field.getFieldOwnerId();

    PASS = []
    console.log("field:",field);
    highest_bid = Math.floor(field.getFieldPropertyValue()/2)
    PASS.push(PLAYERS[playerId])

    const auctionGrid = document.createElement("div");
    auctionGrid.classList.add("auction");
    auctionGrid.innerHTML = `
    <div id='auction__field__info' style="flex-direction:row">
        <div>
            <p>Propety name: ${field.title}</p>
            <p>Property value: ${field.getFieldPropertyValue()}</p>
            <p>Owner: ${(field.getFieldOwnerId() != "None" ? PLAYERS[field.getFieldOwnerId()].getPlayerName() : "None")}</p>
        </div>
        <div class="Field-Upper-Bottom" id='item-${field.getFieldId()}' style="width:40%;">
            <div class="ColoredBox-${field.getFieldFamily()}" id="ColoredBox-${field.getFieldId()}" style="width:100%;height:20%;margin:0;"></div>
            <div class="field__name" style="font-size:2vw">${field.getFieldTitle()}</div>
            <div class="Players_box" id='playerbox-${field.getFieldOwnerId()}'></div>
            <div class="field__price" style="font-size:2vw">$${field.getFieldPropertyValue()}</div>
        </div>
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

    if(AiOnly){
        auctionAiOnly();
        return;
    }
    firstBid(playerId)
}

//Display bid button
const bidButton = () => {
    document.getElementById(`player__buttons__${CURRENT_BIDER.getPlayerId()}`).innerHTML+=`<button onclick="bid()">bid</button>`
}
//Display pass button
const passButton = () => {
    document.getElementById(`player__buttons__${CURRENT_BIDER.getPlayerId()}`).innerHTML+=`<button onclick="pass()">pass</button>`
}
//remove buttons
const removeBidPassButtons = () => {
    document.getElementById(`player__buttons__${CURRENT_BIDER.getPlayerId()}`).innerHTML=``
}

//chose first bider
const firstBid = (playerId) => {
    console.log("FIRST BID")
    if (playerId != PLAYERS[0].getPlayerId()) {
        CURRENT_BIDER = PLAYERS[0]
        if (CURRENT_BIDER.Type == "AI") {
            CURRENT_BIDER.auctionAI(auction_field, highest_bid)
        } else {
            console.log("FAILED POINT AND CURRENT_BIDER", CURRENT_BIDER);
            bidButton()
            passButton()
        }
        
    } else {
        CURRENT_BIDER = PLAYERS[1];
        if (CURRENT_BIDER.Type == "AI") {
            CURRENT_BIDER.auctionAI(auction_field, highest_bid)
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
    if (CURRENT_BIDER.getMoney() < (highest_bid + 5)) {
        //printInHistory("not enought money (bid)")
        pass();
        return;
    }
    highest_bid += 5;
    highest_bider = CURRENT_BIDER;
    updateHighestBid();
    if(CURRENT_BIDER.Type != "AI") 
        removeBidPassButtons();
    nextBider()
}
//Add to pass array and go to next player
const pass = () => {
    PASS.push(CURRENT_BIDER)
    console.log("PASS!")
    if(CURRENT_BIDER.Type != "AI") 
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
        //If other player was owner of field
        if(auction_field.getFieldOwnerId() !=   "None"){
            //give player money for his field
            PLAYERS[(fieldId.getFieldOwnerId())].addMoney(auction_field.getFieldPropertyValue()/2);
            //remove field from list of his fields
            PLAYERS[(fieldId.getFieldOwnerId())].fieldsOwned.filter(item => item !== fieldId)   
            //Give field to "bank" 
            auction_field.Field_ownerId = "None";
            //Go back to bankrupcy autcion if it continues
            goBackToBankrupcyAuction();
            return;
        }
        console.log("prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())]) ", (PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())]))
        prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())])
        return;
    }
    console.log("higest bider "+highest_bider)
    //End auction if N-1 players passed and someone bided for field
    if ((PASS.length + 1) == PLAYERS.length && highest_bider != "None") {
        //END AUCTION
        //If buyer doesnt have enought money in case nobody has money 
        if (highest_bider.getMoney() < highest_bid) {
            document.getElementById('interface__auction').innerHTML = ``;
            PASS = [];
            //highest_bider = "None";
            return
        }
        //get previous owner // needed to prevent bug 
        const prevOwner = auction_field.getFieldOwnerId()

        //remove field from list of his fields
        if(auction_field.getFieldOwnerId() !=   "None")
            PLAYERS[auction_field.getFieldOwnerId()].fieldsOwned = PLAYERS[auction_field.getFieldOwnerId()].fieldsOwned.filter(item => item !== auction_field.getFieldId()); 

        //buy field
        buyField(highest_bider.getPlayerId(), auction_field.getFieldId(), highest_bid)
        
        //clear interface and reset values
        document.getElementById('interface__auction').innerHTML = ``;
        PASS = [];

        //Show in history who won auction
        endAuctionHistory(highest_bider.getPlayerId(), highest_bid)

        //prepare for next player to move
        //if owner was "none" //added after bug with selling other player field
        if(prevOwner == "None") {
            console.log("prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())]) ", (PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())]))
            prepareNextPlayer(PLAYERS[findNextPlayer(CURRENT_PLAYER.getPlayerId())])
        }
        //highest_bider = "None";
        return;
    }

    //Find next bider
    while ((PASS.length) != PLAYERS.length) {
        //console.log("CURRE:",CURRENT_BIDER)
        CURRENT_BIDER = findNextBider();
        //console.log("CURRE2:",CURRENT_BIDER)
        if (!(PASS.includes(CURRENT_BIDER))) {
            //If player isnt in pass array
            console.log("break")
            break;
        }
    }

    console.log("next bider:",(CURRENT_BIDER))
    //CURRENT_BIDER = findNextPlayer(CURRENT_BIDER)
    if (CURRENT_BIDER.Type == "AI" && !(PASS.includes(CURRENT_BIDER))) {
        CURRENT_BIDER.auctionAI(auction_field ,highest_bid)
    } else {
        bidButton()
        passButton()
    }
    
}

const updateHighestBid = () => {
    const bid = document.getElementById(`highest_bid`);
    bid.innerHTML = `${highest_bid}$`
    bid.style.backgroundColor = player_color[(highest_bider.getPlayerId())];
}

const endAuction = () => {
    console.log("PASS.length: " , PASS.length , " PLAYERS.length:" , PLAYERS.length ," highest_bider" , highest_bider);
    document.getElementById('interface__auction').innerHTML = ``;
    
    if ( PASS.length == PLAYERS.length && highest_bider == "None") {
        printInHistory("Nobody bought field in auction")
        PASS = [];
        //prepare for next player to move
        //If other player was owner of field
        if(auction_field.getFieldOwnerId() !=   "None"){
            //give player money for his field
            PLAYERS[(auction_field.getFieldOwnerId())].addMoney(auction_field.getFieldPropertyValue()/2);
            //remove field from list of his fields
            PLAYERS[(auction_field.getFieldOwnerId())].fieldsOwned.filter(item => item !== auction_field.getFieldId())   
            //Give field to "bank" 
            auction_field.Field_ownerId = "None";
            //Go back to bankrupcy autcion if it continues
            //goBackToBankrupcyAuction();

            //If prev owner is below 0$ start bankrupcy then auction
            if(PLAYERS[FieldOwner].getMoney() < 0){
                bankrupcy(PLAYERS[FieldOwner]);
            }
            return;
        }
        return;
    }

    //End auction if N-1 players passed and someone bided for field
    if (highest_bider != "None") {
        //END AUCTION
        //If buyer doesnt have enought money in case nobody has money 
        if (highest_bider.getMoney() < highest_bid) {
            //highest_bider = "None";
            printInHistory(`Not enough money!!! ${highest_bider.getMoney()} < ${highest_bid}` );
            PASS = [];
            return
        }
        //get previous owner // needed to prevent bug 
        const prevOwner = auction_field.getFieldOwnerId();

        if(prevOwner != "None") {
            //remove field from list of his fields
            PLAYERS[(auction_field.getFieldOwnerId())].fieldsOwned.filter(item => item !== auction_field.getFieldId())
        }
        //buy field
        buyField(highest_bider.getPlayerId(), auction_field.getFieldId(), highest_bid)
        
        //If prev owner is below 0$ start bankrupcy then auction
        if(prevOwner != "None") {
            if(PLAYERS[FieldOwner].getMoney() < 0){ 
                bankrupcy(PLAYERS[FieldOwner]);
            }
        }
        //clear interface and reset values

        //Show in history who won auction
        endAuctionHistory(highest_bider.getPlayerId(), highest_bid)
        PASS = [];
        //highest_bider = "None";
        return;
    }
    if(PASS.length == PLAYERS.length && highest_bider == "None"){
        PASS = [];
        printInHistory("Nobody bought this field in auction");
        return;
    }
    printInHistory(`PASS.length: " , ${PASS.length} , " PLAYERS.length:" , ${PLAYERS.length} ," highest_bider" , ${highest_bider} `)
    PASS = [];
}

const auctionAiOnly = (playerId) => {
    if (playerId != PLAYERS[0].getPlayerId())
        CURRENT_BIDER = PLAYERS[0]
    else 
        CURRENT_BIDER = PLAYERS[1]

    //Ether all players resign or there is one left that bided
    while (PASS.length != PLAYERS.length){
        const decision = CURRENT_BIDER.decisionBuyField(auction_field, highest_bid);
        if (decision === 1){
            if (CURRENT_BIDER.getMoney() < (highest_bid + 5)) {
                PASS.push(CURRENT_BIDER)
            }else{
                highest_bid += 5;
                highest_bider = CURRENT_BIDER;
                updateHighestBid();
            } 
        }
        else{
            PASS.push(CURRENT_BIDER)
        }
        //Find next player for biding
        CURRENT_BIDER = findNextBider()

        if(PASS.length == PLAYERS.length && highest_bider == "None"){
            console.log("BREAK 1");
            break;
        } 
        if((PASS.length + 1) == PLAYERS.length && highest_bider != "None"){
            console.log("BREAK 2");
            break;
        }  
    }
    endAuction();
}

const findNextBider = () => {
    let next_bider = CURRENT_BIDER;
    console.log("findNextBider : ", CURRENT_BIDER );
    while (PASS.length != PLAYERS.length){

        next_bider = PLAYERS[findNextPlayer(next_bider.getPlayerId())];
        console.log("findNextBider__ : ", next_bider );
        if (!PASS.includes(next_bider)) return  next_bider;
    }
    return CURRENT_BIDER;
}