import { Form, NavLink, useLoaderData } from 'react-router-dom';
import tokens from '../../../src/js/helpers';
import { useState } from 'react';
// -- Sweetalert2 -- //
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export async function loader() {
	const url = 'http://localhost:8000/api/admin/productos/lista';

	const tokensData = tokens();

	try {
		const peticion = await fetch(url, {
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
			},
		});

		const resultado = await peticion.json();
		console.log(resultado);

		return resultado.resultado;
	} catch (error) {
		console.log(error);
		throw new Error('error al cargar datos del loader');
	}
}

export async function action({ request }) {
	const MySwal = withReactContent(Swal);

	const verifyButton = await MySwal.fire({
		html: <p>Eliminar Registro</p>,
		position: 'center',
		icon: 'question',
		title: '¿Estás Seguro/a?',
		showConfirmButton: true,
		showCancelButton: true,
	});

	if (verifyButton.isConfirmed) {
		// -- DATOS -- //
		const datos = await request.formData();
		const id = await datos.get('productoId');
		// -- TOKENS -- //
		const tokensData = tokens();

		const url = `http://localhost:8000/api/admin/productos/eliminar/${id}`;

		try {
			const peticion = await fetch(url, {
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
				},
				credentials: 'include',
				method: 'DELETE',
			});

			const resultado = await peticion.json();
			console.log(resultado.resultado);
			return resultado.resultado;
		} catch (error) {
			console.log(error);
			throw new Error('error al cargar datos del loader');
		}
	} else {
		return false;
	}
}

export default function Productos() {
	const productos = useLoaderData();

	const [orden, setOrden] = useState('DESC');

	const [stateProductos, setStateProductos] = useState(productos);

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

		boton.classList.add('tabla__boton--activo');

		if (orden === 'ASC') {
			const ordenados = [...productos].sort((a, b) => {
				if (typeof a[columna] === 'string') {
					return a[columna].toLowerCase() > b[columna].toLowerCase() ? 1 : -1;
				}

				return a[columna] > b[columna] ? 1 : -1;
			});
			setStateProductos(ordenados);
			setOrden('DESC');
			boton.classList.remove('tabla__boton--vuelta');
		} else {
			const ordenados = productos.sort((a, b) => {
				if (typeof a[columna] === 'string') {
					return a[columna].toLowerCase() > b[columna].toLowerCase() ? -1 : 1;
				}

				return a[columna] > b[columna] ? -1 : 1;
			});
			setStateProductos(ordenados);
			setOrden('ASC');
			boton.classList.add('tabla__boton--vuelta');
		}
	}

	return (
		<div className="registros">
			<NavLink to="/admin/productos/crear" className="registros__boton-crear">
				Crear Nuevo Producto
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
								<p className="tabla__h-texto">Producto</p>
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
								<p className="tabla__h-texto">Imagen</p>
								<button
									data-id="nombre"
									className="tabla__boton"
								>
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Precio Normal</p>
								<button
									data-id="precio"
									className="tabla__boton"
									onClick={() => handleOrdenar('precio')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Descuento</p>
								<button
									data-id="descuento"
									className="tabla__boton"
									onClick={() => handleOrdenar('descuento')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Precio al Público</p>
								<button
									data-id="precio"
									className="tabla__boton"
									onClick={() => handleOrdenar('precio')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Marca</p>
								<button
									data-id="marcas_nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('marcas_nombre')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Categoria</p>
								<button
									data-id="categorias_nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('categorias_nombre')}
								>
									▲
								</button>
							</div>
						</th>
						<th>
							<div className="tabla__h-columna">
								<p className="tabla__h-texto">Color</p>
								<button
									data-id="colores_nombre"
									className="tabla__boton"
									onClick={() => handleOrdenar('colores_nombre')}
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
							<p>Descripcion</p>
						</th>
						<th>
							<p>Acciones</p>
						</th>
					</tr>
				</thead>

				<tbody>
					{stateProductos.map((producto) => {
						return (
							<tr key={producto.id} className="tabla__fila">
								<td className="tabla__celda">{producto.id}</td>
								<td className="tabla__celda">{producto.nombre}</td>
								<td className="tabla__celda">
									<div className="tabla__imagenes">
										{producto.imagen.split(';').map((nombreImg) => {
											return (
												<img
													className="tabla__imagen"
													key={nombreImg}
													src={`http://localhost:8000/storage/imagenes/${nombreImg}.webp`}
												/>
											);
										})}
									</div>
								</td>
								<td className="tabla__celda">{producto.precio}$</td>
								<td className="tabla__celda">{producto.descuento}%</td>
								<td className="tabla__celda">
									{(producto.precio -
										(producto.precio * producto.descuento) / 100).toFixed(2, 10)}
									$
								</td>
								<td className="tabla__celda">{producto.marcas_nombre}</td>
								<td className="tabla__celda">{producto.categorias_nombre}</td>
								<td className="tabla__celda">{producto.colores_nombre}</td>
								<td className="tabla__celda">{producto.edades_nombre}</td>
								<td className="tabla__celda">{producto.generos_nombre}</td>
								<td className="tabla__celda">{producto.descripcion}</td>
								<td className="tabla__celda">
									<div className="tabla__acciones">
										<NavLink
											className="tabla__accion tabla__accion--editar"
											to={`/admin/productos/${producto.id}/editar`}
										>
											Editar
										</NavLink>
										<Form method="post">
											<input
												type="hidden"
												name="productoId"
												value={producto.id}
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
