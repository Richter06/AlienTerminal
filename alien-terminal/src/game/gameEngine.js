import { roomList, rooms } from "./rooms";

export const MAX_TURNS = 30;

export function getLockKey(roomA, roomB) {
  return [roomA, roomB].sort().join("-");
}

export function isDoorLocked(game, roomA, roomB) {
  const lockKey = getLockKey(roomA, roomB);

  return (game.locks[lockKey] ?? 0) > 0;
}

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
    locks: {},
    newLock: null,
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


export function updateLocks(game) {
  const updatedLocks = {};

  for (const [lockKey, battery] of Object.entries(game.locks)) {

    if (lockKey === game.newLock) {
      updatedLocks[lockKey] = battery;
      continue;
    }

    const remaining = battery - 1;

    if (remaining > 0) {
      updatedLocks[lockKey] = remaining;
    }
  }

  return {
    ...game,
    locks: updatedLocks,
    newLock: null,
  };
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

  updatedGame = updateLocks(updatedGame);
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

  const parts = command.split(/\s+/);

  let roomA = null;
  let roomB = null;

  for (let i = 2; i < parts.length; i++) {
    const possibleRoomA = parts
      .slice(1, i)
      .join("-")
      .toLowerCase();

    const possibleRoomB = parts
      .slice(i)
      .join("-")
      .toLowerCase();

    if (rooms[possibleRoomA] && rooms[possibleRoomB]) {
      roomA = possibleRoomA;
      roomB = possibleRoomB;
      break;
    }
  }

  let updatedGame = {
    ...game,
    logs: [...game.logs, `> ${command}`],
  };

  switch (parts[0]) {

    case "HELP":

      updatedGame.logs.push(
        "AVAILABLE COMMANDS:",
        "HELP",
        "STATUS",
        "RADAR",
        "LOOK",
        "LOCK"
      );

      break;

    case "STATUS": {

      updatedGame.logs.push(
        `TURN: ${game.turn}/${game.maxTurns}`,
        `LOCATION: ${rooms[game.playerRoom].name}`
      );

      const activeLocks = Object.entries(game.locks);

      if (activeLocks.length === 0) {
        updatedGame.logs.push(
          "ACTIVE LOCKS: NONE"
        );

        break;
      }

      updatedGame.logs.push(
        "ACTIVE LOCKS:"
      );

      for (const [lockKey, battery] of activeLocks) {

        const lockRooms = Object.keys(rooms).filter((roomId) => {
          return lockKey.includes(roomId);
        });

        if (lockRooms.length !== 2) {
          continue;
        }

        const [roomA, roomB] = lockRooms;

        updatedGame.logs.push(
          `${rooms[roomA].name} ↔ ${rooms[roomB].name} | BATTERY: ${"█".repeat(battery)}`
        );
      }

      break;
    }

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


    case "LOCK": {

      if (!roomA || !roomB) {
        updatedGame.logs.push(
          "LOCK REQUIRES TWO ROOMS."
        );

        return updatedGame;
      }

      if (!rooms[roomA] || !rooms[roomB]) {
        updatedGame.logs.push(
          "INVALID ROOM."
        );

        return updatedGame;
      }

      const hasExit =
        rooms[roomA].exits.includes(roomB) ||
        rooms[roomB].exits.includes(roomA);

      if (!hasExit) {
        updatedGame.logs.push(
          "NO LOCKS AVAILABLE."
        );

        return updatedGame;
      }

      const lockKey = getLockKey(roomA, roomB);

      if (isDoorLocked(game, roomA, roomB)) {
        updatedGame.logs.push(
          "LOCK ALREADY ACTIVE."
        );

        return updatedGame;
      }

      updatedGame.locks = {
        ...game.locks,
        [lockKey]: 3,
      };

      updatedGame.newLock = lockKey;

      updatedGame.logs.push(
        `LOCK ENGAGED: ${rooms[roomA].name} ↔ ${rooms[roomB].name}`,
        "BATTERY: ███"
      );

      break;
    }





    case "RADAR":

      updatedGame.radarRoom = game.alienRoom;
      updatedGame.radarActive = true;

      updatedGame.logs.push(
        "RADAR SCAN COMPLETE.",
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