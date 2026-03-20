import { useState } from 'react';

function App() {
	const [show, setShow] = useState(false);
	const toggle = () => setShow(!show);

	return (
		<div style={{ position: 'fixed', bottom: 0, right: 0 }}>
			{show && <h1>HELLO CRXJS</h1>}
			<button style={{ float: 'right' }} onClick={toggle}>
				toggle
			</button>
		</div>
	);
}

export default App;
