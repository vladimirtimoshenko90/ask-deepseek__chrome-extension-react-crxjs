import { DEEPSEEK_URL_BASE } from '@/infrastructure/constants';

export function addOnActionOpenDeepSeek(): void {
	chrome.action.onClicked.addListener(() => {
		chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
	});
}
