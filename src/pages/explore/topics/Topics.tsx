import {useEffect, useState} from "react";
import {getInstagramExploreTopic} from "../../../api/Instagram.ts";
import {getProxiedImage} from "../../../api/Proxy.ts";
import type {ITopic} from "../../../utils/types/exploreTypes.ts";
import {useNavigate, useParams} from "react-router";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.tsx";

const NUM_COLS = 4;

function splitIntoColumns<T>(array: T[], numCols: number): T[][] {
    const cols: T[][] = Array.from({length: numCols}, () => []);
    array.forEach((item, idx) => {
        cols[idx % numCols].push(item);
    });
    return cols;
}

function Topics() {
    const {fit_id} = useParams<{ fit_id: string }>();
    const [topics, setTopics] = useState<ITopic[]>([]);
    const [resolvedSrcs, setResolvedSrcs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true);
        getInstagramExploreTopic(fit_id!)
            .then((response) => setTopics(response))
            .finally(() => setLoading(false));
    }, [fit_id]);

    useEffect(() => {
        let isMounted = true;
        if (!topics || topics.length === 0) return;
        Promise.all(
            topics.map(async (topic) => {
                const src = await getProxiedImage(topic.displayUrl);
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
    }, [topics]);

    const columns = splitIntoColumns(topics, NUM_COLS);

    const redirecToExplorer = () => {
        navigate('/explore')
    }

    if (loading) {
        return (
            <LoadingSpinner/>
        )
    }

    return (
        <div className="min-h-full w-full flex flex-col items-center gap-3">
            <div className={'grid grid-cols-3 w-full items-center justify-center'}>
                <button className={'w-1/2'} onClick={redirecToExplorer}>
                    Volver
                </button>
                <h4 className="text-3xl font-bold text-white text-center">
                    {topics.length > 0 ? topics[0].topicName : ''}
                </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl">
                {columns.map((col, colIdx) => (
                    <div key={colIdx} className="grid gap-4">
                        {col.map((topic) => (
                            <div
                                key={topic.id}
                                className="relative rounded-lg overflow-hidden group bg-neutral-900 cursor-pointer"
                                onClick={() => window.open(topic.url, "_blank")}
                            >
                                {resolvedSrcs[topic.id] ? (
                                    <img
                                        src={resolvedSrcs[topic.id]}
                                        alt=""
                                        className="h-full max-w-full w-full rounded-lg transition group-hover:brightness-75 object-cover"
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
                                            <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path
                                                d="M12 21.638h-.013c-1.104-.012-9.184-7.052-9.184-11.546C2.803 6.134 5.528 3.5 8.847 3.5c1.82 0 3.583 1.01 4.652 2.42C14.61 4.51 16.373 3.5 18.193 3.5c3.319 0 6.044 2.634 6.044 6.592 0 4.494-8.081 11.534-9.184 11.546z"/></svg>
                                            {topic.likesCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path
                                                d="M21 6.5a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H7.414l-4.707 4.707A1 1 0 0 1 1 23V6.5A2.5 2.5 0 0 1 3.5 4h17z"/></svg>
                                            {topic.commentsCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Topics;
