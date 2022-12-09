let losers = [];
//execute after player has less than 0 money
const bankrupcy = (player) => {
    //PLAYERS = PLAYERS.filter(item => item !== player)
    player.decreseMove(99999)
    printInHistory("Player lost: ", player.getPlayerName());
    losers.push(player);

    //this should never be here, it might create a massive bug
    //prepareNextPlayer(PLAYERS[findNextPlayer(player.getPlayerId())])

    if ((losers.length + 1) == PLAYERS.length) {
        // finds all the elements of 'PLAYERS' that are not in 'losers'
        winner = PLAYERS.filter( 
            val => !losers.find( arr1Obj => arr1Obj === val)
        );

        printInHistory(`Game ends, Player: ${winner[0].getPlayerName()} Wins!`);
        //winner[0].decreseMove(99999)
        console.log(PLAYERS)
        console.log(FIELDS_LIST)
        throw new Error("Game was stoped!");
        return;
    }
}
