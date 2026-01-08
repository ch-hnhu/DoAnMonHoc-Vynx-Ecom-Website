import { Outlet } from "react-router-dom";
import Header from "../components/user/Partial/Header";
import Navbar from "../components/user/Partial/Navbar";
import Footer from "../components/user/Partial/Footer";
import Spinner from "../components/user/Partial/Spinner";

export default function UserLayout() {
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
