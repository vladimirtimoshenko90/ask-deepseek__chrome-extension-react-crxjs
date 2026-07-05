import { IconMaximize, IconMinimize, IconPin, IconPinFilled } from '@tabler/icons-react';
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
}

function ChatMessageToolbar({ chatInfo, onPin, onUnpin, onCollapse, onUncollapse }: Props) {
	const el_root = useRef<HTMLDivElement>(null);
	const el_msg = useRef<HTMLElement>(null!);

	const [hash, setHash] = useState<string>('');

	const isCollapsed = chatInfo.collapsed?.some((h) => h === hash) || false;
	const isPinned = chatInfo.pins?.some((p) => p.hash === hash) || false;
	const [isAgentMessage, setIsAgentMessage] = useState(false);

	useEffect(() => {
		el_msg.current = el_root
			.current!.closest<HTMLElement>('[data-virtual-list-item-key]')!
			.querySelector<HTMLElement>('.ds-message')!;
		hashText(el_msg.current.innerText).then(setHash);

		setIsAgentMessage(!!el_msg.current.querySelector('.ds-assistant-message-main-content'));
	}, []);

	useClassToggle(el_msg.current, 'ads-pin-hl', isPinned);
	useClassToggle(el_msg.current, 'ads-collapsed', isCollapsed);
	useClassToggle(el_msg.current, 'ads-agent-message', isAgentMessage);
	useClassToggle(el_msg.current, 'ads-user-message', !isAgentMessage);

	function handlePin() {
		onPin({
			hash,
			html: sanitizeChatMessageHtml(el_msg.current.innerHTML),
		});
	}

	return (
		<div ref={el_root} className={styles['ads-chat-message-toolbar']}>
			<button onClick={() => (isCollapsed ? onUncollapse(hash) : onCollapse(hash))}>
				{isCollapsed ? <IconMaximize size={20} /> : <IconMinimize size={20} />}
			</button>

			<button onClick={() => (isPinned ? onUnpin(hash) : handlePin())}>
				{isPinned ? <IconPinFilled size={20} /> : <IconPin size={20} />}
			</button>
		</div>
	);
}

export default ChatMessageToolbar;
