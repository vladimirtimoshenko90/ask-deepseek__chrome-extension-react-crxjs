import { Switch } from '@mantine/core';
import styles from './FullscreenToggle.module.scss';
import { useState } from 'react';

function FullscreenToggle() {
	const [enabled, setEnabled] = useState(false);

	return (
		<div className={styles['ads-fullscreen-toggle']}>
			<Switch
				checked={enabled}
				onChange={(e) => setEnabled(e.currentTarget.checked)}
				label="Full Screen"
				size="sm"
			/>
		</div>
	);
}

export default FullscreenToggle;
