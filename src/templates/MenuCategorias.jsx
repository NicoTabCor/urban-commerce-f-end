import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuCategorias({ edades, generos, categorias }) {
	const [menuState, setMenuState] = useState({
		edadId: 1,
		generoId: 1,
	});

	function setearEdad(e) {
		const edadIdNueva = +e.target.dataset.edadId;
		setMenuState({
			...menuState,
			edadId: edadIdNueva,
		});
	}

	function setearGenero(e) {
		const generoIdNuevo = +e.target.dataset.generoId;

		setMenuState({
			...menuState,
			generoId: generoIdNuevo,
		});
	}

	return (
		<div className="menu-cat">
			<div className="menu-cat__edad">
				{edades.map((edad) => {
					return (
						<NavLink
							className="menu-cat__link"
							data-edad-id={edad.id}
							onMouseOver={setearEdad}
							to="#"
							key={edad.id}
						>
							{edad.nombre}
						</NavLink>
					);
				})}
			</div>

			<div className="menu-cat__genero">
				{generos.map((genero) => {
					if (genero.edades_id === menuState.edadId) {
						return (
							<NavLink
								className="menu-cat__link"
								data-genero-id={genero.id}
								onMouseOver={setearGenero}
								to="#"
								key={genero.id}
							>
								{genero.nombre}
							</NavLink>
						);
					}
				})}
			</div>

			<div className="menu-cat__categorias">
				{categorias.map((categoria) => {
					if (
						categoria.generos_id === menuState.generoId
					) {
						return (
							<NavLink className="menu-cat__link" to="#" key={categoria.id}>
								{categoria.nombre}
							</NavLink>
						);
					}
				})}
				{/* <a href="#">Pijamas</a>
				<a href="#">Parka</a>
				<a href="#">Zapatos</a>
				<a href="#">Vestidos</a>
				<a href="#">Remeras</a>
				<a href="#">Pijamas</a>
				<a href="#">Parka</a>
				<a href="#">Zapatos</a>
				<a href="#">Vestidos</a>
				<a href="#">Remeras</a>
				<a href="#">Pijamas</a>
				<a href="#">Parka</a>
				<a href="#">Zapatos</a>
				<a href="#">Vestidos</a>
				<a href="#">Remeras</a>
				<a href="#">Pijamas</a>
				<a href="#">Parka</a>
				<a href="#">Zapatos</a>
				<a href="#">Vestidos</a>
				<a href="#">Remeras</a>
				<a href="#">Pijamas</a>
				<a href="#">Parka</a>
				<a href="#">Zapatos</a>
				<a href="#">Vestidos</a>
				<a href="#">Remeras</a> */}
			</div>
		</div>
	);
}
