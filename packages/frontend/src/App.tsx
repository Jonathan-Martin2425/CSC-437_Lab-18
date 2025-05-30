import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { type IApiImageData } from "../../backend/src/common/ApiImageData.ts";
import { useEffect, useState } from "react";
import { ValidRoutes} from "../../src/shared/ValidRoutes.ts"

function App() {
    const [imageData, _setImageData] = useState([] as IApiImageData[]);
    const [isFetchingData, _setIsFetchingData] = useState(true);
    const [fetchHasErrored, _setFetchHasErrored] = useState(false);

    useEffect(() => {
        // Code in here will run when App is created
        // (Note in dev mode App is created twice)
        const response = fetch("/api/images"); 
        response.then((res) => {
            if(res.status >= 400){
                console.log("has errored")
                _setFetchHasErrored(true);
                return null;
            }

            return res.json();
        }).then((json) => {
            if(json){
                const images: IApiImageData[] = json as IApiImageData[];
                if(images) _setImageData(images)
                console.log(images);
            }else{
                _setFetchHasErrored(true)
            }
            _setIsFetchingData(false); 
        })
    }, []);

    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout /*darkMode={darkModeClass}*//>}>
                <Route index element={<AllImages imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored}/>}/>
                <Route path={ValidRoutes.IMAGES + "/:imageId"} element={<ImageDetails imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored} setImageData={_setImageData}/>}/>
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />}/>
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />}/>
            </Route>
        </Routes>
    );
}

export default App;
