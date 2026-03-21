import { IconMinimize, IconPin } from '@tabler/icons-react';
import { useEffect, useMemo, useRef } from 'react';

import { hashText } from '@/infrastructure/utility/hash.utils';
import { sanitizeChatMessageHtml } from '@/infrastructure/utility/sanitize.utils';
import { storage } from '@/infrastructure/storage';
import styles from './ChatMessage.module.scss';

function ChatMessage() {
	const el_root = useRef<HTMLDivElement>(null);
	const el_msg = useRef<HTMLElement>(null!);

	const chatPath = useMemo(() => window.location.pathname, []);

	useEffect(() => {
		el_msg.current =
			el_root.current!.closest<HTMLElement>('div.ds-message')!;
	}, []);

	const handlePin = async () => {
		const hash = await hashText(el_msg.current.innerText);
		const html = sanitizeChatMessageHtml(el_msg.current.innerHTML);
		await storage.addPin(chatPath, { hash, html });
	};

	return (
		<div ref={el_root} className={styles['ads-chat-message-toolbar']}>
			<button>
				<IconMinimize size={20} />
			</button>
			<button onClick={handlePin}>
				<IconPin size={20} />
			</button>
		</div>
	);
}

export default ChatMessage;
