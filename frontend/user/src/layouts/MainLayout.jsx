import { Outlet } from "react-router-dom";
import Header from "../components/Partial/Header";
import Navbar from "../components/Partial/Navbar";
import Footer from "../components/Partial/Footer";
import Spinner from "../components/Partial/Spinner";

export default function MainLayout() {
	return (
		<>
			<Spinner />
			<Header />
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
}
