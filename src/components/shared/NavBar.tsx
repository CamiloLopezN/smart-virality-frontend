import {useNavigate} from "react-router";
import {useState} from "react";
import {faChartSimple, faFilter, faGear} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button.tsx";
import IconButton from "../ui/IconButton.tsx";
import GenericModal from "../ui/GenericModal.tsx";

const navBarOptions = [
    {
        label: 'Trending',
        path: '/explore',
        icon: faChartSimple,
    },
    {
        label: 'Filters',
        path: '/filters',
        icon: faFilter,
    }
]

function NavBar() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();


    return (
        <nav className="border-gray-200 bg-gradient-to-r from-[#0f1c2e] to-[#1f2b3e]">
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
                                <Button variant={"primary"} label={navBar.label}
                                        onClick={() => navigate(navBar.path)} icon={navBar.icon}/>
                            </li>
                        ))}

                        <IconButton icon={faGear} onClick={() => setIsModalVisible(true)}/>
                    </ul>
                </div>
            </div>
            <GenericModal isOpen={isModalVisible}>
                <div className="flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#acc2ef]">Settings</h2>
                    <p className="text-[#acc2ef] mb-4">This feature is under development.</p>
                    <Button variant={"primary"} label={"Close"} onClick={() => setIsModalVisible(false)}
                            icon={faGear}/>
                </div>
            </GenericModal>
        </nav>
    );
}

export default NavBar;