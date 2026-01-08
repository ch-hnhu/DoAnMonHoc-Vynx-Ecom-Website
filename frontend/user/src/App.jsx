import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
	return (
		<HelmetProvider>
			<AppRoutes />
		</HelmetProvider>
	);
}
