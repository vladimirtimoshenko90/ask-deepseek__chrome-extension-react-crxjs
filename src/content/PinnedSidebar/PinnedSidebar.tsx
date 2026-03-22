import { useEffect, useRef } from 'react';
import { type PinnedMessage } from '@/infrastructure/storage';
import styles from './PinnedSidebar.module.scss';

function PinnedSidebarItem({ pin }: { pin: PinnedMessage }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.innerHTML = pin.html;
	}, [pin.html]);

	return <div ref={ref} className={styles['ads-pinned-sidebar__item']} />;
}

interface Props {
	pins: PinnedMessage[];
}

function PinnedSidebar({ pins }: Props) {
	if (pins.length === 0) return null;

	return (
		<div className={styles['ads-pinned-sidebar']}>
			{pins.map((pin) => (
				<PinnedSidebarItem key={pin.hash} pin={pin} />
			))}
		</div>
	);
}

export default PinnedSidebar;
