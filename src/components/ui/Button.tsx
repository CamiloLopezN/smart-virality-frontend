import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";

interface IButtonProps {
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    onClick?: (e: React.FormEvent) => void;
    icon: IconDefinition;
    type?: 'button' | 'submit' | 'reset';
    isDisabled?: boolean;
}

function Button({label, icon, onClick, type, isDisabled, variant}: IButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const getBackgroundColor = () => {
        if (variant === 'primary') {
            return isHovered ? '#3D5A80' : 'transparent';
        }
        if (variant === 'secondary') {
            return isHovered ? '#acc2ef' : '#4d648d';
        }
        if (variant === 'danger') {
            return isHovered ? '#374357' : '#0F1C2E';
        }
    }

    const getColor = () => {
        if (variant === 'primary') {
            return isHovered ? '#0F1C2E' : '#acc2ef';
        }
        if (variant === 'secondary') {
            return isHovered ? '#1F3A5F' : '#acc2ef';
        }
        if (variant === 'danger') {
            return isHovered ? '#ff6b6b' : '#ff4c4c';
        }
    }

    return (
        <button disabled={isDisabled} onClick={type === 'submit' ? undefined : onClick} type={type}
                className={`font-bold py-2 px-4 rounded-xl shadow-2xl
                ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: getBackgroundColor(),
                    border: variant === 'primary' ? '2px solid white' : 'none',
                    transition: 'background-color 0.5s ease, color 0.3s ease',
                }}
                aria-current="page">
            <span className={'flex flex-row gap-2 items-center'}
                  style={{color: getColor()}}>
                <FontAwesomeIcon icon={icon}/>
                {label}
            </span>
        </button>
    );
}

export default Button;