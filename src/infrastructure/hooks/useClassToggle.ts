import { useEffect } from 'react';

export function useClassToggle(
	target: Element | string | null | undefined,
	className: string,
	active: boolean,
): void {
	useEffect(() => {
		const el =
			typeof target === 'string'
				? document.querySelector(target)
				: target;
		el?.classList.toggle(className, active);
	}, [target, className, active]);
}
