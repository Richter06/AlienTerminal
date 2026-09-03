import { useEffect, useRef, useState } from "react";

import { rooms } from "../game/rooms";

import { getLockKey } from "../game/gameEngine";

import soundDeviceIcon from "../assets/sound-loud-filled-svgrepo-com.svg";

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

    const mapRef = useRef(null);

    const [roomPositions, setRoomPositions] = useState({});

    function calculatePositions() {
        if (!mapRef.current) return;

        const mapRect =
            mapRef.current.getBoundingClientRect();

        const positions = {};

        roomIds.forEach((roomId) => {
            const element =
                mapRef.current.querySelector(
                    `.room-${roomId}`
                );

            if (!element) return;

            const rect =
                element.getBoundingClientRect();

            positions[roomId] = {
                left: rect.left - mapRect.left,
                top: rect.top - mapRect.top,
                width: rect.width,
                height: rect.height,
            };
        });

        setRoomPositions(positions);
    }

    useEffect(() => {
        calculatePositions();

        const resizeObserver =
            new ResizeObserver(() => {
                calculatePositions();
            });

        if (mapRef.current) {
            resizeObserver.observe(mapRef.current);
        }

        window.addEventListener(
            "resize",
            calculatePositions
        );

        return () => {
            resizeObserver.disconnect();

            window.removeEventListener(
                "resize",
                calculatePositions
            );
        };
    }, []);

    /*
     * Centraliza o mapa horizontalmente
     * quando a tela é aberta.
     */
    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        const container = map.parentElement;

        if (!container) return;

        container.scrollLeft =
            (map.scrollWidth - container.clientWidth) / 2;
    }, []);

    const connections = [];

    roomIds.forEach((roomId) => {
        const room = rooms[roomId];

        room.exits.forEach((exitId) => {
            const alreadyExists =
                connections.some(
                    ([a, b]) =>
                        (a === roomId &&
                            b === exitId) ||
                        (a === exitId &&
                            b === roomId)
                );

            if (!alreadyExists) {
                connections.push([
                    roomId,
                    exitId
                ]);
            }
        });
    });

    function getConnectionPoints(
        roomA,
        roomB
    ) {
        const a = roomPositions[roomA];
        const b = roomPositions[roomB];

        if (!a || !b) return null;

        const centerA = {
            x: a.left + a.width / 2,
            y: a.top + a.height / 2,
        };

        const centerB = {
            x: b.left + b.width / 2,
            y: b.top + b.height / 2,
        };

        const dx =
            centerB.x - centerA.x;

        const dy =
            centerB.y - centerA.y;

        let startX = centerA.x;
        let startY = centerA.y;

        let endX = centerB.x;
        let endY = centerB.y;

        /*
         * Decide se a conexão é predominantemente
         * horizontal ou vertical.
         */
        if (Math.abs(dx) > Math.abs(dy)) {
            const direction =
                dx > 0 ? 1 : -1;

            startX =
                centerA.x +
                (a.width / 2) *
                    direction;

            endX =
                centerB.x -
                (b.width / 2) *
                    direction;
        } else {
            const direction =
                dy > 0 ? 1 : -1;

            startY =
                centerA.y +
                (a.height / 2) *
                    direction;

            endY =
                centerB.y -
                (b.height / 2) *
                    direction;
        }

        return {
            startX,
            startY,
            endX,
            endY,
        };
    }

    return (
        <section className="map-panel">
            <div className="panel-title">
                SHIP MAP
            </div>

            <button
                className="map-exit"
                onClick={onExit}
            >
                EXIT MAP
            </button>

            <div className="map-scroll">
                <div
                    className="ship-map"
                    ref={mapRef}
                >
                    <svg className="map-connections">
                        {connections.map(
                            ([roomA, roomB]) => {
                                const points =
                                    getConnectionPoints(
                                        roomA,
                                        roomB
                                    );

                                if (!points) {
                                    return null;
                                }

                                const lockKey =
                                    getLockKey(
                                        roomA,
                                        roomB
                                    );

                                const battery =
                                    game.locks[
                                        lockKey
                                    ] ?? 0;

                                const isLocked =
                                    battery > 0;

                                const centerX =
                                    (points.startX +
                                        points.endX) /
                                    2;

                                const centerY =
                                    (points.startY +
                                        points.endY) /
                                    2;

                                return (
                                    <g
                                        key={`${roomA}-${roomB}`}
                                    >
                                        <line
                                            x1={
                                                points.startX
                                            }
                                            y1={
                                                points.startY
                                            }
                                            x2={
                                                points.endX
                                            }
                                            y2={
                                                points.endY
                                            }
                                            className={
                                                isLocked
                                                    ? "locked-connection"
                                                    : ""
                                            }
                                        />

                                        {isLocked && (
                                            <g
                                                className="lock-battery"
                                                transform={`translate(${centerX}, ${centerY})`}
                                            >
                                                {[0, 1, 2].map(
                                                    (
                                                        index
                                                    ) => (
                                                        <rect
                                                            key={
                                                                index
                                                            }
                                                            x={
                                                                -12 +
                                                                index *
                                                                    10
                                                            }
                                                            y="-3"
                                                            width="7"
                                                            height="6"
                                                            className={
                                                                index <
                                                                battery
                                                                    ? "battery-active"
                                                                    : "battery-empty"
                                                            }
                                                        />
                                                    )
                                                )}
                                            </g>
                                        )}
                                    </g>
                                );
                            }
                        )}
                    </svg>

                    {roomIds.map((roomId) => {
                        const room =
                            rooms[roomId];

                        const isPlayer =
                            game.playerRoom ===
                            roomId;

                        const isRadarAlien =
                            game.radarActive &&
                            game.radarRoom ===
                                roomId;

                        const hasSoundDevice =
                            game.soundDevices?.includes(
                                roomId
                            );

                        return (
                            <div
                                key={roomId}
                                className={`room room-${roomId} ${
                                    isPlayer
                                        ? "player-room"
                                        : ""
                                }`}
                            >
                                <span className="room-name">
                                    {room.name}
                                </span>

                                {hasSoundDevice && (
                                    <img
                                        src={
                                            soundDeviceIcon
                                        }
                                        className="sound-device"
                                        alt=""
                                    />
                                )}

                                {isRadarAlien && (
                                    <span
                                        className="alien-marker"
                                        title="Motion detected"
                                    >
                                        ●
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
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

                <span>
                    <i className="legend-lock">
                        <b />
                        <b />
                        <b />
                    </i>
                    ACTIVE LOCK
                </span>

                <span>
                    <img
                        src={soundDeviceIcon}
                        className="legend-sound"
                        alt=""
                    />
                    SOUND DEVICE
                </span>
            </div>
        </section>
    );
}