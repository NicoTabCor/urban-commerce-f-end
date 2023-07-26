import { Outlet, redirect, useNavigation } from 'react-router-dom';
import HeaderAdmin from '../../templates/HeaderAdmin';
import Sidebar from './Sidebar';
import tokens from '../../src/js/helpers';
import Header from '../../templates/Header';

export async function loader() {
	const url = 'http://localhost:8000/api/admin';

	const tokensData = tokens();
	try {

		const auth = await fetch(url, {
			method: 'post',
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		const respuestaAuth = await auth.json();
		console.log(respuestaAuth);

		if(respuestaAuth.message === 'Your email address is not verified.') {
			return redirect('http://localhost:5173/user/mensaje-verificar');
		}

		if(!respuestaAuth.resultado) {
			return redirect('http://localhost:5173/user/login');
		}

		return true;

	} catch (error) {
		console.log(error);
		return redirect('http://localhost:5173/user/login');
	}
}

export default function Admin() {

	const navigation = useNavigation();

	const loading = () => {
		
		if(navigation.state === 'submitting' || navigation.state === 'loading') { 
			return 'dashboard dashboard--loading';
		} else {
			return 'dashboard';
		}
	}

	const cargado = loading();
	
	return (
		<div className={cargado} >
			<Header />

			<div className="dashboard__grid">
				<Sidebar />

				<main className="dashboard__contenido">
					<Outlet></Outlet>
				</main>
			</div>
		</div>
	);
}
