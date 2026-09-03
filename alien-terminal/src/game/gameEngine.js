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
    "CRYOGENIC REVIVAL COMPLETE.",
    "",
    "YOU AWAKEN ALONE.",
    "THE OTHER CRYO PODS ARE EMPTY.",
    "SOME ARE OPEN. SOME ARE DAMAGED.",
    "",
    "YOU SEARCH THE SHIP.",
    "NO CREW MEMBERS RESPOND.",
    "YOU FIND THEM DEAD.",
    "",
    "SOMETHING IS LOOSE ON BOARD.",
    "SOMETHING THAT WAS NOT PART OF THE CREW.",
    "",
    "AUTOMATIC DISTRESS SIGNAL: ACTIVE.",
    "HELP HAS BEEN REQUESTED.",
    "RESCUE IS ON THE WAY.",
    "",
    "YOU ONLY HAVE TO SURVIVE UNTIL THEY ARRIVE.",
    "",
    `SURVIVE ${MAX_TURNS} TURNS.`,
    `LOCATION: ${rooms[playerRoom].name}`,
    "TYPE HELP FOR AVAILABLE COMMANDS.",
  ],
};
}




export function moveAlien(game) {
  const alien = rooms[game.alienRoom];

  if (!alien) {
    return game;
  }

  if (alien.exits.length === 0) {
    return game;
  }

  const randomIndex = Math.floor(
    Math.random() * alien.exits.length
  );

  const nextRoom = alien.exits[randomIndex];

  // Alien tentou atravessar uma porta trancada.
  if (isDoorLocked(game, game.alienRoom, nextRoom)) {
    return {
      ...game,
      logs: [
        ...game.logs,
        "MOTION DETECTED.",
        "LIFEFORM TRIED TO BREAK DOOR.",
        `DOOR LOCKED: ${rooms[game.alienRoom].name} ↔ ${rooms[nextRoom].name}`,
      ],
    };
  }

  // Porta livre: Alien se move normalmente.
  const updatedGame = {
    ...game,
    alienRoom: nextRoom,
  };

  // Alien encontrou o jogador.
  if (nextRoom === game.playerRoom) {
    updatedGame.gameOver = true;

    updatedGame.logs = [
      ...updatedGame.logs,
      "MOTION DETECTED.",
      "LIFEFORM HAS ENTERED YOUR LOCATION.",
      "CONNECTION TERMINATED.",

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

      // Se o Alien estiver na mesma sala, o sistema percebe algo estranho.
      if (game.alienRoom === game.playerRoom) {
        updatedGame.logs.push(
          "YOU LOOK AROUND AND SEE SOMETHING THAT SHOULD NOT BE THERE...",
          "I'M SORRY."
        );
      } else {
        const lookComments = [
          "YOU LOOK AROUND AND WONDER IF YOU ARE EVER GOING TO GET HOME AGAIN.",

          "YOU LOOK AROUND AND FEEL SORRY FOR YOUR MATES.",

          "YOU LOOK AROUND. EVERYTHING SEEMS NORMAL. THAT'S USUALLY WHEN THINGS GO WRONG.",

          "YOU LOOK AROUND AND WONDER WHO DESIGNED THIS PLACE.",

          "YOU LOOK AROUND AND REMEMBER THAT SPACE IS VERY, VERY COLD.",

          "YOU LOOK AROUND AND HEAR THE HUM OF THE SHIP. IT ALMOST SOUNDS ALIVE.",

          "YOU LOOK AROUND AND WONDER IF ANYONE IS LISTENING.",

          "YOU LOOK AROUND AND THINK ABOUT THE PAY. SUDDENLY IT DOESN'T SEEM WORTH IT.",

          "YOU LOOK AROUND AND REMEMBER THAT NOBODY CAN HEAR YOU SCREAM IN SPACE.",

          "YOU LOOK AROUND AND NOTICE A STRANGE DAMP SPOT ON THE FLOOR. YOU DECIDE NOT TO INVESTIGATE.",

          "YOU LOOK AROUND AND SEE AN ORANGE CAT. IT STARES AT YOU. YOU STARE BACK.",

          "YOU LOOK AROUND AND WONDER WHY THE CAT ALWAYS SEEMS TO KNOW MORE THAN YOU DO.",

          "YOU LOOK AROUND AND SEE A CUP OF COFFEE. COLD. LIKE EVERYTHING ELSE ON THIS SHIP.",

          "YOU LOOK AROUND AND WONDER IF THE COMPANY EVER ACTUALLY READ THE SAFETY REPORTS.",

          "YOU LOOK AROUND AND REMEMBER THE COMPANY OWNS THIS SHIP. AND PROBABLY YOU TOO.",

          "YOU LOOK AROUND AND FIND A NOTE: 'DO NOT OPEN THE DOOR.' YOU WONDER WHICH DOOR.",

          "YOU LOOK AROUND AND NOTICE A SMALL AMOUNT OF BLOOD. PROBABLY NOTHING.",

          "YOU LOOK AROUND AND DECIDE THAT 'PROBABLY NOTHING' IS NOT VERY REASSURING.",

          "YOU LOOK AROUND AND WONDER IF THE MOTION DETECTOR IS WORKING PROPERLY.",

          "YOU LOOK AROUND AND HEAR SOMETHING IN THE VENTS. YOU TELL YOURSELF IT'S THE AIRFLOW.",

          "YOU LOOK AROUND AND THINK ABOUT THE LAST TIME YOU SAW SUNLIGHT.",

          "YOU LOOK AROUND AND WONDER IF YOU WILL EVER SEE EARTH AGAIN.",

          "YOU LOOK AROUND AND REMEMBER: IN SPACE, NO ONE CAN HEAR YOU ASK FOR A REFUND.",

          "YOU LOOK AROUND AND SEE A REVOLVER. MAYBE IT WOULD BE USEFUL LATER... NOT ON THE ALIEN, OF COURSE.",

          "YOU LOOK AROUND AND FIND A PAIR OF OLD WORK GLOVES. THEY SMELL TERRIBLE.",

          "YOU LOOK AROUND AND WONDER WHY THERE ARE SO MANY EMPTY CRYOTUBES.",

          "YOU LOOK AROUND AND SEE CONDENSATION ON THE WALL. SOMETHING HERE IS COLDER THAN IT SHOULD BE.",

          "YOU LOOK AROUND AND REMEMBER THAT THE SHIP WAS SUPPOSED TO BE AUTOMATED.",

          "YOU LOOK AROUND AND WONDER WHO IS REALLY IN CONTROL OF THE SHIP.",

          "YOU LOOK AROUND AND FEEL THAT SOMETHING IS WATCHING YOU.",

          "YOU LOOK AROUND. NOTHING MOVES. YOU PREFER IT THAT WAY.",

          "YOU LOOK AROUND AND WONDER HOW MUCH THE COMPANY WOULD PAY FOR A SURVIVOR.",

          "YOU LOOK AROUND AND REMEMBER THE BRIEFING: 'JUST A ROUTINE SALVAGE OPERATION.'",

          "YOU LOOK AROUND AND THINK THAT 'ROUTINE' WAS PROBABLY THE WRONG WORD.",

          "YOU LOOK AROUND AND NOTICE SCRATCH MARKS ON THE WALL. THEY ARE TOO HIGH TO BE YOURS.",

          "YOU LOOK AROUND AND WONDER WHY THE AIRLOCK HAS BEEN USED SO RECENTLY.",

          "YOU LOOK AROUND AND HEAR METAL CREAKING SOMEWHERE FAR AWAY.",

          "YOU LOOK AROUND AND THINK: MAYBE THE MOST DANGEROUS THING ON THIS SHIP IS THE COMPANY POLICY.",

          "YOU LOOK AROUND AND REMEMBER THAT THERE IS NO RESCUE SHIP COMING.",

          "YOU LOOK AROUND AND REALIZE YOU HAVE BEEN TALKING TO THE COMPUTER FOR TOO LONG.",

          "YOU LOOK AROUND AND WONDER IF THE COMPUTER FEELS SORRY FOR YOU.",

          "YOU LOOK AROUND AND THE SHIP LOOKS EXACTLY THE SAME AS IT DID A MINUTE AGO. SOMEHOW, THAT IS WORSE.",

          "YOU LOOK AROUND AND WISH YOU HAD STAYED IN CRYO.",

          "YOU LOOK AROUND AND THINK ABOUT THE WORD 'SURVIVAL'. IT SOUNDS VERY EXPENSIVE.",

          "YOU LOOK AROUND AND REMEMBER THAT THE COMPANY NEVER MENTIONED AN ALIEN.",

          "YOU LOOK AROUND AND WONDER WHAT ELSE THE COMPANY FORGOT TO MENTION."
        ];

        const randomComment =
          lookComments[
          Math.floor(Math.random() * lookComments.length)
          ];

        updatedGame.logs.push(randomComment);
      }

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