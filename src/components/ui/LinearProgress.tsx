import React from "react";

interface ILinearProgressProps {
    value?: number;
    indeterminate?: boolean;
    className?: string;
}

const LinearProgress: React.FC<ILinearProgressProps> = ({
                                                           value = 0,
                                                           indeterminate = false,
                                                           className = "",
                                                       }) => {
    return (
        <div className={`w-full h-2 bg-[#0F1C2E] rounded-full overflow-hidden ${className}`}>
            {indeterminate ? (
                <div className="h-full bg-[#cee8ff] animate-linear-indeterminate rounded-full"
                     style={{ width: "50%" }} />
            ) : (
                <div
                    className="h-full bg-[#cee8ff] transition-all duration-300 rounded-full"
                    style={{ width: `${value}%` }}
                />
            )}
            <style>
                {`
        @keyframes linear-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-linear-indeterminate {
          animation: linear-indeterminate 1.5s infinite linear;
        }
        `}
            </style>
        </div>
    );
};

export default LinearProgress;
