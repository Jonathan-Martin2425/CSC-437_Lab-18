import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route, useNavigate } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { type IApiImageData } from "../../backend/src/common/ApiImageData.ts";
import { useRef, useState } from "react";
import { ValidRoutes} from "../../src/shared/ValidRoutes.ts"
import { ImageSearchForm } from "./images/ImageSearchForm.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

function App() {
    const [imageData, _setImageData] = useState([] as IApiImageData[]);
    const [isFetchingData, _setIsFetchingData] = useState(true);
    const [fetchHasErrored, _setFetchHasErrored] = useState(false);
    const [searchInput, _setSearchInput] = useState("");
    const [token, setToken] = useState("");

    let ref = useRef(0);
    const navigate = useNavigate();

    function loginWithToken(token: string){
        setToken(token);
        navigate("/");
        updateImageData("", token);
    }

    function updateImageData(q: string = "", possibleToken: string = ""){
        const query = new URLSearchParams;
        query.append("q", q);
        let curToken = token;
        if(possibleToken) curToken = possibleToken;
        const response = fetch("/api/images?" + query, {
            headers: {
                "Authorization": `Bearer ${curToken}`
            }
        }); 
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

    function putImageData(data: IApiImageData){
        const query = new URLSearchParams;
        query.append("name", data.name);
        fetch("/api/images/" + data._id + "?" + query, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
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
    }

    const searchForm = <ImageSearchForm searchString={searchInput} onSearchStringChange={_setSearchInput} onSearchRequested={handleImageSearch}/>;

    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout /*darkMode={darkModeClass}*//>}>
                <Route index element={<ProtectedRoute authToken={token}><AllImages imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored} searchPanel={searchForm}/></ProtectedRoute>}/>
                <Route path={ValidRoutes.IMAGES_ID} element={<ProtectedRoute authToken={token}><ImageDetails imageData={imageData} isFetchingData={isFetchingData} fetchHasErrored={fetchHasErrored} setImageData={putImageData}/></ProtectedRoute>}/>
                <Route path={ValidRoutes.UPLOAD} element={<ProtectedRoute authToken={token}><UploadPage/></ProtectedRoute>}/>
                <Route path={ValidRoutes.LOGIN} element={<LoginPage isRegistering={false} setToken={loginWithToken} updateImageData={updateImageData}/>}/>
                <Route path={ValidRoutes.REGISTER} element={<LoginPage isRegistering={true} setToken={loginWithToken} updateImageData={updateImageData}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
