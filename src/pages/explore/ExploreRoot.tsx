import Categories from "./categories/Categories.tsx";
import Carousel from "./carousel/Carousel.tsx";
import {useEffect, useState} from "react";
import {getInstagramExplore} from "../../api/Instagram.ts";
import type {IInstagramExplore} from "../../utils/types/exploreTypes.ts";


function Explore() {

    const [instagramExplore, setInstagramExplore] = useState<IInstagramExplore>({
        pills: [],
        fit_sections: []
    });

    useEffect(() => {
        getInstagramExplore().then((res) => {
            setInstagramExplore(res);
        });
    }, []);

    return (
        <>
            <h3 className={'text-4xl'}>
                Explore the newest trends
            </h3>
            <Categories pills={instagramExplore.pills}/>
            {instagramExplore.fit_sections.map((section) => {
                return (
                    <Carousel key={section.l1.fit_id} fitSections={section}/>
                );
            })}
        </>
    );
}

export default Explore;