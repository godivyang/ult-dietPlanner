import axios from "axios";
const axiosInstance = axios.create({
    baseURL: process.env.ULTIMATE_UTILITY_AUTH_URL,
    withCredentials: true
});

const auth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        if(req.body?.code || !token) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
                // console.log("step2", token)
            } else {
                throw new Error();
            }
        }

        let verifyToken = await checkIfValidToken(token);
        
        if(!verifyToken) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
                verifyToken = await checkIfValidToken(token);
                // console.log("step 2:", verifyToken)
                // console.log("step3", token)
            } else {
                throw new Error();
            }
        }
        const {name, _id} = verifyToken;
        
        if(!name) throw new Error();

        req.token = token;
        req.userName = name;
        req.userId = _id;
        next();
    } catch (e) {
        // console.log(e)
        res.status(401).send({
            success: false,
            details: {
                code: "AUTH_ERROR",
                message: "Authentication failed!"
            }
        });
    }
}

const checkIfValidCode = async (code) => {
    // console.log(axiosInstance.defaults.baseURL)
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

export default auth;