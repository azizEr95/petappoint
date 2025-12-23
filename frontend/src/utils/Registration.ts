
export const scrollToFirstError = (errorsScroll: { [key: string]: string }) => {
    const firstErrorKey = Object.keys(errorsScroll)[0];
    if (firstErrorKey) {
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ; (errorElement as HTMLElement).focus();
        }
    }
}
