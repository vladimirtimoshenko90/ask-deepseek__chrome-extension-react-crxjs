import { useEffect, useRef } from 'react';

export function useMutationObserver(
	target: Node | null | undefined,
	callback: () => void,
): void {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		if (!target) return;
		callbackRef.current();
		const observer = new MutationObserver(() => callbackRef.current());
		observer.observe(target, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [target]);
}
