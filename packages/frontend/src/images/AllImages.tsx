import { type IImageData } from "../MockAppData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface AllImagesProps {
    imageData: IImageData[];
}

export function AllImages(props: AllImagesProps ) {
    return[
        <h2>All Images</h2>,
        <ImageGrid images={props.imageData} />
    ];
}
