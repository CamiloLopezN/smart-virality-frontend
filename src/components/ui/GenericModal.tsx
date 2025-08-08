import {type ReactNode, useEffect, useRef, useState} from "react";
import Button from "./Button.tsx";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {useSnackbar} from "notistack";

interface IGenericModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isModalBlocked: boolean;
}

function GenericModal({children, isOpen, onClose, title, isModalBlocked}: IGenericModalProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animatingIn, setAnimatingIn] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setAnimatingIn(true), 10);
            document.body.style.overflow = "hidden";
        } else if (shouldRender) {
            setAnimatingIn(false);
            timeoutRef.current = setTimeout(() => setShouldRender(false), 220);
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOpen]);

    const handleBlockClick = () => {
        enqueueSnackbar("This modal is blocked. Please fill the fields.", {variant: "warning"});
    }

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm 
            transition-opacity duration-200 
            ${animatingIn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={isModalBlocked ? handleBlockClick : onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={` flex flex-col gap-3 bg-[#1f2b3e] rounded-2xl shadow-xl p-6 min-w-[480px] 
                max-w-[90vw] max-h-[90vh] overflow-auto transition-all duration-200 
                ${animatingIn ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={'flex flex-row justify-between'}>
                    <h2 className="text-2xl font-bold text-[#acc2ef]">{title}</h2>
                    <Button variant={"primary"} label={"Close"} onClick={isModalBlocked ? handleBlockClick : onClose}
                            icon={faGear}/>
                </div>
                {children}
            </div>
        </div>
    );
}

export default GenericModal;
