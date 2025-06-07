import { useActionState, useId, useState } from "react";
import { type RepsonseMessage } from "./LoginPage"

interface UploadPageProps{
    token: string,
}

export function UploadPage(props: UploadPageProps) {
    const fileUploadID = useId();
    const [imageURL, setImageURL] = useState("");

    function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>){
        const files = e.target.files;
        if(files){
            const file = files[0];
            readAsDataURL(file).then((result) => {
                setImageURL(result);
            }).catch();
        }

    }

    function readAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = (err) => reject(err);
        });
    }

    const [_result, submitAction, _isPending] = useActionState(async (_previousState: RepsonseMessage | null | void, formData: FormData) => {

        const response = await fetch("/api/images", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${props.token}`
            },
            body: formData,
        });

        if((await response).status > 400){
            return {
                type: "error",
                message: "Fetch Error",
            };
        }
    },
    null);


    let message = "";
    if(_result){
        message = (_result as RepsonseMessage).message;
    }
    if(_isPending){
        message = "Submitting";
    }
    return [
        <h2>Upload</h2>,
        <form action={submitAction}>
            <div>
                <label htmlFor={fileUploadID}>Choose image to upload: </label>
                <input
                    id={fileUploadID}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileUploadChange}
                    required
                />
            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input name="name" required />
                </label>
            </div>

            <div> {/* Preview img element */}
                {
                    imageURL ? 
                    <img style={{width: "20em", maxWidth: "100%"}} src={imageURL} alt="" /> : 
                    <img style={{width: "20em", maxWidth: "100%"}} alt="" />
                }
            </div>

            {_isPending ? null : <input type="submit" value="Confirm upload" />}

            <div aria-live="assertive">
                {
                    message ? 
                    <p>{message}</p>
                    :
                    null
                }
            </div>
        </form>
    ];
}
