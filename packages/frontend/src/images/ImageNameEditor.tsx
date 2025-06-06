import { useState } from "react";
import type { IApiImageData } from "../../../backend/src/common/ApiImageData";

interface INameEditorProps {
    initialValue: string,
    imageId: string,
    images: IApiImageData[],
    setImageData: (data: IApiImageData) => void,
}

export function ImageNameEditor(props: INameEditorProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [input, setInput] = useState(props.initialValue);
    const [isFetchingData, _setIsFetchingData] = useState(false);
    const [fetchHasErrored, _setFetchHasErrored] = useState(false);

    async function handleSubmitPressed() {
        // TODO
        const response = fetch("/api/images"); 
        let hasErrored: boolean = false;
        _setIsFetchingData(true);
        response.then((res) => {
            if(res.status >= 400){
                console.log("has errored")
                hasErrored = true;
                return null
            }

            return res.json();
        }).then((json) => {
            if(json){
                const data = props.images.find((data: IApiImageData) => data._id === props.imageId)
                if(data){
                    const dataCopy = Object.assign(data, {name: input});
                    props.setImageData(dataCopy);
                }else{
                    hasErrored = true;
                }
            }else{
                hasErrored = true;
            }
            _setFetchHasErrored(hasErrored);
            _setIsFetchingData(false); 
            setIsEditingName(false);
        }).catch(() => console.log("image name edit error"))

    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name <input value={input} onChange={e => setInput(e.target.value)}/>
                </label>
                <button disabled={input.length === 0 || isFetchingData} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {isFetchingData ? <p>Working...</p> : null}
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={() => setIsEditingName(true)}>Edit name</button>
                {fetchHasErrored ? <p>Only Author can change name</p> : null}
            </div>
        );
    }
}