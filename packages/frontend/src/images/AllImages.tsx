import { type IApiImageData } from "./../../../backend/src/common/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface AllImagesProps {
    imageData: IApiImageData[];
    isFetchingData: boolean,
    fetchHasErrored: boolean,
    searchPanel : React.ReactNode,
}

export function AllImages(props: AllImagesProps ) {
    return[
        props.searchPanel,
        <h2>All Images</h2>,
        <ImageGrid images={props.imageData} />
    ];
}
