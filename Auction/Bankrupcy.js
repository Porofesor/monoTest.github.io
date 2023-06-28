var losers = [];
//execute after player has less than 0 money
const bankrupcy = (player) => {
    console.log("Start baunkrupcy", player)
    //PLAYERS = PLAYERS.filter(item => item !== player)

    player.moves = 0;

    if(player.fieldsOwned.length == 0){
        player.decreseMove(99999)
        printInHistory("Player lost: " + player.getPlayerName());
        if (!losers.includes(player)) {
            losers.push(player);
        }
    }else{
        //Opens panel for selling fields and houses
        if(player.Type ==="AI"){
            //AI auction
            if(player.fieldsOwned.length > 0 && player.getMoney() < 0)
                player.bankrupcy();
        }else{
            //player auction
            starBankrupcyAuction(player.getPlayerId());
        }
    }

    if(player.getMoney() >= 0){
        prepareNextPlayer(PLAYERS[findNextPlayer(player.getPlayerId())]);
        return;
    }

    //this should never be here, it might create a massive bug
    //prepareNextPlayer(PLAYERS[findNextPlayer(player.getPlayerId())])

    if ((losers.length + 1) == PLAYERS.length) {
        // finds all the elements of 'PLAYERS' that are not in 'losers'
        winner = PLAYERS.filter( 
            val => !losers.find( arr1Obj => arr1Obj === val)
        );
        IsGameGoing = false;    
        printInHistory(`Game ends, Player: ${winner[0].getPlayerName()} Wins!`);
        document.getElementById(`interface__auction`).innerHTML=``;
        throw new Error("Program terminated");    
    }
}
