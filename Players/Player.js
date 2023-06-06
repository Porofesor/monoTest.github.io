class Player {
    constructor(Name, Type, id, money=1000) {
        this.Name = Name;
        this.Type = Type;
        this.id = id;
        this.money = money;
        this.currentPositionId = 0;
        this.moves = 1;
        this.fieldsOwned = []
        this.OutofJail = 0;
    }

    enterStartField() {
        this.addMoney(200);
        console.log("+200 player money=",this.money)
    }

    //Chages player position, checks if he went pass "go", give 200, updates positionon on board 
    //TO DO make this in interface not here
    updatePlayerPosition(dice_result) {
        //40 = ammount of fields
        let newPosition = (dice_result + this.currentPositionId) % 39 

        //test
        console.log("new position= ", newPosition, "_", dice_result, "+", this.currentPositionId, "%39");

        //Pass throu "GO"
        if (this.currentPositionId >= newPosition || newPosition==0){
            this.enterStartField();
            if(newPosition !=0 ) newPosition-=1; //Eliminates bug with going one position too far
        } 
        
        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${newPosition}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id + 1}</div>`
    
        //Update position
        this.currentPositionId = newPosition;
    }

    sendPlayerTo(positionId) {
        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${positionId}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id}</div>`
    
        //Update position
        this.currentPositionId = positionId;
    }

    placeOnStart() {
        this.currentPositionId = 0;
        document.getElementById(`playerbox-0`).innerHTML+=`<div class='player' id='player-${this.id}'>${this.id}</div>`
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

    addMove() {
        this.moves += 1;
    }

    decreseMove(ammount = 1) {
        this.moves -= ammount;
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

    payMoney(ammount) {
        this.money -= ammount;
        if (this.money < 0) {
            bankrupcy(this);
        }
        updatePlayerList();
    }

    addMoney(ammount) {
        this.money += ammount;
        updatePlayerList();
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
}
