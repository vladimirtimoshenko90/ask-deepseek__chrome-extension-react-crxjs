export const DEEPSEEK_URL_BASE = 'https://chat.deepseek.com/';

export const CHAT_MESSAGE_INJECTION_SELECTOR = '[data-chat-message]';
export function markChatMessageInjectionRoot(el: HTMLElement): void {
	el.setAttribute('data-chat-message', 'true');
}

export const SIDEBAR_INJECTION_SELECTOR = '[data-sidebar]';
export function markSidebarInjectionRoot(el: HTMLElement): void {
	el.setAttribute('data-sidebar', 'true');
}
