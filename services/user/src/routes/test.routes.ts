import { Router } from "express";
import ApiResponseParser from "../interfaces/api_response.parser";
import User from "../models/user";
import { UserTools } from "../models/user";
const router = Router();

router.all("/*", (req, res, next) => {
    const user = new User({ email: "test@test.fr", phone: "33650717809", lastnames: "COMPTE", firstnames: "test", password: "password" });
    const modifiedData = { phone: "0000" };
    const finalUser = user.set(modifiedData);
    const ApiObject = { statusCode: 501, message: "User creation", data: { originalUser: user.get(), userModified: finalUser, UserModifiedData: modifiedData } };
    
    UserTools.create(finalUser);

    return ApiResponseParser.response(res, ApiObject);
}
);

export { router as testRouter };