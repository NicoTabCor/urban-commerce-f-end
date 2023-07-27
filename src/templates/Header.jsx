import { useState } from 'react';
import logo from '../src/imagenes/urbanlogo.png';
import { useLoaderData } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faUser } from '@fortawesome/free-solid-svg-icons';
import MenuCategorias from './MenuCategorias';
import MenuLogin from './MenuLogin';
import tokens from '../src/js/helpers';

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

export default function Header({stateMenuCat}) {
	
	const data = useLoaderData();

	const edades = data.datosEdades;
	const generos = data.datosGeneros;
	const categorias = data.datosCat;
	const auth = data.auth;

	const [loginState, setLoginState] = useState(false);

	return (
		<header className="barra">
			<div className="barra__base">
				<div className="barra__logo">
					<img className="barra__imagen" src={logo} alt="Logo-imagen" />
				</div>

				<div className="barra__categorias">
					<p className="barra__categorias-texto">Categorias</p>
					<FontAwesomeIcon
						className="barra__categorias-flecha"
						icon={faSortDown}
					/>
				</div>

				<nav className="barra__navegacion"></nav>

				<div>Buscar</div>

				<div>Carrito</div>

				<div
					className="barra__login"
					onClick={() => {
						setLoginState(!loginState);
					}}
				>
					<FontAwesomeIcon icon={faUser} />
					<div className="barra__login-contenedor">
						<p className="barra__login-texto">Cuenta</p>
						<FontAwesomeIcon
							className="barra__login-flecha"
							icon={faSortDown}
						/>
					</div>

					<MenuLogin auth={auth} loginState={loginState} />
					
				</div>
			</div>

			{stateMenuCat === true ? (
				<MenuCategorias
					categorias={categorias}
					edades={edades}
					generos={generos}
				/>
			) : (
				''
			)}
		</header>
	);
}
