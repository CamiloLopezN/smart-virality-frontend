import {useNavigate} from "react-router";
import ApifyKeyModal from "./ApifyKeyModal.tsx";
import {useState} from "react";

const navBarOptions = [
    {
        label: 'Trending',
        path: '/explore'
    },
    {
        label: 'Locations',
        path: '/locations'
    },
    {
        label: 'Filters',
        path: '/filters'
    }
]

function NavBar() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();


    return (
        <nav className="bg-white border-gray-200 dark:bg-[#454545] ">
            <div className="flex flex-wrap items-center justify-between mx-auto px-16 py-4">
                <a href="https://www.bicode.co/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://www.bicode.co/wp-content/uploads/2022/10/logo-header-480x204.png" className="h-12"
                         alt="Flowbite Logo"/>
                </a>
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg
                    md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                        {navBarOptions.map((navBar) => (
                            <li key={navBar.path}>
                                <button onClick={() => navigate(navBar.path)}
                                        className="bg-primary-100 hover:bg-primary-200 text-text-100 font-bold py-2
                                        px-4 rounded-xl shadow-soft transition cursor-pointer"
                                        style={{background: 'transparent', border: '2px solid white'}}
                                        aria-current="page">
                                    {navBar.label}
                                </button>
                            </li>
                        ))}

                        <button className="bg-primary-100 hover:bg-primary-200 text-text-100 font-bold py-2
                                px-4 rounded-xl shadow-soft transition cursor-pointer"
                                onClick={() => setIsModalVisible(true)}>
                            Update Apify Key
                        </button>
                    </ul>
                </div>
            </div>
            <ApifyKeyModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
        </nav>
    );
}

export default NavBar;