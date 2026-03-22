import { useEffect, useRef } from 'react';
import { IconPinnedOff } from '@tabler/icons-react';
import { type PinnedMessage } from '@/infrastructure/storage';
import styles from './PinnedSidebar.module.scss';

interface Props {
	pin: PinnedMessage;
	onUnpin: (hash: string) => void;
}

function PinnedSidebarItem({ pin, onUnpin }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.innerHTML = pin.html;
	}, [pin.html]);

	return (
		<div className={styles['ads-pinned-sidebar__item-wrapper']}>
			<button
				className={styles['ads-pinned-sidebar__unpin-btn']}
				onClick={() => onUnpin(pin.hash)}
			>
				<IconPinnedOff size={22} />
			</button>
			<div ref={ref} className={styles['ads-pinned-sidebar__item']} />
		</div>
	);
}

export default PinnedSidebarItem;
