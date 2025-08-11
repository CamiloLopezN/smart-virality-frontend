import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { type ChangeEvent, useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface IInputProps {
    id: string;
    isDisabled?: boolean;
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    value: string | number;
    placeholder: string;
    icon: IconDefinition;
    isRequired: boolean;
    type: "text" | "number" | "email" | "password";
}

function Input({
                   isDisabled,
                   label,
                   onChange,
                   value,
                   placeholder,
                   icon,
                   id,
                   isRequired,
                   type,
               }: IInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (type === "number") {
            const raw = e.target.value; // string
            // Permitir vacío mientras el usuario edita
            if (raw === "" || raw === "-") {
                onChange(e);
                return;
            }
            const n = Number(raw);
            if (Number.isNaN(n)) return; // ignora entrada inválida
            const clamped = Math.max(1, Math.min(50, n));
            if (n !== clamped) {
                e.target.value = String(clamped);
            }
        } else if (type === "text") {
            if (e.target.value.length > 50) {
                e.target.value = e.target.value.slice(0, 28);
            }
        }
        onChange(e);
    };

    return (
        <div className="flex flex-col w-full">
            <label htmlFor={id} className="mb-1 text-sm font-medium text-[#acc2ef]">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon icon={icon} color={"#acc2ef"} />
                </div>

                <input
                    type={type === "password" && isPasswordVisible ? "text" : type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={
                        "block w-full p-3 ps-10 text-sm rounded-lg bg-[#0F1C2E] text-[#FFFFFF]"
                    }
                    placeholder={placeholder}
                    required={isRequired}
                    // Reglas:
                    // - number: entre 1 y 50 (no usar maxLength en number)
                    // - text: máximo 28 caracteres
                    min={type === "number" ? 1 : undefined}
                    max={type === "number" ? 50 : undefined}
                    step={type === "number" ? 1 : undefined}
                    inputMode={type === "number" ? "numeric" : undefined}
                    maxLength={type === "text" ? 50 : undefined}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                    >
                        <FontAwesomeIcon
                            icon={isPasswordVisible ? faEyeSlash : faEye}
                            color={"#acc2ef"}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Input;
