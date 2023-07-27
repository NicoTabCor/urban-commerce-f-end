import {
	Outlet,
	useNavigation,
} from 'react-router-dom';
import Footer from '../../templates/Footer.jsx';
import Header from '../../templates/Header.jsx';
import { useState } from 'react';


export default function User() {
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
	
	return (
		<>
			<div
				className={
					navigation.state === 'submitting' ? 'app app--loading' : 'app'
				}
				onMouseOver={mostrarCatOver}
			>
				<Header stateMenuCat={stateMenuCat} />
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
