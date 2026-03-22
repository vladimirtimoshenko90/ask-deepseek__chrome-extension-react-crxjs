import { IconMinimize, IconPin, IconPinFilled } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { type ChatInfo, type PinnedMessage } from '@/infrastructure/storage';
import { hashText } from '@/infrastructure/utility/hash.utils';
import { sanitizeChatMessageHtml } from '@/infrastructure/utility/sanitize.utils';
import styles from './ChatMessageToolbar.module.scss';

interface Props {
	chatInfo: ChatInfo;
	onPin: (pin: PinnedMessage) => void;
	onUnpin: (hash: string) => void;
}

function ChatMessageToolbar({ chatInfo, onPin, onUnpin }: Props) {
	const el_root = useRef<HTMLDivElement>(null);
	const el_msg = useRef<HTMLElement>(null!);

	const [hash, setHash] = useState<string>('');
	const [html, setHtml] = useState<string>('');

	useEffect(() => {
		el_msg.current =
			el_root.current!.closest<HTMLElement>('div.ds-message')!;
		hashText(el_msg.current.innerText).then(setHash);
		setHtml(sanitizeChatMessageHtml(el_msg.current.innerHTML));
	}, []);

	const isPinned = chatInfo.pins.some((p) => p.hash === hash);

	return (
		<div ref={el_root} className={styles['ads-chat-message-toolbar']}>
			<button>
				<IconMinimize size={20} />
			</button>

			{isPinned ? (
				<button onClick={() => onUnpin(hash)}>
					<IconPinFilled size={20} />
				</button>
			) : (
				<button onClick={() => onPin({ hash, html })}>
					<IconPin size={20} />
				</button>
			)}
		</div>
	);
}

export default ChatMessageToolbar;
