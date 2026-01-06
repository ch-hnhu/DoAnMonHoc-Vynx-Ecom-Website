import { Outlet } from "react-router-dom";
import Header from "../components/partial/Header";
import Navbar from "../components/partial/Navbar";
import Footer from "../components/partial/Footer";
import SpinnerStart from "../components/partial/SpinnerStart";

export default function MainLayout() {
	return (
		<>
			<SpinnerStart />
			<Header />
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
}
