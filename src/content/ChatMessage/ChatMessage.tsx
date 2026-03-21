import { IconMinimize, IconPin } from '@tabler/icons-react';

import styles from './ChatMessage.module.scss';

function ChatMessage() {
	return (
		<div className={styles['ads-chat-message-toolbar']}>
			<button>
				<IconMinimize size={20} />
			</button>
			<button>
				<IconPin size={20} />
			</button>
		</div>
	);
}

export default ChatMessage;
