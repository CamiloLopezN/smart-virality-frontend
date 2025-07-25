import {useEffect, useState} from "react";
import CardExplore from "./cardExplore/CardExplore.tsx";
import type {IFitSections, ISubTopic} from "../../../utils/types/exploreTypes.ts";
import {getProxiedImage} from "../../../api/Proxy.ts";
import {useNavigate} from "react-router";

interface ICarouselProps {
    fitSections: IFitSections
}

function Carousel({fitSections}: ICarouselProps) {

    const [resolvedSrcs, setResolvedSrcs] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        Promise.all(
            fitSections.subtopic.map(async (subTopic) => {
                const url = subTopic.medias[0].display_uri;
                const src = await getProxiedImage(url);
                return {fit_id: subTopic.fit_id, src};
            })
        ).then(results => {
            if (!isMounted) return;
            const srcMap = Object.fromEntries(results.map(r => [r.fit_id, r.src]));
            setResolvedSrcs(srcMap);
        });
        return () => {
            isMounted = false
        };
    }, [fitSections]);

    const getFicSectionsSubTopic = async (fitSectionSubTopic: ISubTopic) => {
        navigate(`/explore/topics/${fitSectionSubTopic.fit_id}`);
    }

    const getFitSection = async () => {
        navigate(`/explore/topics/${fitSections.l1.fit_id}`);
    }


    return (
        <div className='flex flex-col items-start w-full gap-4'>
            <button className='cursor-pointer' onClick={() => getFitSection()}>
                {fitSections.l1.name}
            </button>
            <div className={'flex flex-row items-center gap-4 w-full overflow-hidden relative'}>
                <div className='flex flex-row items-center gap-5 overflow-x-auto scrollbar-hide  py-2'>
                    {fitSections.subtopic.map((subTopic) => (
                        <CardExplore
                            onClick={() => getFicSectionsSubTopic(subTopic)}
                            key={subTopic.fit_id}
                            src={resolvedSrcs[subTopic.fit_id] || ""} // Muestra vacío si aún no se resolvió
                            subTitle={subTopic.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carousel;
