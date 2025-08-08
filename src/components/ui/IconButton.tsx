import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";

interface IIconButtonProps {
    onClick?: () => void;
    icon: IconDefinition;
}

function IconButton({ icon, onClick }: IIconButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className="py-2 px-4 rounded-xl shadow-soft transition cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isHovered ? "#1F3A5F" : "transparent",
                transition: 'background-color 0.5s ease'
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                size={'lg'}
                color={"#acc2ef"}
                style={{
                    transition: "transform 0.6s cubic-bezier(.4,2,.7,.9)",
                    transform: isHovered ? "rotate(360deg)" : "rotate(0deg)"
                }}
            />
        </button>
    );
}

export default IconButton;
