import { useEffect } from 'react';

export function useTitle(title: string) {
    title = title + ' - petappoint';
    useEffect(() => {
        document.title = title;
    }, [title]);
}