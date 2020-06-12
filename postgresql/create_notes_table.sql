DROP TABLE IF EXISTS notes;

CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users_skate(id) NOT NULL,
    trick_name TEXT NOT NULL,
    leftFootAngle TEXT NOT NULL,
    leftFootUpDown TEXT NOT NULL,
    leftFootRightLeft TEXT NOT NULL,
    rightFootAngle TEXT NOT NULL,
    rightFootUpDown TEXT NOT NULL,
    rightFootRightLeft TEXT NOT NULL,
    note TEXT
);