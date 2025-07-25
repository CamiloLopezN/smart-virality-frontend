import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleLeft, faArrowAltCircleRight} from "@fortawesome/free-solid-svg-icons";

interface ICircularButtonProps {
    isNext: boolean;
    isActive: boolean;
    isAbsolute?: boolean;
}

function CircularButton({isNext, isActive, isAbsolute = false}: ICircularButtonProps) {
    return (
        <>
            {isActive && (
                <button
                    className={'flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 ' +
                    'hover:bg-gray-300 transition-colors duration-200 cursor-pointer' + isAbsolute ? 'absolute' : 'relative'}>
                    <FontAwesomeIcon icon={isNext ? faArrowAltCircleRight : faArrowAltCircleLeft}/>
                </button>
            )}
        </>
    );
}

export default CircularButton;