export function waitForTabComplete(tabId: number): Promise<void> {
	return new Promise((resolve) => {
		const onUpdated = (updatedTabId: number, changeInfo: { status?: string }) => {
			if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
			chrome.tabs.onUpdated.removeListener(onUpdated);
			resolve();
		};
		chrome.tabs.onUpdated.addListener(onUpdated);
	});
}

export function sendTabMessage(
	tabId: number,
	type: string,
	payload: Record<string, unknown>,
): void {
	const msgObj = { type, ...payload };
	const send = (attempt = 0) => {
		chrome.tabs.sendMessage(tabId, msgObj).catch(() => {
			if (attempt < 10) {
				setTimeout(() => send(attempt + 1), 300);
			}
		});
	};
	send();
}
