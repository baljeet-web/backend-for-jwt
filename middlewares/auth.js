const jwt = require("jsonwebtoken");
module.exports = { 
    verifyToken: async ( req, res, next ) => {
        console.log(req.headers)
        const token = req.headers.authorization
        try {
            if ( token ) {
                const payload = await jwt.verify( token, "secret" );
                req.users = payload;
                next();
            } else {
                res.status( 400 ).json( { error: "Token Required" } );
            }
        } catch (error) {
            return next ( error )
        }
    }
}