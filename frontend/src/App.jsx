import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "./services/api";
import Shop from "./pages/Shop.jsx";
import NotFound from "./pages/404.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";


function App() {

	return (
	<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route index element={<Home />} />
						<Route path="/shop" element={<Shop />} />
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
	</BrowserRouter>
	);
}

export default App;
