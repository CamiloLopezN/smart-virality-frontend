import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import type {ChangeEvent} from "react";

interface IInputProps {
    id: string;
    isDisabled?: boolean;
    label: string;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void
    value: string | number;
    placeholder: string;
    icon: IconDefinition
    isRequired: boolean;
    type: 'text' | 'number' | 'email' | 'password';
}


function Input({isDisabled, label, onChange, value, placeholder, icon, id, isRequired, type}: IInputProps) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={id}
                   className="mb-1 text-sm font-medium text-[#acc2ef]">
                {label}
            </label>
            <div className="relative">
                <div
                    className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon icon={icon} color={'#acc2ef'}/>
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    className={'block w-full p-3 ps-10 text-sm rounded-lg ' +
                        'bg-[#0F1C2E] text-[#FFFFFF]'}
                    placeholder={placeholder}
                    required={isRequired}
                />
            </div>
        </div>
    );
}

export default Input;