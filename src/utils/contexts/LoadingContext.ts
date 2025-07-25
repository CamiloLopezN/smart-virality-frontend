import {createContext, type Dispatch, type SetStateAction} from 'react';

export interface ILoadingContext {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const LoadingContext = createContext<ILoadingContext>({
    isLoading: false,
    setIsLoading: () => {
    }
});
