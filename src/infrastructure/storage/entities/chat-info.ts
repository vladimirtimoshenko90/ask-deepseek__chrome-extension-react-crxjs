export interface PinnedMessage {
	hash: string;
	html: string;
}

export interface ChatInfo {
	pins: PinnedMessage[];
	collapsed: string[];
}
