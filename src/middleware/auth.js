const jwt = require("jsonwebtoken")


// =================================[ Authentication ]================================
const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, message: "token must be present", });

        //-----(Decoding Token)
        jwt.verify(token, "GroupNumber4", (error, decoded) => {
            if (error) {
                return res.status(401).send({ status: false, message: error.message })
            } 
            else {
                req["UserId"] = decoded.UserId;
                next()
            }
        })
        
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports.authenticate = authenticate;

//.......................................................................................................

