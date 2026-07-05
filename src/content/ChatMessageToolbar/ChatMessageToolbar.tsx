import { IconMaximize, IconMinimize, IconPin, IconPinFilled, IconTrash } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { type ChatInfo, type PinnedMessage } from '@/infrastructure/storage';
import { hashText } from '@/infrastructure/utility/hash.utils';
import { sanitizeChatMessageHtml } from '@/infrastructure/utility/sanitize.utils';
import { useClassToggle } from '@/infrastructure/hooks/useClassToggle';
import styles from './ChatMessageToolbar.module.scss';

interface Props {
	chatInfo: ChatInfo;
	onPin: (pin: PinnedMessage) => void;
	onUnpin: (hash: string) => void;
	onCollapse: (hash: string) => void;
	onUncollapse: (hash: string) => void;
	onDelete: (hash: string) => void;
}

function ChatMessageToolbar({
	chatInfo,
	onPin,
	onUnpin,
	onCollapse,
	onUncollapse,
	onDelete,
}: Props) {
	const el_toolbar = useRef<HTMLDivElement>(null);
	const el_root = useRef<HTMLElement>(null!);
	const el_msg = useRef<HTMLElement>(null!);

	const [hash, setHash] = useState<string>('');

	const isCollapsed = chatInfo.collapsed?.some((h) => h === hash) || false;
	const isPinned = chatInfo.pins?.some((p) => p.hash === hash) || false;
	const isDeleted = chatInfo.deleted?.some((h) => h === hash) || false;
	const [isAgentMessage, setIsAgentMessage] = useState(false);

	useEffect(() => {
		el_root.current = el_toolbar.current!.closest<HTMLElement>('[data-virtual-list-item-key]')!;
		el_msg.current = el_root.current.querySelector<HTMLElement>('.ds-message')!;

		hashText(el_msg.current.innerText.replace(/\s/g, '')).then(setHash);

		setIsAgentMessage(!!el_msg.current.querySelector('.ds-assistant-message-main-content'));
	}, []);

	useClassToggle(el_msg.current, 'ads-collapsed', isCollapsed);
	useClassToggle(el_msg.current, 'ads-pin-hl', isPinned);
	useClassToggle(el_root.current, 'ads-deleted', isDeleted);
	useClassToggle(el_msg.current, 'ads-agent-message', isAgentMessage);
	useClassToggle(el_msg.current, 'ads-user-message', !isAgentMessage);

	function handlePin() {
		onPin({
			hash,
			html: sanitizeChatMessageHtml(el_msg.current.innerHTML),
		});
	}

	function handleDelete() {
		const question =
			'Delete this message? It will be removed from the chat and cannot be restored.';
		window.confirm(question) && onDelete(hash);
	}

	return (
		<div ref={el_toolbar} className={styles['ads-chat-message-toolbar']}>
			<button onClick={() => (isCollapsed ? onUncollapse(hash) : onCollapse(hash))}>
				{isCollapsed ? <IconMaximize size={20} /> : <IconMinimize size={20} />}
			</button>

			<button onClick={() => (isPinned ? onUnpin(hash) : handlePin())}>
				{isPinned ? <IconPinFilled size={20} /> : <IconPin size={20} />}
			</button>

			<button onClick={handleDelete}>
				<IconTrash size={20} />
			</button>
		</div>
	);
}

export default ChatMessageToolbar;
