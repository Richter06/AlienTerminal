export const rooms = {
  bridge: {
    id: "bridge",
    name: "BRIDGE",
    exits: ["cryo"],
  },

  cryo: {
    id: "cryo",
    name: "CRYO",
    exits: ["bridge", "hub"],
  },

  mess: {
    id: "mess",
    name: "MESS",
    exits: ["hub", "galley", "medbay"],
  },

  galley: {
    id: "galley",
    name: "GALLEY",
    exits: ["mess"],
  },

  hub: {
    id: "hub",
    name: "HUB",
    exits: [
      "cryo",
      "mess",
      "cargo",
      "engineering",
    ],
  },

  medbay: {
    id: "medbay",
    name: "MEDBAY",
    exits: ["mess"],
  },

  cargo: {
    id: "cargo",
    name: "CARGO",
    exits: ["hub", "airlock", "engineering"],
  },

  airlock: {
    id: "airlock",
    name: "AIRLOCK",
    exits: ["cargo"],
  },

  engineering: {
    id: "engineering",
    name: "ENGINEERING",
    exits: ["hub", "cargo", "machine-shop"],
  },

  "machine-shop": {
    id: "machine-shop",
    name: "MACHINE SHOP",
    exits: ["engineering", "landing-bay"],
  },

  "landing-bay": {
    id: "landing-bay",
    name: "LANDING BAY",
    exits: ["machine-shop"],
  },
};

export const roomList = Object.values(rooms);