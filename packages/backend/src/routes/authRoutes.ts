import { CredentialsProvider } from "CredentialsProvider";
import { Application, Response, Request} from "express";
import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
    username: string;
}

export function registerAuthRoutes(app: Application, credProvider: CredentialsProvider){
    function generateAuthToken(username: string, jwtSecret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const payload: IAuthTokenPayload = {
                username
            };
            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: "1d" },
                (error, token) => {
                    if (error) reject(error);
                    else resolve(token as string);
                }
            );
        });
    }
    
    app.post("/auth/register", (req: Request, res: Response) => {
        const json = req.body;
        if(json){
            const username = json.username;
            const password = json.password;
            if(username && password){
                credProvider.registerUser(username, password).then((success) => {
                    if(success){
                        res.status(201).send()
                    }else{
                        res.status(409).send({
                            error: "Bad Request",
                            message: "Usernames already taken",
                        });
                    }
                })
            }else {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Missing username or password",
                });
            }
        }else{
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username or password"
            });
        }
    })

    app.post("/auth/login", (req: Request, res: Response) => {
        const json = req.body;
        if(json){
            const username = json.username;
            const password = json.password;
            if(username && password){
                credProvider.verifyPassword(username, password).then((verification) => {
                    if(verification){
                        const token = generateAuthToken(username, app.locals.JWT_SECRET).then((token) => {
                            res.status(200).send({
                                username: username,
                                token: token
                            });
                        })
                        
                    }else{
                        res.status(401).send({
                            error: "Unauthorized",
                            message: "Incorrect username or password",
                        })
                    }
                })
            }else {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Missing username or password",
                });
            }
        }else{
            res.status(400).send({
                error: "Bad Request",
                message: "Missing username or password"
            });
        }
    })
}