import { useEffect, useState } from 'react';

export function usePathname(): string {
	const [pathname, setPathname] = useState(() => window.location.pathname);

	useEffect(() => {
		const nav = (window as any).navigation;
		if (!nav) return;

		const handler = (e: any) =>
			setPathname(new URL(e.destination.url).pathname);

		nav.addEventListener('navigate', handler);
		return () => nav.removeEventListener('navigate', handler);
	}, []);

	return pathname;
}
