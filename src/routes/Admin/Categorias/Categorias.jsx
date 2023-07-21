import { Form, NavLink, useLoaderData } from 'react-router-dom';
import tokens, { definirActionLista } from '../../../src/js/helpers';
import { useEffect, useState } from 'react';

export async function loader() {
	const url = 'http://localhost:8000/api/admin/categorias/lista';

	const tokensData = tokens();

	try {
		const peticion = await fetch(url, {
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
				Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
			},
			credentials: 'include',
		});

		const resultado = await peticion.json();
		// console.log(resultado.resultado);

		return resultado.resultado;
	} catch (error) {
		console.log(error);
		throw new Error('error al cargar datos del loader');
	}
}

export async function action({ request }) {
	
	const datos = await request.formData();
	const id = await datos.get('categoriaId');

	const url = `http://localhost:8000/api/admin/categorias/eliminar/${id}`;
	const urlRedireccion = 'http://localhost:5173/admin/categorias/';

	return definirActionLista(url, urlRedireccion, request);
}

export default function Categorias() {

	const categorias = useLoaderData();
	
	const [orden, setOrden] = useState('DESC');

	const [stateCategorias, setStateCategorias] = useState(categorias);

	useEffect(() => {
		setStateCategorias(categorias);
	}, [categorias]);

	function handleOrdenar(columna) {
		const activo = document.querySelector(
			`.tabla__boton--activo:not([data-id=${columna}])`
		);
		const reset = document.querySelector(
			`.tabla__boton--vuelta:not([data-id=${columna}])`
		);

		if (activo) {
			activo.classList.remove('tabla__boton--activo');
		}
		if (reset) {
			reset.classList.remove('tabla__boton--vuelta');
		}

		// -- Agregar activo -- //
		const boton = document.querySelector(`BUTTON[data-id=${columna}]`);

		// boton.classList.toggle('tabla__boton--vuelta');
		boton.classList.add('tabla__boton--activo');

		if (orden === 'ASC') {
			const ordenados = [...categorias].sort((a, b) => {
				if (typeof a[columna] === 'string') {
					return a[columna].toLowerCase() > b[columna].toLowerCase() ? 1 : -1;
				}

				return a[columna] > b[columna] ? 1 : -1;
			});

			setStateCategorias(ordenados);
			setOrden('DESC');
			boton.classList.remove('tabla__boton--vuelta');

		} else {
			const ordenados = categorias.sort((a, b) => {
				if (typeof a[columna] === 'string') {
					return a[columna].toLowerCase() > b[columna].toLowerCase() ? -1 : 1;
				}

				return a[columna] > b[columna] ? -1 : 1;
			});
			setStateCategorias(ordenados);
			setOrden('ASC');
			boton.classList.add('tabla__boton--vuelta');
		}
	}

	return (
		<div className="registros">
			<NavLink to="/admin/categorias/crear" className="registros__boton-crear">
				Crear Nuava Categoria
			</NavLink>

			<div className="registros__vista">
				<div className="registros__filtrar">
					<p className="registros__filtro-texto">Filtrar por:</p>

					<select className="registros__select" name="filter" id="filter">
						<option value="1">Categorias</option>
						<option value="2">Marca</option>
						<option value="3">Talle</option>
					</select>
				</div>

				<div className="registros__filtrar">
					<p className="registros__filtro-texto">Ordenar por:</p>

					<select className="registros__select" name="sort" id="sort">
						<option value="1">Precio Mayor</option>
						<option value="2">Precio Menor</option>
						<option value="3">Categoria</option>
					</select>
				</div>
			</div>

			<table className="tabla">
				<thead className="tabla__head">
					<tr className="tabla__fila">
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Id</p>
								<button
									data-id="id"
									className="tabla__boton"
									onClick={() => handleOrdenar('id')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Categoria</p>
								<button
									data-id="nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('nombre')}
								>
									▲
								</button>
							</div>
						</th>

						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Edad</p>
								<button
									data-id="edades_nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('edades_nombre')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Genero</p>
								<button
									data-id="generos_nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('generos_nombre')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Talle Tipo</p>
								<button
									data-id="tipo_talle"
									className="tabla__boton"
									onClick={() => handleOrdenar('tipo_talle')}
								>
									▲
								</button>
							</div>
						</th>

						<th>
							<p>Acciones</p>
						</th>
					</tr>
				</thead>

				<tbody>
					{stateCategorias.map((categoria) => {
						return (
							<tr key={categoria.id} className="tabla__fila">
								<td className="tabla__celda">{categoria.id}</td>
								<td className="tabla__celda">{categoria.nombre}</td>
								<td className="tabla__celda">{categoria.edades_nombre}</td>
								<td className="tabla__celda">{categoria.generos_nombre}</td>
								<td className="tabla__celda">{categoria.tipo_talle}</td>
								<td className="tabla__celda">
									<div className="tabla__acciones">
										<NavLink
											className="tabla__accion tabla__accion--editar"
											to={`/admin/categorias/${categoria.id}/editar`}
										>
											Editar
										</NavLink>
										<Form method="post">
											<input
												type="hidden"
												name="categoriaId"
												value={categoria.id}
											/>
											<input
												className="tabla__accion tabla__accion--eliminar"
												type="submit"
												value="Eliminar"
											/>
										</Form>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
