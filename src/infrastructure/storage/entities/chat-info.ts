export interface PinnedMessage {
	hash: string;
	html: string;
}

export interface ChatInfo {
	pins: PinnedMessage[];
	collapsed: string[];
	deleted: string[];
}

export const EMPTY_CHAT_INFO: ChatInfo = {
	pins: [],
	collapsed: [],
	deleted: [],
};
