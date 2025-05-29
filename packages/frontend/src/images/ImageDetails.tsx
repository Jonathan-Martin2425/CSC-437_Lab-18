
import { type IApiImageData } from "./../../../backend/src/common/ApiImageData.ts";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor.tsx";

interface IImageDetailsProps {
    imageData: IApiImageData[],
    setImageData: (data: IApiImageData[]) => void,
    isFetchingData: boolean,
    fetchHasErrored: boolean,
}

export function ImageDetails(props: IImageDetailsProps) {
    const {imageId} = useParams();
    const image = props.imageData.find(image => image.id === imageId);
    if (!image) {
        return <h2>Image not found</h2>;
    }

    return [
        <h2>{image.name}</h2>,
        <p>By {image.author.username}</p>,
        <ImageNameEditor imageId={image.id} initialValue={image.name} setImageData={props.setImageData} images={props.imageData}/>,
        <img className="ImageDetails-img" src={image.src} alt={image.name} />,
    ];
}
