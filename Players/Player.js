class Player {
    constructor(Name, Type, id, money=500) {
        this.Name = Name;
        this.Type = Type;
        this.id = id;
        this.money = money;
        this.currentPositionId = 0;
        this.moves = 1;
    }

    enterStartField() {
        this.money +=200
    }

    //Chages player position, checks if he went pass "go", give 200, updates positionon on board 
    updatePlayerPosition(dice_result) {
        //40 = ammount of fields
        let newPosition = (dice_result + this.currentPositionId) % 39 

        //test
        console.log("new position= ", newPosition, "_", dice_result, "+".this.currentPositionId, "%39");

        //Pass throu "GO"
        if (this.currentPositionId >= newPosition || newPosition==0) enterStartField();
        
        //Remove from prev position (MIGHT NOT WORK)
        document.getElementById(`player-${this.id}`).outerHTML = "";
    
        //Add Player to new Field
        document.getElementById(`playerbox-${newPosition}`).innerHTML+=`<div class='player' id='player-${this.id}'></div>`
    }

    placeOnStart() {
        this.currentPositionId = 0;
        document.getElementById(`playerbox-0`).innerHTML+=`<div class='player' id='player-${this.id}'></div>`
    }

    addMove() {
        this.moves += 1;
    }

    decreseMove() {
        this.moves -= 1;
    }

    getMoves() {
        return this.moves
    }
    getCurrentPositionId() {
        return this.currentPositionId;
    }
    getPlayerId() {
        return this.id
    }
}
