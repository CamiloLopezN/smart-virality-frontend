import NavBar from "../components/shared/NavBar.tsx";
import {Outlet} from "react-router";

function MainPage() {
    return (
        <>
            <NavBar/>
            <div className='flex flex-col items-center justify-start
            h-full w-full px-16 py-6 pb-10 gap-8 overflow-y-auto'>
                <Outlet/>
            </div>
        </>
    );
}

export default MainPage;