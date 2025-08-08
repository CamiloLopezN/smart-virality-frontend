import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

interface IButtonProps {
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
    icon: IconDefinition;
    type?: 'button' | 'submit' | 'reset';
    isDisabled?: boolean;
}

function Button({label, icon, onClick, type, isDisabled, variant}: IButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button disabled={isDisabled} onClick={type === 'submit' ? undefined : onClick} type={type}
                className={`font-bold py-2 px-4 rounded-xl shadow-2xl
                ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background:
                        variant === "primary"
                            ? isHovered
                                ? "#1F3A5F"
                                : "transparent"
                            : isHovered
                                ? "#acc2ef"
                                : "#4d648d",
                    border: variant === 'primary' ? '2px solid white' : 'none',
                    transition: 'background-color 0.5s ease, color 0.3s ease',
                }}
                aria-current="page">
            <span className={'flex flex-row gap-2 items-center'}
                  style={{color: variant === 'primary' ? '#acc2ef' : isHovered ? '#4d648d' : '#acc2ef'}}>
                <FontAwesomeIcon icon={icon}/>
                {label}
            </span>
        </button>
    );
}

export default Button;