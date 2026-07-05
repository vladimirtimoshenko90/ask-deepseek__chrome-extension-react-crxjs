import { useEffect, useState } from 'react';

import {
	getScreenSelection,
	type ScreenSelection,
} from '@/infrastructure/utility/selection.utils';

export function useScreenSelection(): ScreenSelection | null {
	const [selection, setSelection] = useState<ScreenSelection | null>(null);

	useEffect(() => {
		let raf = 0;
		const sync = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => setSelection(getScreenSelection()));
		};

		sync();

		document.addEventListener('selectionchange', sync);
		window.addEventListener('scroll', sync, true);
		window.addEventListener('resize', sync);

		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener('selectionchange', sync);
			window.removeEventListener('scroll', sync, true);
			window.removeEventListener('resize', sync);
		};
	}, []);

	return selection;
}
