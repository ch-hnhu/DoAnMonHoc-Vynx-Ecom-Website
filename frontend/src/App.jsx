// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		api.get("/test")
			.then((response) => {
				console.log("API Response:", response.data);
				setMessage(response.data.message);
				setLoading(false);
			})
			.catch((error) => {
				console.error("API Error:", error);
				setError(error.message);
				setLoading(false);
			});
	}, []); // Empty array - chỉ chạy 1 lần khi component mount

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>E-commerce Website</h1>
			<p>Message: {message}</p>
		</div>
	);
}

export default App;
