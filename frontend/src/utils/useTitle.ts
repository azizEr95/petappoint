import { useEffect } from 'react';

export function useTitle(title: string) {
    title = title + ' - Vetilib';
    useEffect(() => {
        document.title = title;
    }, [title]);
}