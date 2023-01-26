//rankedField =array with rnked fields
//rankFields = function that ranks fields

class AI {
    rankedField = []
    constructor(Name, Type, id, money = 1000) {
        this.Name = Name;
        this.Type = Type;
        this.id = id;
        this.money = money;
        this.currentPositionId = 0;
        this.moves = 1;
        this.fieldsOwned = []
        this.OutofJail = 0;
        //Test
        for (let i = 0; i < 40; i++) {
            this.rankedField.push(i);
        }
        this.simulateMoves(1000);
    }

    simulateMoves(ammountOfThrows) {
        let fildsEntered = new Array(40).fill(0);
        let current = 0
        let newPosition;
        for (let i = 0; i < ammountOfThrows; i++) {
            newPosition = (this.diceResult() + current) % 40
            if (newPosition == 30) {
                //Go to jail
                fildsEntered[newPosition] += 1;
                fildsEntered[10] += 1;
                newPosition = 10;
                continue;
            }
            fildsEntered[newPosition] += 1;
            current = newPosition;
        }
        console.log("ammount of entered field (simulation):", fildsEntered)
        console.log("rankedFields:---", this.rankedField)
        this.rankFields(fildsEntered)
    }

    diceResult() {
        let dice1 = Math.floor((Math.random() * 6) + 1);
        let dice2 = Math.floor((Math.random() * 6) + 1);
        return (dice1 + dice2);
    }

    sumArray(arr) {
        let sum = 0;
        arr.forEach(item => {
            sum += item;
        });
        return sum;
    }

    convertArray(arr) {
        let newArr = arr;
        sum = this.sumArray(arr);
        for (let i = 0; i < arr.length; i++) {
            newArr[i] = arr[i] / sum;
        }
    }

    //buble sort
    rankFields(arr) {
        let n = 40;
        // let i, j;
        // let swapped;
        // for (i = 0; i < n - 1; i++) {
        //     swapped = false;
        //     for (j = 0; j < n - i - 1; j++) {
        //         if (arr[j] < arr[j + 1]) {
        //             //console.log("before",this.rankedField[j], "__", this.rankedField[j + 1]);
        //             let tmp = this.rankedField[j]
        //             this.rankedField[j] = this.rankedField[j + 1];
        //             this.rankedField[j + 1] = tmp;

        //             let tmp2 = arr[j]
        //             arr[j] = arr[j + 1];
        //             arr[j + 1] = tmp2;
        //             //console.log("after",this.rankedField[j], "__", this.rankedField[j + 1]);
        //         }
        //     }
        //     if (swapped == false)
        //         break;
        // }
        let len = arr.length;
        this.rankedField.sort(function (a, b) { return arr[a] < arr[b] ? -1 : arr[a] > arr[b] ? 1 : 0; });
        console.log("rankedFields after:", this.rankedField)
    }

    swap(xp, yp) {
        return { yp, xp };
    }

    diceRole() {
        //Dice result
        let dice1 = Math.floor((Math.random() * 6) + 1);
        let dice2 = Math.floor((Math.random() * 6) + 1);
        console.log("AI throws ", dice1, " ", dice2);

        //If double
        if (dice1 != dice2) this.decreseMove();

        //Calc new position
        let newPosition = ((dice1 + dice2) + this.currentPositionId) % 39
   
        //Was "go" crossed
        if (this.currentPositionId >= newPosition || newPosition == 0) this.addMoney(200);
        
        //Assign new position
        this.currentPositionId = newPosition;

        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${newPosition}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    
        //Interface //show dice role result
        updateDiceResult(dice1, dice2);

        //Show dice rolle in history
        diceRolleHistory(this.id, dice1, dice2);
    }

    checkField = () => {
        let Field = FIELDS_LIST[(this.getCurrentPositionId())];
        //if Nobody owns it and can be bought // 1 = can be bought, 0 = can't be bought
        if (Field.getFieldOwnerId() == "None" && Field.getFieldFunction() == 1) {
            console.log("1")
            if (this.decisionBuyField(Field, Field.getFieldPropertyValue())) {
                //Buy field
                console.log("field bought")
                buyField(this.id, Field.getFieldId())
            } else {
                console.log("field wasnt bought");
            }
        }
        //if someone else own it
        if (Field.getFieldOwnerId() != "None" && Field.getFieldOwnerId() != this.id && Field.getFieldFunction() == 1) {
            console.log("2")
            penalty(this, Field);
        }
        //if current player owns it
        if (Field.getFieldOwnerId() === this.id) {
            //Buy house //interface
            //Might not work properly
            console.log("3")
            this.BuyHouse(Field);
        }
        //if its jail 
        //TO DO change out_of_jail to USE_OUT_OF_JAIL_CARD
        if (Field.getFieldFunction() == "Jail") {
            console.log("4")
            if (this.OutofJail > 0) {
                this.OutofJail -= 1;
            } else {
                this.sendPlayerTo(10);
                this.decreseMove();
                this.decreseMove();
            }
            //Test if after going to jail fields swaps
            return;
        }
        //if its chance
        if (Field.getFieldFunction() == "Chance") {
            //Chance.js
            chanceCard(this.id)
            console.log("5")
            //Test if after going to jail fields swaps
            return;
        }
        //if Community chest
        if (Field.getFieldFunction() == "Chest") {
            //Chance.js
            chestCard(this.id)
            console.log("6")
            //Test if after going to jail fields swaps
            return;
        }
        //if its parking / tax
        if (Field.getFieldFunction() == "Tax") {
            this.payMoney(200)
        }
        console.log("7")
        FIELDS_LIST[(this.getCurrentPositionId())] = Field;
        //if 
    }
    
    //???? field.getFieldPropertyValue()
    //TO DO Finish it
    decisionBuyField(field, prop_val = field.getFieldPropertyValue()) {
        if (this.money < prop_val) {
            return 0
        }
        let prop_rank = this.rankedField[field.getFieldId()];
        let current_money = this.money;
    
        const w1 = 0.2;
        const w2 = 0.6;
        const w3 = 0.5;
        const w4 = 0.1;

        const nw1 = 0.9;
        const nw2 = (prop_rank / 40) + w2;
    
        const r1 = ((current_money - prop_val) * w1);
        const r2 = r1 * nw2;

        const rn1 = (current_money - prop_val) * nw1;
        const rn2 = -((current_money - prop_val))
    
        console.log("buy field decision=", (r1 + r2), ">", (rn1 + rn2));
        //TO DO >    ->  <
        if ((r1 + r2) > (rn1 + rn2)) {
            //BUY
            return 1;
        } else {
            //DON'T BUY
            return 0;
        }
    }

    //TO DO finish this
    decisionSellField(field, prop_val = field.getFieldPropertyValue()) {
        let prop_rank = this.rankedField[field.getFieldId()];
        let current_money = field.getFieldPropertyValue() * 2;
        
        const w1 = 0.4;
        const w2 = 0.6;
        const w3 = 0.5;
        const w4 = 0.1;

        const nw1 = countFieldFamily(this.id, field.getFieldId());
        const nw2 = (prop_rank / 40) + w2;
    
        const r1 = ((current_money - prop_val) * w1);
        const r2 = r1 * nw2;

        const rn1 = (current_money - prop_val) * nw1;
        const rn2 = -((current_money - prop_val))
    
        console.log("sell field decision=", (r1 + r2), "-", (rn1 + rn2));
        //TO DO >    ->  <
        return (r1 + r2) - (rn1 + rn2);
    }

    //decision to buy a house
    //check if you CAN buy house in field
    BuyHouse(field) {
        let i = 1;
        while (this.money > field.getPriceForHouse()) {
            if (field.getPriceForHouse() * i < (this.money / 2)) {
                i += 1;
                buyHouse(this.id, field.getFieldId());
            } else {
                return;
            }
        }
    }

    startTurn() {
        CURRENT_PLAYER = this.getPlayerId();
        //role dice and change potision on board
        while (this.moves > 0) {
            this.diceRole()
            this.checkField();
        }
        //game
        endTurn(this.id)
    }

    addMoney(ammount) {
        this.money += ammount;
    }

    payMoney(ammount) {
        this.money -= ammount;
        if (this.money < 0) {
            bankrupcy(this);
        }
    }

    decreseMove(ammount = 1) {
        this.moves -= ammount;
    }

    addMove() {
        this.moves += 1;
    }
    sendPlayerTo(positionId) {
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${positionId}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    
        //Update position
        this.currentPositionId = positionId;
    }

    //TO DO does it work?
    auctionAI(field, highest_bid) {
        console.log("AI - auction :", this.id)
        const decision = this.decisionBuyField(field, highest_bid);
        if (decision == 1) {
            bid();
        } else {
            pass();
        }
    }
    //Used at begining of match to place player on "go"
    placeOnStart() {
        this.currentPositionId = 0;
        document.getElementById(`playerbox-0`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    }

    getMoves() {
        return this.moves
    }
    getCurrentPositionId() {
        return this.currentPositionId;
    }
    getPlayerId() {
        return this.id;
    }
    getPlayerName() {
        return this.Name
    }
    getMoney() {
        return this.money;
    }
    getOutOfJail() {
        return this.OutOfJail;
    }
    addField(fieldId) {
        this.fieldsOwned.push(fieldId)
    }
    addToFieldList(fieldId) {
        this.fieldsOwned.push(fieldId)
    }
    addOutOfJailCard() {
        this.OutofJail += 1;
    }

    updatePlayerPosition(dice_result) {
        //40 = ammount of fields
        let newPosition = (dice_result + this.currentPositionId) % 39 

        //test
        console.log("new position= ", newPosition, "_", dice_result, "+", this.currentPositionId, "%39");

        //Pass throu "GO"
        if (this.currentPositionId >= newPosition || newPosition==0) this.addMoney(200);
        
        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${newPosition}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    
        //Update position
        this.currentPositionId = newPosition;
    }

    sendPlayerToGo() {
        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-0`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    
        //Update position
        this.currentPositionId = 0;

        this.addMoney(200);
    }

    //TO DO change propVal 
    bankrupcy(){
        alert("AI Bankrupcy wasnt tested properly yet");

        const decision = new Map();
        const PropertyValues = new Map();
        this.fieldsOwned.forEach(element => {
            let field = findFieldById(element);
            let propVal = this.decisionSellField(field);
            propVal = propVal * field.getHouseAmmount();

            PropertyValues.set(element, propVal);
        });

        //Sort mapby keys
        const sortedPropertyValues = new Map([...PropertyValues].sort((a, b) => b[1] - a[1]));
        console.log(sortedPropertyValues, " :sorted property values");
        

        //sell houses
        for(let [key, value] of sortedPropertyValues){
            let field = findFieldById(key);
            if(field.getHouseAmmount() == 0){
                continue;
            }
            else{
                while(field.getHouseAmmount()===0 || this.getMoney() > 0){
                    field.decreseHouse();
                    this.addMoney(200);
                }
            }
        }

        for(let [key, value] of sortedPropertyValues){
           if(this.getMoney()>0) break; 
           startAuction(this.getPlayerId(), key);            
        }
        return
    }
}
