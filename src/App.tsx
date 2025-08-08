import MainPage from "./pages/MainPage.tsx";
import {Navigate, Route, Routes} from "react-router";
import Explore from "./pages/explore/Explore.tsx";
import Topics from "./pages/explore/topics/Topics.tsx";
import ExploreRoot from "./pages/explore/ExploreRoot.tsx";
import Locations from "./pages/locations/Locations.tsx";
import Filters from "./pages/filters/Filters.tsx";
import {SnackbarProvider} from "notistack";
import {LoadingContext} from "./utils/contexts/LoadingContext.ts";
import {useState} from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner.tsx";
import {CacheImagesContext, type ICacheImagesURL} from "./utils/contexts/CacheImagesContext.ts";

function App() {

    const [cacheImagesURL, setCacheImagesURL] = useState<ICacheImagesURL[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <SnackbarProvider>
            <CacheImagesContext.Provider value={{cacheImagesURL, setCacheImagesURL}}>
                <LoadingContext.Provider value={{isLoading: isLoading, setIsLoading: setIsLoading}}>
                    <Routes>
                        <Route element={<MainPage/>}>
                            <Route path="/" element={<Navigate to="/explore" replace/>}/>
                            <Route path={'/explore'} element={<Explore/>}>
                                <Route index element={<ExploreRoot/>}/>
                                <Route path="topics/:fit_id" element={<Topics/>}/>
                            </Route>
                            <Route path={'/locations/:id?/:slug?'} element={<Locations/>}/>
                            <Route path={'/filters'} element={<Filters/>}/>
                        </Route>
                    </Routes>
                    {/*{isLoading && <LoadingSpinner/>}*/}
                </LoadingContext.Provider>
            </CacheImagesContext.Provider>
        </SnackbarProvider>
    )
}

export default App
