const axios = require("axios");
const axiosInstance = axios.create({
    baseURL: process.env.ULTIMATE_UTILITY_AUTH_URL,
    withCredentials: true
});

const auth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        // let token;
        
        if(!token) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
            } else {
                throw new Error();
            }
        }

        // if(!author) throw new Error({ error: "Please authenticate." });
        let verifyToken = await checkIfValidToken(token);
        console.log("step 1:", verifyToken, req.body?.code)
        if(!verifyToken) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
                verifyToken = await checkIfValidToken(token);
                console.log("step 2:", verifyToken)
            } else {
                throw new Error();
            }
        }
        const {name, _id} = verifyToken;
        console.log(verifyToken)
        if(!name) throw new Error();

        req.token = token;
        req.userName = name;
        req.userId = _id;
        next();
    } catch (e) {
        console.log(e)
        res.status(401).send({ error: "Please authenticate." });
    }
}

const checkIfValidCode = async (code) => {
    try {
        const response = await axiosInstance.post("/sso/crossAppLogin", { code });
        return response.data.data;
    } catch (e) {
        return undefined;
    };
}

const checkIfValidToken = async (token) => {
    try {
        const response = await axiosInstance.post("/user/me", { token });
        return response.data.data;
    } catch (e) {
        return undefined;
    }
}

module.exports = auth;