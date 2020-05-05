'use strict';
module.exports = (app, db, port) => {
    db.on("connected", () => {
        app.listen(port, () => console.log(`Listening on port ${port}`));
    });
};