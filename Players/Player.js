class Player {
    rankedField = [];
    constructor(Name, Type, id, money=1000) {
        this.Name = Name;
        this.Type = Type;
        this.id = id;
        this.money = money;
        this.currentPositionId = 0;
        this.moves = 1;
        this.fieldsOwned = []
        this.OutofJail = 0;
        this.Turn_counter = 0;

        this.stableProbabilities = [];
        this.w1 = 32;
        this.w2 = 1.1;
        this.w3 = 0.62;
        this.w4 = 0.4;
        for (let i = 0; i < 40; i++) {
            this.rankedField.push(i);
        }
        this.simulateMoves(1000);
    }

    enterStartField() {
        this.addMoney(200);
        //console.log("+200 player money=",this.money)
    }

    //Chages player position, checks if he went pass "go", give 200, updates positionon on board 
    //TO DO make this in interface not here
    updatePlayerPosition(dice_result) {
        //40 = ammount of fields
        let newPosition = (dice_result + this.currentPositionId) % 40 

        //test
        //console.log("new position= ", newPosition, "_", dice_result, "+", this.currentPositionId, "%39");

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
        document.getElementById(`playerbox-${positionId}`).innerHTML += `<div class='player' id='player-${this.id}'>${this.id + 1}</div>`
    
        //Crossing Go
        if(this.currentPositionId > positionId && positionId != 10) {
            this.addMoney(200);
        }
        //Update position
        this.currentPositionId = positionId;
        checkField(this)
;    }

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
        if(this.money < 0) {
            bankrupcy(this);
        }
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

    //----------------------------------------------------------------
    //----------------------------------------------------------------
    //Support system 
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
        this.stableProbabilities = (this.calculateStableProbabilities(fildsEntered));
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


    MarkovMatrix(fieldCounts) {
        const numFields = fieldCounts.length;
        const matrix = [];

        // Calculate the total number of times any field was entered
        const total = fieldCounts.reduce((acc, count) => acc + count, 0);

        // Calculate the probabilities of moving from each field to each other field
        for (let i = 0; i < numFields; i++) {
            const row = [];
            for (let j = 0; j < numFields; j++) {
            const prob = fieldCounts[j] / total;
            row.push(prob);
            }
            matrix.push(row);
        }

        return matrix;
    }

    calculateStableProbabilities(fieldCounts) {
        const numFields = fieldCounts.length;
        const markovMatrix = this.MarkovMatrix(fieldCounts);
        let prevVector = new Array(numFields).fill(1 / numFields); // Initialize with equal probabilities
        let currVector = [];
      
        // Calculate the eigenvector for the eigenvalue of 1
        while (true) {
          for (let i = 0; i < numFields; i++) {
            let sum = 0;
            for (let j = 0; j < numFields; j++) {
              sum += prevVector[j] * markovMatrix[j][i];
            }
            currVector[i] = sum;
          }
      
          // Check for convergence
          let maxDiff = 0;
          for (let i = 0; i < numFields; i++) {
            const diff = Math.abs(currVector[i] - prevVector[i]);
            if (diff > maxDiff) {
              maxDiff = diff;
            }
          }
      
          if (maxDiff < 1e-8) {
            break;
          }
      
          prevVector = currVector.slice();
        }
      
        return currVector;
      }

      decisionBuyField(field, prop_val = field.getFieldPropertyValue()) {
        if (this.money < prop_val) {
            return 500
        }
        const decision_value = ((prop_val * this.w2) + SimulateMoves(this, 7, 3)) - ( (this.stableProbabilities[field.getFieldId()] * this.w1) * ( (this.money * this.w3) + ( field.getField_penalty() * this.w4)));
        
        //console.log("buy field decision Player" + decision_value);

        return decision_value;
    } 

    decisionBuyHouse(field, prop_val = 200){
        if (this.money < prop_val) {
            return 500
        }
        const decision_value = ((prop_val * this.w2) + SimulateMoves(this, 7, 3)) - ( (this.stableProbabilities[field.getFieldId()] * this.w1) * ( (this.money * this.w3) + ( (field.getField_penalty() + field.Field_penaltyForEveryHouse) * this.w4)));
        return decision_value;
    }
}
