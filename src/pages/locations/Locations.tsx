import {useEffect, useState} from "react";
import {getInstagramLocations} from "../../api/Instagram.ts";
import type {ILocationInfo, ILocationPost} from "../../utils/types/exploreTypes.ts";
import LoadingSpinner from "../../components/ui/LoadingSpinner.tsx";
import {getProxiedImage} from "../../api/Proxy.ts";
import {useNavigate, useParams} from "react-router";

function Locations() {

    const {id, slug} = useParams<{ id: string, slug: string }>();
    const [title, setTitle] = useState<string>("Países");
    const [countryList, setCountryList] = useState<ILocationInfo[]>([])
    const [cityList, setCityList] = useState<ILocationInfo[]>([])
    const [locationList, setLocationList] = useState<ILocationInfo[]>([])
    const [locationPosts, setLocationPosts] = useState<ILocationPost[]>([])
    const [loading, setLoading] = useState(true);
    const [resolvedSrcs, setResolvedSrcs] = useState<Record<string, string>>({});
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true)

        if (id && slug) {
            getInstagramLocations(id, slug).then((res) => {
                if (res.city_list) {
                    setTitle('Ciudades de ' + res.country_info.name);
                    setCityList(res.city_list)
                }
                if (res.location_list) {
                    setTitle('Lugares de ' + res.city_info.name);
                    setLocationList(res.location_list)
                }
                if (res.posts) {
                    setTitle(res.name)
                    setLocationPosts(res.posts);
                }
                setLoading(false)
            })
            return
        }

        getInstagramLocations().then((res) => {
            if (!res.country_list) return;
            setCountryList(res.country_list)
        }).finally(() => {
            setLoading(false)
        })
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (!locationPosts || locationPosts.length === 0) return;
        Promise.all(
            locationPosts.map(async (topic) => {
                const src = await getProxiedImage(topic.display_uri);
                return {id: topic.id, src};
            })
        ).then((results) => {
            if (!isMounted) return;
            const srcMap = Object.fromEntries(results.map((r) => [r.id, r.src]));
            setResolvedSrcs(srcMap);
        });
        return () => {
            isMounted = false;
        };
    }, [locationPosts]);


    const handleCountryClick = (countryInfo: ILocationInfo) => {
        setLoading(true)
        redirectToLocation(countryInfo.id, countryInfo.slug)
        getInstagramLocations(countryInfo.id, countryInfo.slug).then((res) => {
            if (!res.city_list) return;
            setTitle('Ciudades de ' + res.country_info.name);
            setCityList(res.city_list)
            setLoading(false)
        })
    }

    const handleCityClick = (cityInfo: ILocationInfo) => {
        setLoading(true)
        redirectToLocation(cityInfo.id, cityInfo.slug)
        getInstagramLocations(cityInfo.id, cityInfo.slug).then((res) => {
            if (!res.location_list) return;
            setTitle('Lugares de ' + res.city_info.name);
            setLocationList(res.location_list)
            setLoading(false)
        })
    }

    const handleLocationClick = (locationInfo: ILocationInfo) => {
        setLoading(true)
        redirectToLocation(locationInfo.id, locationInfo.slug)
        getInstagramLocations(locationInfo.id, locationInfo.slug).then((res) => {
            setTitle(res.name)
            setLocationPosts(res.posts)
            setLoading(false)
        })
    }

    const redirectToLocation = (id: string, slug: string) => {
        navigate(`/locations/${id}/${slug}`)
    }

    if (loading) {
        return (
            <LoadingSpinner/>
        )
    }


    return (
        <>
            <h2 className={'text-2xl text-left'}>{title}</h2>
            <div
                className='flex flex-row  gap-3 flex-wrap'>

                {cityList.length === 0 && countryList.map((item, i) => (
                    <button onClick={() => handleCountryClick(item)} type={'button'} key={i}>{item.name}</button>
                ))}

                {locationList.length === 0 && cityList.map((item, i) => (
                    <button onClick={() => handleCityClick(item)} type={'button'} key={i}>{item.name}</button>
                ))}

                {locationPosts.length === 0 && locationList.map((item, i) => (
                    <button onClick={() => handleLocationClick(item)} type={'button'} key={i}>{item.name}</button>
                ))}

                <div className={'grid grid-cols-3 gap-1'}>
                    {locationPosts.map((item) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden group bg-neutral-900 cursor-pointer"
                            onClick={() => window.open(item.display_uri, "_blank")}
                        >
                            {resolvedSrcs[item.id] ? (
                                <img
                                    src={resolvedSrcs[item.id]}
                                    alt=""
                                    className="h-[392px] w-[294px] transition group-hover:brightness-75 object-cover"
                                    draggable={false}
                                />
                            ) : (
                                <div
                                    className="flex items-center justify-center w-full aspect-square text-gray-500">
                                    Cargando…
                                </div>
                            )}
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                style={{pointerEvents: "none"}}
                            >
                                <div className="flex flex-row items-center gap-6 text-lg font-semibold text-white">
                                    <span className="flex items-center gap-1">
                                        <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                                            <path
                                                d="M12 21.638h-.013c-1.104-.012-9.184-7.052-9.184-11.546C2.803 6.134 5.528 3.5 8.847 3.5c1.82 0 3.583 1.01 4.652 2.42C14.61 4.51 16.373 3.5 18.193 3.5c3.319 0 6.044 2.634 6.044 6.592 0 4.494-8.081 11.534-9.184 11.546z"/>
                                        </svg>
                                        {item.like_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                                            <path
                                                d="M21 6.5a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H7.414l-4.707 4.707A1 1 0 0 1 1 23V6.5A2.5 2.5 0 0 1 3.5 4h17z"/>
                                        </svg>
                                        {item.comment_count}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Locations;