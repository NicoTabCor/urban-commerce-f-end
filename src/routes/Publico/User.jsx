import { Outlet, useLoaderData, useNavigation } from 'react-router-dom';
import Footer from '../../templates/Footer.jsx';
import Header from '../../templates/Header.jsx';
import { useState } from 'react';
import tokens from '../../src/js/helpers.jsx';

export async function loader() {
	const datos = {};

	const url = 'http://localhost:8000/api/datos-menu';
	const urlTokens = tokens();
	try {
		const peticion = await fetch(url, {
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(urlTokens['XSRF-TOKEN'])
			}
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
	function mostrarCategorias(e) {
		if (
			e.target.closest('.menu-cat') ||
			e.target.closest('.barra__categorias')
		) {
			setStateMenuCat(true);
		} else {
			setStateMenuCat(false);
		}
	}
	return (
		<>
			<div
				onMouseOver={mostrarCategorias}
				className={
					navigation.state === 'submitting' ? 'app app--loading' : 'app'
				}
			>
				<Header
					stateMenuCat={stateMenuCat}
					categorias={datos.datosCat}
					edades={datos.datosEdades}
					generos={datos.datosGeneros}
					auth={datos.auth}
				/>

				<h1 className="app__marca" data-content="Urban">
					Urban
				</h1>

				<Outlet></Outlet>

				<Footer />
			</div>
		</>
	);
}
