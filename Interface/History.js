const diceRolleHistory = (playerId,diceRolle1, diceRolle2) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');
    const fieldName = FIELDS_LIST[findFieldById(player.getCurrentPositionId())].getFieldTitle();;

    textArea.innerHTML += `Player: ${player.getPlayerName()} throws: ${diceRolle1} and ${diceRolle2}, enters ${fieldName} \r\n`;
}

const buyFieldHistory = (playerId, fieldId, value) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const field = FIELDS_LIST[findFieldById(fieldId)];
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `Player: ${player.getPlayerName()} bought: ${field.getFieldTitle()} for: ${value}\r\n`;
}

const startAuctionHistory = (playerId, fieldId) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');
    const field = FIELDS_LIST[findFieldById(fieldId)];

    textArea.innerHTML += `Player: ${player.getPlayerName()} started auction for: ${field.getFieldTitle()}\r\n`;
}

const endAuctionHistory = (playerId, value) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `Player: ${player.getPlayerName()} bought field in auction for: ${value}\r\n`;
}

const buyHouseHistory = (playerId, fieldId) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');
    const field = FIELDS_LIST[findFieldById(fieldId)];

    textArea.innerHTML += `Player: ${player.getPlayerName()} bought house in: ${field.getFieldTitle()}\r\n`;
}

const chanceHistory = (playerId , chanceMessage) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `Player: ${player.getPlayerName()} entered got chance card: ${chanceMessage}\r\n`;
}

const communityChestHistory = (playerId , communityChestMessage) => {
    const player = PLAYERS[findPlayerById(playerId)];
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `Player: ${player.getPlayerName()} entered got comunity chest: ${communityChestMessage}\r\n`;
}

const taxIncomeHistory = (player) => {
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `Player: ${player.getPlayerName()} payes tax income: 200$\r\n`;
}

const printInHistory = (message) => {
    const textArea = document.getElementById('interface__history__textarea');

    textArea.innerHTML += `${message}\r\n`;
}