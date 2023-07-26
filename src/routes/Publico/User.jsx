import {
	Outlet,
	redirect,
	useActionData,
	useLoaderData,
	useNavigation,
} from 'react-router-dom';
import Footer from '../../templates/Footer.jsx';
import Header from '../../templates/Header.jsx';
import { useState } from 'react';
import tokens from '../../src/js/helpers.jsx';

export async function loader() {
	const url = 'http://localhost:8000/api/datos-menu';
	const urlTokens = tokens();

	try {
		const peticion = await fetch(url, {
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(urlTokens['XSRF-TOKEN']),
			},
		});
		const peticionJson = await peticion.json();
		console.log(peticionJson);
		return peticionJson;
	} catch (error) {
		console.log(error);
		return error;
	}
}

export default function User() {
	const navigation = useNavigation();
	const datos = useLoaderData();
	const [stateMenuCat, setStateMenuCat] = useState(false);

	// -- MOSTRAR MENU CATEGORIAS -- //
	function mostrarCatOver(e) {
		const flecha = document.querySelector('.barra__categorias-flecha');
		const barraCat = e.target.closest('.barra__categorias');
		const menuCat = e.target.closest('.menu-cat');
		const barra = e.target.closest('.barra');
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
	return (
		<>
			<div
				onMouseOver={mostrarCatOver}
				className={
					navigation.state === 'submitting' ? 'app app--loading' : 'app'
				}
			>
				<Header
					stateMenuCat={stateMenuCat}
					setStateMenuCat={setStateMenuCat}
					categorias={datos.datosCat}
					edades={datos.datosEdades}
					generos={datos.datosGeneros}
					auth={datos.auth}
				/>
				<main className="main">
					<h1 className="app__marca" data-content="Urban">
						Urban
					</h1>

					<Outlet></Outlet>
				</main>

				<Footer />
			</div>
		</>
	);
}
