import { DEEPSEEK_URL_BASE } from '../infrastructure/constants';

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
});
