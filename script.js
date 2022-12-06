let PLAYERLIST = []
let UNIQUEID = 0
const MaxPlayers = 4

const addPlayerToList = () => {
        //Max ammount of players 4
        if (PLAYERLIST.length >= MaxPlayers) {
            alert("Maximum ammount of players is: 4")
            return;
        }
        const playerName = document.getElementById('playerName')
        const playerType = document.getElementById('IsPlayer')
    
        //is name too long?
        if (playerName.value.length > 15) {
            alert("Name is longer than 15 characters")
            return
        }
        UNIQUEID = UNIQUEID + 1
        let name
        if (playerName.value === "") name = playerName.placeholder
        else name = playerName.value
        PLAYERLIST.push(
            {
                Name: name,
                Type: playerType.value,
                id: UNIQUEID
            }
        )
        playersList();
        playerAmmountDisplay();
}
    
const playersList = () => {
    let appendElements;
    document.getElementById("PlayerList").innerHTML=""
        PLAYERLIST.forEach(element => {
            appendElements=`<div class='PlayerList'>
                <p>${element.Name}</p>
                <p>(${element.Type})</p>
                <button onclick="removePlayerFromList(${element.id})">Remove</button>
            </div>`
            document.getElementById("PlayerList").innerHTML+=appendElements
        });
        //document.getElementById("PlayerList").innerHTML=appendElements
}

const playerAmmountDisplay = () => {
    document.getElementById("ammountOfPlayers").innerHTML = PLAYERLIST.length
    StartButton()
}

//Remove player from list
const removePlayerFromList = (e) => {
    console.log("item removed")
    const newList = PLAYERLIST.filter((l) => l.id !== e)
    PLAYERLIST = newList
    playerAmmountDisplay()
    playersList()
}

const StartButton = () => {
    if (PLAYERLIST.length >= 2)
        document.getElementById("StartButton").innerHTML=`<button onclick="CreateField()">Start Game</button>`
    else
        document.getElementById("StartButton").innerHTML=""
}

