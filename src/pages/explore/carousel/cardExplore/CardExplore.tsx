interface ICardExploreProps {
    subTitle: string,
    src: string,
    onClick?: () => void
}

function CardExplore({subTitle, src, onClick}: ICardExploreProps) {
    return (
        <div
            onClick={onClick}
            className="
        relative flex flex-col items-center justify-center
        cursor-pointer rounded-xl overflow-hidden
        shadow-md hover:shadow-lg transition-shadow duration-200
        w-[150px] min-w-[150px] max-w-[150px]
        h-[266px] min-h-[266px] max-h-[266px]
        bg-black
      "
        >
            <img
                src={src}
                alt={subTitle}
                className="
          w-full h-full object-cover
          select-none pointer-events-none
        "
                draggable={false}
            />
            {/* Overlay + subtítulo */}
            <div
                className="
          absolute bottom-0 left-0 w-full px-3 py-2
          bg-gradient-to-t from-black/85 via-black/60 to-transparent
          flex items-end
        "
                style={{height: "62px"}}
            >
        <span
            className="
            text-white font-semibold text-base drop-shadow
            truncate
          "
            style={{
                textShadow: "0 2px 6px rgba(0,0,0,0.7)",
            }}
        >
          {subTitle}
        </span>
            </div>
        </div>
    );
}

export default CardExplore;
