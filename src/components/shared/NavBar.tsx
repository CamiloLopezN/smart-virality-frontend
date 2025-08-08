import {useNavigate} from "react-router";
import {useContext, useEffect, useState} from "react";
import {faChartSimple, faCode, faFilter, faGear, faKey, faSave} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button.tsx";
import IconButton from "../ui/IconButton.tsx";
import Input from "../ui/Input.tsx";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {useSnackbar} from "notistack";
import GenericModal from "../ui/GenericModal.tsx";
import {postInstagramLogin, postSendInstagramChallengeCode} from "../../api/locallyInstagram.ts";
import {LoadingContext} from "../../utils/contexts/LoadingContext.ts";
import LinearProgress from "../ui/LinearProgress.tsx";

const navBarOptions = [
    {
        label: 'Filters',
        path: '/filters',
        icon: faFilter,
    }
]

function NavBar() {

    const [isModalVisible, setIsModalVisible] = useState(!localStorage.getItem("instagramAccount"));
    const [isModalBlocked, setIsModalBlocked] = useState(false);
    const navigate = useNavigate();
    const [instagramAccount, setInstagramAccount] = useState<{
        instagramUsername: string;
        instagramPassword: string;
        challengeCode: string;
    }>({
        instagramUsername: "",
        instagramPassword: "",
        challengeCode: "",
    });
    const [isNeedChallenge, setIsNeedChallenge] = useState(false);
    const {isLoading, setIsLoading} = useContext(LoadingContext)
    const {enqueueSnackbar} = useSnackbar()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setInstagramAccount((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        const result = await instagramLogin();
        if (result.success) {
            localStorage.setItem("instagramAccount", JSON.stringify(instagramAccount));
            setIsNeedChallenge(false);
            setIsModalBlocked(false);
            setIsModalVisible(false);
            enqueueSnackbar("Instagram account saved successfully!", {variant: "success"});
        }
        if (result.pending_challenge) {
            enqueueSnackbar("Pending challenge detected, please enter the code sent to your Instagram account.", {variant: "warning"});
            setIsNeedChallenge(true);
        }
        setIsLoading(false);
    }

    const handleChallengeCode = async () => {
        setIsLoading(true);
        const result = await instagramChallengeCode();
        if (result.success) {
            localStorage.setItem("instagramAccount", JSON.stringify(instagramAccount));
            setIsLoading(false);
            setIsNeedChallenge(false);
            setIsModalBlocked(false);
            setIsModalVisible(false);
            enqueueSnackbar("Instagram challenge code sent successfully!", {variant: "success"});
            return
        }
        enqueueSnackbar("Failed to send challenge code, please try again.", {variant: "error"});

    }

    const instagramLogin = async () => {
        try {
            return await postInstagramLogin(instagramAccount.instagramUsername, instagramAccount.instagramPassword);
        } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const instagramChallengeCode = async () => {
        try {
            return await postSendInstagramChallengeCode(instagramAccount.instagramUsername, instagramAccount.challengeCode);
        } catch (error) {
            enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }


    useEffect(() => {
        if (localStorage.getItem("instagramAccount")) {
            const storedAccount = JSON.parse(localStorage.getItem("instagramAccount") || "{}");
            setInstagramAccount(storedAccount);
            return
        }
        if (!localStorage.getItem("instagramAccount")) {
            setIsModalBlocked(true);
        }
    }, []);

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
            <GenericModal isModalBlocked={isModalBlocked} onClose={() => setIsModalVisible(false)}
                          title={"Settings"} isOpen={isModalVisible}>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Input isDisabled={isNeedChallenge} id={"instagramUsername"} label={"Instagram username"}
                           onChange={handleChange}
                           value={instagramAccount.instagramUsername} placeholder={"Enter username..."}
                           icon={faInstagram}
                           isRequired={true} type={"text"}/>
                    <Input isDisabled={isNeedChallenge} id={"instagramPassword"} label={"Instagram password"}
                           onChange={handleChange}
                           value={instagramAccount.instagramPassword} placeholder={"Enter password..."} icon={faKey}
                           isRequired={true} type={"password"}/>

                    {isLoading && (
                        <LinearProgress indeterminate/>
                    )}
                    {isNeedChallenge && (
                        <Input id={"challengeCode"} label={"Instagram code challenge"} onChange={handleChange}
                               value={instagramAccount.challengeCode} placeholder={"Enter the code..."}
                               icon={faCode}
                               isRequired={true} type={"text"}/>
                    )}

                    <div className={'flex items-center justify-end w-full'}>
                        <Button
                            isDisabled={instagramAccount.instagramUsername === "" || instagramAccount.instagramPassword === "" || isLoading}
                            onClick={isNeedChallenge ? handleChallengeCode : handleSave}
                            label={isNeedChallenge ? "Send Challenge Code" : "Save Account"}
                            variant={"secondary"} icon={faSave}/>
                    </div>

                    <span>
                        <span className="text-xs text-[#e0e0e0]">Note: </span>
                        <span className="text-xs text-[#4d648d]">
                            This account will be used to fetch Instagram data.
                            Do not use your personal account, create a new one for this purpose.
                        </span>
                    </span>
                </div>
            </GenericModal>
        </nav>
    );
}

export default NavBar;