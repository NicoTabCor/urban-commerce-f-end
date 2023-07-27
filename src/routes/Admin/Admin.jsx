import { Outlet, redirect, useNavigation } from 'react-router-dom';
import Sidebar from './Sidebar';
import tokens from '../../src/js/helpers';
import Header from '../../templates/Header';
import Footer from '../../templates/Footer';
import { useState } from 'react';

export async function loader() {
	const url = 'http://localhost:8000/api/admin';

	const tokensData = tokens();

	try {
		const auth = await fetch(url, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${tokensData['accessT']}`,
				'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
			},
		});

		const respuestaAuth = await auth.json();
		
		if(respuestaAuth.message === 'Your email address is not verified.') {
			return true;
			return redirect('http://localhost:5173/user/mensaje-verificar');
		}

		if(!respuestaAuth.resultado) {
			return true
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

	const [stateMenuCat, setStateMenuCat] = useState(false);

	// -- MOSTRAR MENU CATEGORIAS -- //
	function mostrarCatOver(e) {

		const flecha = document.querySelector('.barra__categorias-flecha');

		const barra = e.target.closest('.barra');
		const barraCat = e.target.closest('.barra__categorias');
		const menuCat = e.target.closest('.menu-cat');
		const existeMenuCat = document.querySelector('.menu-cat');

		if (
			barraCat || menuCat || (barra && existeMenuCat)
		) {
			setStateMenuCat(true);
			flecha.classList.add('barra__categorias-flecha--girar');

		} else {
			setStateMenuCat(false);
			flecha.classList.remove('barra__categorias-flecha--girar');
		}
	}

	const loading = () => {
		
		if(navigation.state === 'submitting' || navigation.state === 'loading') { 
			return 'dashboard dashboard--loading';
		} else {
			return 'dashboard';
		}
	}

	const cargado = loading();
	
	return (
		<div className={cargado} onMouseOver={mostrarCatOver}>
			<Header stateMenuCat={stateMenuCat} />

			<div className="dashboard__grid">
				<Sidebar />

				<main className="dashboard__contenido">
					<Outlet></Outlet>
				</main>
			</div>

		</div>
	);
}
