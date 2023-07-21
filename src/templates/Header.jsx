import logo from '../src/imagenes/urbanlogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faUser } from '@fortawesome/free-solid-svg-icons';
import MenuCategorias from './MenuCategorias';
import MenuLogin from './MenuLogin';
import { useState } from 'react';

export default function Header({
	stateMenuCat,
	categorias,
	edades,
	generos,
	auth,
}) {

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

				<div>carrito</div>

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

					<MenuLogin auth={auth} />
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
