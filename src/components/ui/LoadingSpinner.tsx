
function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-99 flex items-center justify-center backdrop-blur-xs">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-20 h-20 animate-spin-slow">
                    <div className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2">
                            <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce1" />
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 bg-blue-400 rounded-full animate-bounce2" />
                        </div>
                        <div className="absolute left-0 bottom-0">
                            <div className="w-5 h-5 bg-blue-300 rounded-full animate-bounce3" />
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-lg font-semibold text-white tracking-wide animate-pulse">
                    Loading, please wait...
                </div>
            </div>
            <style>
                {`
                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg);}
                }
                .animate-spin-slow {
                  animation: spin-slow 2.2s linear infinite;
                }
                @keyframes bounce1 {
                  0%, 80%, 100% { transform: translateY(0);}
                  40% { transform: translateY(-18px);}
                }
                @keyframes bounce2 {
                  0%, 80%, 100% { transform: translateY(0);}
                  30% { transform: translateY(-14px);}
                }
                @keyframes bounce3 {
                  0%, 80%, 100% { transform: translateY(0);}
                  50% { transform: translateY(-12px);}
                }
                .animate-bounce1 {
                  animation: bounce1 1.4s infinite;
                }
                .animate-bounce2 {
                  animation: bounce2 1.4s infinite 0.2s;
                }
                .animate-bounce3 {
                  animation: bounce3 1.4s infinite 0.4s;
                }
                `}
            </style>
        </div>
    );
}

export default LoadingSpinner;
