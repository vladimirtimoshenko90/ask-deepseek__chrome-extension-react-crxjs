import { useEffect } from 'react';

export function useClassToggle(
	el: Element | null | undefined,
	className: string,
	active: boolean,
): void {
	useEffect(() => {
		el?.classList.toggle(className, active);
	}, [el, className, active]);
}
