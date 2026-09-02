import { rooms } from "../game/rooms";

export default function Map({ game, onExit }) {
    const roomIds = [
        "bridge",
        "cryo",
        "medbay",
        "mess",
        "hub",
        "cargo",
        "airlock",
        "engineering",
        "machine-shop",
        "landing-bay",
        "galley"
    ];

    return (
        <section className="map-panel">
            <div className="panel-title">SHIP MAP</div>
            <button className="map-exit" onClick={onExit}>
                EXIT MAP
            </button>

            <div className="ship-map">
                {roomIds.map((roomId) => {
                    const room = rooms[roomId];

                    const isPlayer = game.playerRoom === roomId;
                    const isRadarAlien =
                        game.radarActive && game.radarRoom === roomId;


                    return (
                        <div
                            key={roomId}
                            className={`room room-${roomId} ${isPlayer ? "player-room" : ""
                                }`}
                        >
                            <span className="room-name">{room.name}</span>


                            {isRadarAlien && (
                                <span className="alien-marker" title="Motion detected">
                                    ●
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="map-legend">
                <span>
                    <i className="legend-player" />
                    YOUR LOCATION
                </span>

                <span>
                    <i className="legend-alien" />
                    RADAR CONTACT
                </span>
            </div>
        </section>
    );
}