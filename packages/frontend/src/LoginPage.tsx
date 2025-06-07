import React, { useActionState } from "react";
import "./LoginPage.css";
import { Link } from "react-router";

interface LoginProps {
    isRegistering: boolean,
    setToken: (token: string) => void,
    updateImageData: () => void,
}

export interface RepsonseMessage{
    type: string,
    message: string,
}

interface tokenResponse{
    username: string,
    token: string,
}

export function LoginPage(props: LoginProps) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();


    const [_result, submitAction, _isPending] = useActionState(
        async (_previousState: RepsonseMessage | null | void | tokenResponse, formData: FormData): Promise<void | RepsonseMessage | null | tokenResponse> => {
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            const json_data = JSON.stringify({
                username: username,
                password: password,
            });

            if(!username || !password){
                return {
                    type: "error",
                    message: "Please input username AND password",
                }
            }

            let authLink = "/auth/login";
            if(props.isRegistering){
                authLink = "/auth/register";
            }

            const response = await fetch(authLink, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: json_data,
            });

            if(response.status >= 400){
                let message = "Invalid username or password."
                if(response.status === 409){
                    message = "User aready exists."
                }
                return {
                    type: "error",
                    message: message,
                };
            }

            const token: tokenResponse = await response.json();
            props.setToken(token.token);
            return token;
        },
        null
    );

    let message = "";
    if(_result){
        if((_result as tokenResponse).token){
            //link to page properly
        }else{
            message = (_result as RepsonseMessage).message;
        }
    }
    return [
            <h2>{props.isRegistering ? "Register a new account" : "Login"}</h2>,
            <form className="LoginPage-form" action={submitAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name="username"/>

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" name="password"/>

                <input type="submit" value="Submit"/>
                {_isPending ? <p>Loading</p> : null}
                <div aria-live="assertive">
                    {message ? <p style={{color: "firebrick"}}>{message}</p> : null}
                </div>
            </form>,
            <Link to="/register">{props.isRegistering ? null : "Don't have an account? Register here"}</Link>
    ];
}
