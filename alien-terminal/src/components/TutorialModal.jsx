export default function TutorialModal({ onClose }) {
    return (<div className="tutorial-overlay"> <div className="tutorial-modal"> <div className="tutorial-header">
        USCSS SYSTEMS — SHIPBOARD OPERATIONS MANUAL </div>


        <div className="tutorial-content">
            <h2>ALIEN TERMINAL</h2>

            <p>
                You are operating a remote terminal aboard a
                USCSS vessel while an unidentified lifeform
                moves through the ship.
            </p>

            <p>
                Your objective is to remain alive for
                <strong> 30 TURNS.</strong>
            </p>

            <p>
                The terminal does not give you direct control
                over the ship. You must use its systems to
                monitor, predict and manipulate the lifeform's
                movement.
            </p>


            <div className="tutorial-section">
                <h3>01 — TURN SYSTEM</h3>

                <p>
                    The ship operates in discrete turns.
                    Most operational commands consume exactly
                    one turn.
                </p>

                <p>
                    After a valid command is executed, the
                    lifeform normally gets an opportunity to
                    move through the ship.
                </p>

                <p>
                    Invalid commands do not consume a turn.
                    Use this to your advantage when entering
                    commands.
                </p>

                <p>
                    The <strong>MAP</strong> command does not
                    consume a turn and does not move the
                    lifeform.
                </p>

                <p>
                    Your current turn, location and system
                    information can be monitored through
                    <strong> STATUS.</strong>
                </p>
            </div>


            <div className="tutorial-section">
                <h3>02 — SHIP MAP</h3>

                <p>
                    The ship is divided into connected rooms.
                    The lifeform can only move between rooms
                    connected by an available passage.
                </p>

                <p>
                    The lines displayed between rooms represent the
                    physical connections between them. Each line
                    indicates that the two connected rooms can normally
                    be reached from one another.
                </p>

                <p>
                    A connection may become temporarily unavailable
                    when a door lock is active. Locked connections are
                    indicated separately on the map.
                </p>

                <p>
                    The map displays the ship's room layout and
                    important system information.
                </p>

                <p>
                    Your location is highlighted on the map.
                    Radar contacts, active locks, sound devices
                    and ventilation access points may also be
                    displayed.
                </p>

                <p>
                    Entering <strong>MAP</strong> opens the
                    schematic without advancing the turn.
                </p>

                <p>
                    Use <strong>EXIT MAP</strong> to return to
                    the terminal.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>03 — RADAR</h3>

                <p>
                    <strong>RADAR</strong> attempts to determine
                    the lifeform's last known location.
                </p>

                <p>
                    Radar does not continuously track the
                    lifeform. The reported position represents
                    the most recent contact available to the
                    system.
                </p>

                <p>
                    When a radar contact is displayed on the map,
                    the marked room is <strong>NOT necessarily the
                        lifeform's current location.</strong>
                </p>

                <p>
                    The marker represents the lifeform's
                    <strong>last known position.</strong> After that
                    contact, the lifeform may have remained in the
                    same room or moved into one of the connected
                    rooms.
                </p>

                <p>
                    Use the connections shown on the map to
                    determine where the lifeform could have moved
                    after the last known contact.
                </p>

                <p>
                    If the lifeform enters the ventilation
                    network, radar cannot detect it.
                </p>

                <p>
                    When this happens, radar reports:
                </p>

                <p>
                    <strong>NO CONTACT DETECTED.</strong>
                </p>

                <p>
                    A missing radar contact does not mean the
                    lifeform is gone. It may be moving through
                    the ventilation system.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>04 — VENTILATION SYSTEM</h3>

                <p>
                    Some rooms contain access to the ship's
                    ventilation network.
                </p>

                <p>
                    The ventilation system behaves as a single
                    connected network. The lifeform can enter
                    the network from any room containing a vent.
                </p>

                <p>
                    The chance of entering the ventilation system
                    depends on the condition of the room's exits.
                    If at least one exit remains unlocked, there is
                    a <strong>40% chance</strong> of entering the
                    ventilation system.
                </p>

                <p>
                    If <strong>ALL exits</strong> from the room are
                    locked, the chance increases to
                    <strong> 80%.</strong>
                </p>

                <p>
                    This means that locking every available exit
                    can make the lifeform more likely to escape
                    through the ventilation system instead.
                </p>

                <p>
                    Once inside the ventilation network, the
                    lifeform becomes hidden from radar and its
                    exact location is unknown.
                </p>

                <p>
                    While inside the vents, the lifeform does not
                    follow the normal room-to-room movement rules.
                    The ventilation network allows it to move
                    independently of the ship's room connections.
                </p>

                <p>
                    At the end of each turn while hidden in the
                    ventilation system, there is a
                    <strong> 75% chance</strong> that the lifeform
                    remains inside the vents.
                </p>

                <p>
                    There is a <strong>25% chance</strong> that it
                    exits the ventilation system through a randomly
                    selected room containing a vent.
                </p>

                <p>
                    The lifeform may therefore emerge far from the
                    room where it originally entered the ventilation
                    network.
                </p>

                <p>
                    While the lifeform is inside the vents, the
                    terminal may generate atmospheric warnings
                    that provide indirect clues about its presence.
                </p>

                <p>
                    Possible messages include:
                </p>

                <p>
                    <strong>
                        YOU HEAR A LOUD ROAR IN THE VENTS OF THE SHIP.
                    </strong>
                </p>

                <p>
                    <strong>
                        SUDDENLY, THE AIR STARTS TO SMELL WEIRD.
                    </strong>
                </p>

                <p>
                    These messages do not reveal the lifeform's
                    exact location. They are warnings that something
                    may be moving through the ventilation system.
                </p>

                <p>
                    The ventilation system can also trigger rare
                    system events. One possible event is:
                </p>

                <p>
                    <strong>
                        DISTRESS SIGNAL SYSTEM DAMAGED.
                    </strong>
                </p>

                <p>
                    When this event occurs, the ship's distress signal
                    system is damaged and the remaining survival time
                    is reduced by <strong>5 turns.</strong>
                </p>

                <p>
                    This reduction affects the remaining turn count
                    directly. It does not rewind the game or undo
                    previous actions.
                </p>

                <p>
                    If the lifeform is inside the ventilation system,
                    <strong> RADAR</strong> reports:
                </p>

                <p>
                    <strong>NO CONTACT DETECTED.</strong>
                </p>

                <p>
                    A missing radar contact does not mean that the
                    lifeform has disappeared. It may still be moving
                    through the ventilation network and could emerge
                    from any available vent location.
                </p>

                <p>
                    The <strong>STEAM</strong> system can be used to
                    attempt to force a hidden lifeform out of the
                    ventilation network. It has a
                    <strong> 30% chance</strong> of succeeding.
                </p>

                <p>
                    Steam does not reveal whether the attempt was
                    successful. Use <strong>RADAR</strong> afterward
                    to determine whether contact has been restored.
                </p>

                <p>
                    The ventilation system is therefore both an
                    escape route and a major threat. Your decisions
                    about door locks can influence the probability of
                    the lifeform entering the vents, while
                    <strong> RADAR</strong>, atmospheric warnings and
                    <strong> STEAM</strong> can help you respond to
                    its presence.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>05 — DOOR LOCKS</h3>

                <p>
                    The <strong>LOCK</strong> command temporarily
                    seals a connection between two adjacent
                    rooms.
                </p>

                <p>
                    Syntax:
                </p>

                <p>
                    <strong>LOCK [ROOM] [ROOM]</strong>
                </p>

                <p>
                    Example:
                </p>

                <p>
                    <strong>LOCK CARGO AIRLOCK</strong>
                </p>

                <p>
                    Only directly connected rooms can be locked.
                    You cannot lock arbitrary rooms that are not
                    connected on the ship schematic.
                </p>

                <p>
                    Every newly activated lock starts with
                    <strong> 3 battery units.</strong>
                </p>

                <p>
                    The battery remains at 3 during the turn in
                    which the lock is created. On subsequent
                    turns it decreases until the lock expires.
                </p>

                <p>
                    Each locked connection operates
                    independently.
                </p>

                <p>
                    The lifeform can normally move through any
                    available connection from its current room.
                    However, if it selects a connection that is
                    currently locked, it will attempt to break
                    through the locked door.
                </p>

                <p>
                    When this happens, the terminal reports the
                    attempt in the system log.
                </p>

                <p>
                    The log will indicate that the lifeform tried
                    to break the door and identify the specific
                    locked connection it attempted to use.
                </p>

                <p>
                    Possible messages include:
                </p>

                <p>
                    <strong>MOTION DETECTED.</strong>
                </p>

                <p>
                    <strong>
                        LIFEFORM TRIED TO BREAK DOOR.
                    </strong>
                </p>

                <p>
                    <strong>
                        DOOR LOCKED: ROOM ↔ ROOM
                    </strong>
                </p>

                <p>
                    If the locked connection was the exit selected
                    by the lifeform, the movement attempt fails.
                    The lifeform does <strong>NOT</strong> choose
                    another available exit during that turn.
                </p>

                <p>
                    This means that even if other doors are open,
                    the lifeform remains in its current room until
                    its next movement opportunity.
                </p>

                <p>
                    A locked door can therefore temporarily prevent
                    movement even when alternative routes are
                    available.
                </p>

                <p>
                    Monitor the battery indicators on the map
                    carefully. An expired lock automatically
                    becomes available again.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>06 — SOUND DEVICES</h3>

                <p>
                    Sound devices can be used to manipulate the
                    lifeform's movement by creating an artificial
                    source of noise.
                </p>

                <p>
                    Use:
                </p>

                <p>
                    <strong>SOUND [ROOM]</strong>
                </p>

                <p>
                    Example:
                </p>

                <p>
                    <strong>SOUND CARGO</strong>
                </p>

                <p>
                    Several sound devices are installed at the
                    beginning of a session. Their locations can
                    be identified on the ship map.
                </p>

                <p>
                    When a functioning sound device is activated,
                    the lifeform immediately begins moving toward
                    the source of the sound.
                </p>

                <p>
                    The lifeform attempts to reach the sound source
                    using the <strong>fastest available route</strong>.
                    Its movement toward the device occurs during
                    a single turn.
                </p>

                <p>
                    Locked connections do not normally stop the
                    lifeform from pursuing an active sound source.
                    If a locked door blocks the shortest route,
                    the lifeform will search for another available
                    route and continue toward the sound source.
                </p>

                <p>
                    If the available routes are completely blocked
                    by active locks, the lifeform will attempt to
                    break through as many locked doors as necessary
                    to find a route to the sound source.
                </p>

                <p>
                    When pursuing a sound source, the battery level
                    of a locked connection does not matter. Even a
                    newly activated lock with a full
                    <strong> 3 battery units</strong> will be broken
                    if it is necessary to reach the sound source.
                </p>

                <p>
                    Sound pursuit overrides the normal protection
                    provided by door locks. The lifeform will break
                    through a locked connection regardless of how
                    much battery remains in the lock.
                </p>

                <p>
                    If a direct route to the sound source is
                    blocked, the lifeform may therefore break
                    through multiple locked connections during
                    the same movement.
                </p>

                <p>
                    While pursuing an active sound source, the
                    lifeform is focused entirely on reaching
                    the noise. If its route passes through the room
                    occupied by the player, it will
                    <strong> ignore the player and continue moving</strong>
                    toward the sound source.
                </p>

                <p>
                    The player is therefore not automatically
                    attacked when the lifeform passes through
                    their room during a sound pursuit.
                </p>

                <p>
                    This behavior makes sound devices especially
                    useful for manipulating the lifeform's position.
                    They can be used to pull it away from your
                    location, redirect it toward another area of
                    the ship, or move it away from ventilation
                    access points.
                </p>

                <p>
                    When the lifeform reaches the room containing
                    the activated sound device, it destroys the
                    device.
                </p>

                <p>
                    The terminal reports the destruction of the
                    device in the system log.
                </p>

                <p>
                    After destroying the device, the lifeform
                    <strong> stops moving for that turn</strong>.
                    It remains in the room where the sound device
                    was located.
                </p>

                <p>
                    This creates a temporary opportunity for the
                    player to react. You may use this moment to
                    lock connections around the lifeform, move
                    farther away from it, or position yourself
                    strategically relative to ventilation access
                    points.
                </p>

                <p>
                    Sound devices are limited resources. Once a
                    device has been destroyed, it can no longer
                    be activated.
                </p>

                <p>
                    The number of remaining devices is shown in
                    the system status.
                </p>

                <p>
                    If all devices have been destroyed, the
                    system reports:
                </p>

                <p>
                    <strong>ALL SOUND DEVICES DAMAGED.</strong>
                </p>
            </div>


            <div className="tutorial-section">
                <h3>07 — STEAM SYSTEM</h3>

                <p>
                    The <strong>STEAM</strong> command activates
                    the ship's steam release system.
                </p>

                <p>
                    Steam can only affect a lifeform currently
                    inside the ventilation system.
                </p>

                <p>
                    Use:
                </p>

                <p>
                    <strong>STEAM</strong>
                </p>

                <p>
                    Activating the system always consumes one
                    turn.
                </p>

                <p>
                    If the lifeform is inside the vents, there is
                    a <strong>30% chance</strong> that the steam
                    forces it out of the ventilation system.
                </p>

                <p>
                    If successful, the lifeform exits through a
                    randomly selected vent location.
                </p>

                <p>
                    The terminal confirms that the steam system
                    was activated, but does not tell you whether
                    the steam successfully affected the
                    lifeform.
                </p>

                <p>
                    Use <strong>RADAR</strong> afterward to
                    determine whether contact has been restored.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>08 — LIFEFORM MOVEMENT</h3>

                <p>
                    Understanding the lifeform's movement is essential
                    for survival. The lifeform normally moves through
                    the ship one room at a time, following the
                    connections shown on the ship map.
                </p>

                <p>
                    During normal movement, the lifeform can move
                    <strong> only one room per turn.</strong>
                </p>

                <p>
                    When its movement opportunity begins, the lifeform
                    chooses one of the connections available from its
                    current room. It may move through that connection
                    into an adjacent room, or it may choose to
                    <strong> remain in its current room.</strong>
                </p>

                <p>
                    The lifeform is therefore not required to move
                    every turn. Sometimes it may remain stationary,
                    making its exact position harder to predict.
                </p>

                <p>
                    Active door locks affect normal movement.
                    A locked connection cannot normally be used by
                    the lifeform.
                </p>

                <p>
                    If the lifeform selects a locked connection during
                    normal movement, it attempts to break the door.
                    The terminal reports the attempt and identifies
                    the locked connection.
                </p>

                <p>
                    If the attempt is blocked, the lifeform does
                    <strong> not choose another exit during that
                        movement opportunity.</strong> It remains in the
                    same room until its next opportunity to move,
                    even if other connections from that room are
                    available.
                </p>

                <p>
                    This means that door locks can temporarily delay
                    the lifeform's movement even when other routes
                    exist.
                </p>

                <p>
                    The lifeform can also enter the ship's
                    ventilation network when it reaches a room
                    containing a vent. The chance of entering the
                    vents depends on the condition of the room's
                    exits.
                </p>

                <p>
                    With at least one unlocked exit available,
                    there is a <strong>40% chance</strong> that the
                    lifeform enters the ventilation system instead
                    of continuing its normal movement.
                </p>

                <p>
                    If <strong>all exits</strong> from the room are
                    locked, this chance increases to
                    <strong>80%.</strong>
                </p>

                <p>
                    Once inside the ventilation network, the normal
                    one-room-per-turn movement rule no longer applies.
                    The ventilation system is treated as a single
                    connected network.
                </p>

                <p>
                    While inside the vents, the lifeform becomes
                    hidden from radar. Its exact location is unknown,
                    and the terminal reports:
                </p>

                <p>
                    <strong>NO CONTACT DETECTED.</strong>
                </p>

                <p>
                    The lifeform can remain inside the ventilation
                    system or eventually emerge through a vent.
                    On each turn while hidden, there is a
                    <strong>75% chance</strong> that it remains inside
                    the vents.
                </p>

                <p>
                    There is a <strong>25% chance</strong> that it
                    exits the ventilation network through a randomly
                    selected room containing a vent.
                </p>

                <p>
                    The exit does not have to be the same vent through
                    which the lifeform originally entered. It can
                    emerge from <strong>any vent location in the
                        network.</strong>
                </p>

                <p>
                    This means that once the lifeform enters the
                    ventilation system, it can potentially reappear
                    in a completely different part of the ship.
                </p>

                <p>
                    The <strong>SOUND</strong> system is an important
                    exception to the normal movement rules.
                </p>

                <p>
                    When a sound device is activated, the lifeform
                    immediately begins pursuing the source of the
                    sound.
                </p>

                <p>
                    During a sound pursuit, the normal
                    <strong> one-room-per-turn limitation is
                        overridden.</strong> The lifeform searches for
                    the fastest route to the sound source and can
                    travel through multiple rooms during the same
                    turn.
                </p>

                <p>
                    Door locks do not prevent a sound pursuit.
                    If a locked connection blocks the fastest route,
                    the lifeform searches for another available route.
                </p>

                <p>
                    If every available route is blocked by locks,
                    the lifeform will break through as many locked
                    connections as necessary to reach the sound
                    source.
                </p>

                <p>
                    The battery level of those locks does not matter.
                    Even a lock with a full
                    <strong> 3 battery units</strong> can be broken
                    during a sound pursuit.
                </p>

                <p>
                    While pursuing a sound source, the lifeform also
                    ignores the player. If its route passes through
                    the room occupied by the player, it will simply
                    continue through the room toward the sound source.
                </p>

                <p>
                    Once the lifeform reaches the room containing
                    the activated sound device, it destroys the
                    device.
                </p>

                <p>
                    After destroying the device, the lifeform
                    <strong> stops moving for the remainder of that
                        turn.</strong> It remains in the room where the
                    device was located, giving the player an
                    opportunity to react.
                </p>

                <p>
                    The lifeform can therefore behave very
                    differently depending on the system currently
                    influencing its movement:
                </p>

                <p>
                    <strong>NORMAL MOVEMENT</strong> — One adjacent
                    room per turn, or it may remain stationary.
                </p>

                <p>
                    <strong>LOCKED CONNECTION</strong> — The selected
                    locked door blocks normal movement and the
                    lifeform remains in its current room for that
                    movement opportunity.
                </p>

                <p>
                    <strong>VENTILATION</strong> — Normal room
                    movement is suspended while the lifeform moves
                    through the hidden ventilation network. It may
                    later emerge from any room containing a vent.
                </p>

                <p>
                    <strong>SOUND PURSUIT</strong> — Normal movement
                    restrictions are overridden. The lifeform travels
                    along the fastest route to the sound source,
                    potentially crossing multiple rooms in a single
                    turn and breaking locked doors when necessary.
                </p>

                <p>
                    The lifeform's movement is not displayed
                    continuously. Your primary sources of information
                    are <strong>RADAR</strong>, system messages,
                    sound-device destruction messages and the ship
                    map.
                </p>

                <p>
                    Remember that a radar marker represents the
                    <strong>last known position</strong>, not
                    necessarily the lifeform's current location.
                    After a normal movement opportunity, it may have
                    remained in that room or moved into a connected
                    room.
                </p>

                <p>
                    When the lifeform is inside the ventilation
                    system, radar cannot provide a location at all.
                    Atmospheric messages may provide indirect clues
                    that something is moving through the vents.
                </p>

                <p>
                    If the lifeform enters your current room during
                    normal movement, the terminal detects the
                    intrusion and the session is terminated.
                </p>

                <p>
                    The exception is a sound pursuit: while following
                    an active sound source, the lifeform may pass
                    through the player's room without attacking,
                    because its attention is focused entirely on
                    reaching the source of the noise.
                </p>

                <p>
                    Learning to distinguish these different movement
                    states is critical. The map shows where the
                    lifeform can potentially move, while your
                    commands determine which routes remain available
                    and which systems can influence its behavior.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>09 — SURVIVAL STRATEGY</h3>

                <p>
                    No individual system is guaranteed to save
                    you.
                </p>

                <p>
                    <strong>RADAR</strong> provides information.
                    <strong> LOCK</strong> controls movement.
                    <strong> SOUND</strong> manipulates position.
                    <strong> STEAM</strong> can disrupt the
                    ventilation system.
                </p>

                <p>
                    The strongest strategy is to combine these
                    systems rather than relying on one repeatedly.
                </p>

                <p>
                    Locks are temporary and sound devices are
                    finite. Do not waste resources without a
                    reason.
                </p>

                <p>
                    When radar loses contact, consider the
                    ventilation system before assuming the
                    lifeform has moved away.
                </p>

                <p>
                    Remember: every operational turn gives the
                    lifeform another opportunity to move.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>10 — COMMAND REFERENCE</h3>

                <p>
                    <strong>HELP</strong> — Displays the available
                    commands.
                </p>

                <p>
                    <strong>STATUS</strong> — Displays system
                    status, turn information and active locks.
                </p>

                <p>
                    <strong>LOOK</strong> — Inspects your current
                    room and available exits.
                </p>

                <p>
                    <strong>RADAR</strong> — Reports the
                    lifeform's last known location.
                </p>

                <p>
                    <strong>MAP</strong> — Opens the ship
                    schematic without consuming a turn.
                </p>

                <p>
                    <strong>LOCK [ROOM] [ROOM]</strong> —
                    Temporarily seals an adjacent connection.
                </p>

                <p>
                    <strong>SOUND [ROOM]</strong> — Activates a
                    sound device.
                </p>

                <p>
                    <strong>STEAM</strong> — Activates the steam
                    system and may force a hidden lifeform out
                    of the ventilation network.
                </p>
            </div>


            <div className="tutorial-section">
                <h3>FINAL WARNING</h3>

                <p>
                    The terminal is your only interface with the
                    ship.
                </p>

                <p>
                    The lifeform does not need to be visible to
                    be close.
                </p>

                <p>
                    Monitor the systems.
                    Manage your resources.
                    Watch the doors.
                    Listen for movement.
                </p>

                <p>
                    <strong>SURVIVE 30 TURNS.</strong>
                </p>
            </div>
        </div>

        <button
            className="tutorial-close"
            onClick={onClose}
        >
            RETURN TO MENU
        </button>
    </div>
    </div>


    );
}
