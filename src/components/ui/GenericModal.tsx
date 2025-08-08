import { ReactNode, useEffect, useState, useRef } from "react";

interface IGenericModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose?: () => void;
}

function GenericModal({ children, isOpen, onClose }: IGenericModalProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animatingIn, setAnimatingIn] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Necesario para activar transición de entrada
            setTimeout(() => setAnimatingIn(true), 10);
            document.body.style.overflow = "hidden";
        } else if (shouldRender) {
            setAnimatingIn(false); // Activar transición de salida
            timeoutRef.current = setTimeout(() => setShouldRender(false), 220);
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        transition-opacity duration-200
        ${animatingIn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`
          bg-[#0F1C2E] rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw] max-h-[90vh] overflow-auto
          transition-all duration-200
          ${animatingIn ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}
        `}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default GenericModal;
