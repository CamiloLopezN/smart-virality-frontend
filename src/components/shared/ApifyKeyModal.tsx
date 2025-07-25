import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

interface IApifyKeyModalProps {
    isModalVisible: boolean;
    setIsModalVisible: Dispatch<SetStateAction<boolean>>;
}

function ApifyKeyModal({isModalVisible, setIsModalVisible}: IApifyKeyModalProps) {
    const [apifyKey, setApifyKey] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isModalVisible) {
            const storedKey = localStorage.getItem("apifyKey") || "";
            setApifyKey(storedKey);
            setSaved(false);
        }
    }, [isModalVisible]);

    const handleChange = (e) => {
        setApifyKey(e.target.value);
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem("apifyKey", apifyKey.trim());
        setSaved(true);
    };

    if (!isModalVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-6 border border-blue-100 relative">
                <button
                    onClick={() => setIsModalVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 text-xl font-bold focus:outline-none"
                    aria-label="Close"
                    type="button"
                >
                    <FontAwesomeIcon icon={faClose} color={'white'}/>
                </button>
                <h2 className="text-xl font-bold text-center text-[#2d2d2d]">Apify API Key</h2>
                <input
                    type="text"
                    value={apifyKey}
                    onChange={handleChange}
                    className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition w-full text-gray-900"
                    placeholder="Enter your Apify API Key"
                    autoFocus
                />
                <button
                    onClick={handleSave}
                    className="text-white font-semibold rounded-lg "
                    disabled={!apifyKey.trim()}
                >
                    Save
                </button>
                {saved && (
                    <span className="text-green-600 text-center font-medium transition">
                        Key saved successfully!
                    </span>
                )}
            </div>
        </div>
    );
}

export default ApifyKeyModal;
