import { Link } from "react-router";
import type { IApiImageData } from "../../../backend/src/common/ApiImageData.ts";
import "./Images.css";

interface IImageGridProps {
    images: IApiImageData[];
}

export function ImageGrid(props: IImageGridProps) {
    const imageElements = props.images.map((image) => (
        <div key={image._id} className="ImageGrid-photo-container">
            <Link to={"/images/" + image._id} onClick={() => console.log(image)}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <div className="ImageGrid">
            {imageElements}
        </div>
    );
}
