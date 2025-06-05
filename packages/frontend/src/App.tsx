import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { type IApiImageData } from "../../backend/src/common/ApiImageData.ts";
import { useEffect, useRef, useState } from "react";
import { ValidRoutes} from "../../src/shared/ValidRoutes.ts"
import { ImageSearchForm } from "./images/ImageSearchForm.tsx";

function App() {
    const [imageData, _setImageData] = useState([] as IApiImageData[]);
    const [isFetchingData, _setIsFetchingData] = useState(true);
    const [fetchHasErrored, _setFetchHasErrored] = useState(false);
    const [searchInput, _setSearchInput] = useState("");

    let ref = useRef(0);

    function updateImageData(q: string = ""){
        const query = new URLSearchParams;
        query.append("q", q);
        const response = fetch("/api/images?" + query); 
        ref.current = ref.current + 1;
        const curRef = ref.current;
        response.then((res) => {
            if(res.status >= 400){
                console.log("image Data fetch error code") 
                _setFetchHasErrored(true);
                return null;
            }

            return res.json();
        }).then((json) => {
            if(json){
                if(curRef !== ref.current) {return null};
                const images: IApiImageData[] = json as IApiImageData[];
                if(images) _setImageData(images)
            }else{
                _setFetchHasErrored(true)
            }
            _setIsFetchingData(false); 
        }).catch(() => console.log("updateImageData error"));
    }

    useEffect(() => {
        // Code in here will run when App is created
        // (Note in dev mode App is created twice)
        updateImageData();
    }, []);

    function putImageData(data: IApiImageData){
        const query = new URLSearchParams;
        query.append("name", data.name);
        fetch("/api/images/" + data._id + "?" + query, {
            method: "PUT",
        }).then((res) => {
            if(res.status >= 400){
                console.log("image edit fetch error") 
                _setFetchHasErrored(true);
                return null;
            }
        }).catch();

        updateImageData();
    }

    function handleImageSearch(){
        updateImageData(searchInput);
        console.log(searchInput);
    }

    const searchForm = <ImageSearchForm searchString={searchInput} onSearchStringChange={_setSearchInput} onSearchRequested={handleImageSearch}/>;

    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout /*darkMode={darkModeClass}*//>}>
                <Route index element={<AllImages imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored} searchPanel={searchForm}/>}/>
                <Route path={ValidRoutes.IMAGES_ID} element={<ImageDetails imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored} setImageData={putImageData}/>}/>
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />}/>
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />}/>
            </Route>
        </Routes>
    );
}

export default App;
