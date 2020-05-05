'use strict';

module.exports=(app, httpPort) => {
    app.enable('trust proxy');

    app.use ((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
    db.on("connected", () => {
    app.listen(httpPort);
    });
};


