import { useEffect, useState } from 'react';

import { Switch } from '@mantine/core';
import { storage } from '@/infrastructure/storage';
import styles from './FullscreenToggle.module.scss';

function FullscreenToggle() {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		storage.getWideMode().then(setEnabled);
	}, []);

	const handleChange = async (value: boolean) => {
		setEnabled(value);
		await storage.setWideMode(value);
	};

	return (
		<div className={styles['ads-fullscreen-toggle']}>
			<Switch
				checked={enabled}
				onChange={(e) => handleChange(e.currentTarget.checked)}
				label="Full Screen"
				size="sm"
			/>
		</div>
	);
}

export default FullscreenToggle;
