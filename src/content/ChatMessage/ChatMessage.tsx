import { IconMinimize, IconPin, IconPinFilled } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { type ChatInfo, storage } from '@/infrastructure/storage';
import { hashText } from '@/infrastructure/utility/hash.utils';
import { sanitizeChatMessageHtml } from '@/infrastructure/utility/sanitize.utils';
import styles from './ChatMessage.module.scss';

interface Props {
	chatPath: string;
	chatInfo: ChatInfo;
}

function ChatMessage({ chatPath, chatInfo }: Props) {
	const el_root = useRef<HTMLDivElement>(null);
	const el_msg = useRef<HTMLElement>(null!);

	const [hash, setHash] = useState<string>('');

	useEffect(() => {
		el_msg.current =
			el_root.current!.closest<HTMLElement>('div.ds-message')!;
		hashText(el_msg.current.innerText).then(setHash);
	}, []);

	const handlePin = async () => {
		const html = sanitizeChatMessageHtml(el_msg.current.innerHTML);
		await storage.addPin(chatPath, { hash, html });
	};

	const isPinned = chatInfo.pins.some((p) => p.hash === hash);

	return (
		<div ref={el_root} className={styles['ads-chat-message-toolbar']}>
			<button>
				<IconMinimize size={20} />
			</button>
			<button onClick={handlePin}>
				{isPinned ? <IconPinFilled size={20} /> : <IconPin size={20} />}
			</button>
		</div>
	);
}

export default ChatMessage;
