import {createContext, type Dispatch, type SetStateAction} from 'react';

export interface ICacheImagesURL {
    url: string;
    proxyUrl: string;
}

export interface ICacheImagesContext {
    cacheImagesURL: ICacheImagesURL[]
    setCacheImagesURL: Dispatch<SetStateAction<ICacheImagesURL[]>>
}

export const CacheImagesContext = createContext<ICacheImagesContext>({
    cacheImagesURL: [],
    setCacheImagesURL: () => {
    }
});
