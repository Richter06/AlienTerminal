import { roomList, rooms } from "./rooms";

export const MAX_TURNS = 30;

export function getRandomRoom() {
  const randomIndex = Math.floor(Math.random() * roomList.length);
  return roomList[randomIndex].id;
}

export function createGame() {
  let playerRoom = getRandomRoom();
  let alienRoom = getRandomRoom();

  // Garante que o Alien não comece na mesma sala que o jogador.
  while (alienRoom === playerRoom) {
    alienRoom = getRandomRoom();
  }

  return {
    playerRoom,
    alienRoom,
    turn: 1,
    maxTurns: MAX_TURNS,
    radarRoom: null,
    radarActive: false,
    gameOver: false,
    victory: false,
    logs: [
      "SYSTEM INITIALIZED.",
      "WELCOME TO ALIEN TERMINAL.",
      `LOCATION: ${rooms[playerRoom].name}`,
      `SURVIVE ${MAX_TURNS} TURNS.`,
      "TYPE HELP FOR AVAILABLE COMMANDS.",
    ],
  };
}

export function moveAlien(game) {
  const alien = rooms[game.alienRoom];

  if (!alien) {
    return game;
  }

  const possibleRooms = alien.exits;

  if (possibleRooms.length === 0) {
    return game;
  }

  const randomIndex = Math.floor(Math.random() * possibleRooms.length);
  const nextRoom = possibleRooms[randomIndex];

  const updatedGame = {
    ...game,
    alienRoom: nextRoom,
  };

  if (nextRoom === game.playerRoom) {
    updatedGame.gameOver = true;
    updatedGame.logs = [
      ...updatedGame.logs,
      "MOTION DETECTED.",
      "LIFEFORM HAS ENTERED YOUR LOCATION.",
      "CONNECTION TERMINATED.",
      "GAME OVER.",
    ];
  }

  return updatedGame;
}

export function advanceTurn(game) {
  if (game.gameOver || game.victory) {
    return game;
  }

  const nextTurn = game.turn + 1;

  let updatedGame = {
    ...game,
    turn: nextTurn,
    
  };

  updatedGame = moveAlien(updatedGame);

  if (!updatedGame.gameOver && nextTurn >= updatedGame.maxTurns) {
    updatedGame.victory = true;
    updatedGame.logs = [
      ...updatedGame.logs,
      `SURVIVAL OBJECTIVE COMPLETE.`,
      `YOU SURVIVED ${updatedGame.maxTurns} TURNS.`,
      "MISSION ACCOMPLISHED.",
    ];
  }

  return updatedGame;
}

export function executeCommand(game, input) {
  const command = input.trim().toUpperCase();

  if (!command) {
    return game;
  }

  if (game.gameOver || game.victory) {
    return game;
  }

  let updatedGame = {
    ...game,
    logs: [...game.logs, `> ${command}`],
  };

  switch (command) {
    case "HELP":
      updatedGame.logs.push(
        "AVAILABLE COMMANDS:",
        "HELP",
        "STATUS",
        "RADAR",
        "LOOK"
      );
      break;

    case "STATUS":
      updatedGame.logs.push(
        `TURN: ${game.turn}/${game.maxTurns}`,
        `LOCATION: ${rooms[game.playerRoom].name}`
      );
      break;

    case "LOOK": {
      const currentRoom = rooms[game.playerRoom];

      updatedGame.logs.push(
        `CURRENT LOCATION: ${currentRoom.name}`,
        `EXITS: ${currentRoom.exits
          .map((roomId) => rooms[roomId].name)
          .join(", ")}`
      );

      break;
    }

    case "RADAR":
      updatedGame.radarRoom = game.alienRoom;
      updatedGame.radarActive = true;

      updatedGame.logs.push(
        `RADAR SCAN COMPLETE.`,
        `MOTION DETECTED: ${rooms[game.alienRoom].name}`
      );
      break;

    default:
      updatedGame.logs.push(
        "UNKNOWN COMMAND.",
        "TYPE HELP FOR AVAILABLE COMMANDS."
      );

      // Comando inválido NÃO gasta turno nesta primeira versão.
      return updatedGame;
  }

  // Qualquer comando válido faz o Alien se mover.
  return advanceTurn(updatedGame);
}