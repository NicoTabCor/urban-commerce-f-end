import { Form, Link, useActionData, useLoaderData, redirect } from 'react-router-dom';
import tokens from '../../../src/js/helpers';
import { useState, useRef, useMemo, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

// -- DROPZONE -- //
import { useDropzone } from 'react-dropzone';

// -- Array para guardar Imagenes Para Enviar con Action -- //
let imagenes = [];

// -- REACT -- //
export async function loader({ params }) {
	// -- DATOS PARA COMPONENTE -- //
	// -- TOKEN -- //
	const tokensData = tokens();

	// -- PRODUCTO ACTUAL -- //
	const registroId = params.registroId;

	const urls = [
		`http://localhost:8000/api/admin/productos/editar/${registroId}`, // PRODUCTO
		'http://localhost:8000/api/admin/productos/datos-formulario', // DATOS FORM
	];

	try {
		const requests = urls.map(async (url) => {
			const firstFetch = await fetch(url, {
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
				},
				credentials: 'include',
			});

			const result = await firstFetch.json();

			return result;
		});

		const resultado = await Promise.all(requests);

		let datos = {};

		resultado.forEach((response) => {
			datos[Object.keys(response)[0]] = Object.values(response)[0];
		});

		return datos;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function action({ request, params }) {
	const registroId = params.registroId;
	const url = `http://localhost:8000/api/admin/productos/editar/${registroId}`;
	const tokensData = tokens();
	const datos = await request.formData();

	imagenes.forEach((imagen) => {
		datos.append('imagen[]', imagen);
	});
	console.log(...datos);

	try {
		const envio = await fetch(url, {
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
				Authorization: `Bearer ${tokensData['accessT']}`,
			},
			credentials: 'include',
			body: datos,
			method: 'POST',
		});

		const resultado = await envio.json();

		if (resultado.resultado) {
			const MySwal = withReactContent(Swal);

			const sweetButton = await MySwal.fire({
				title: <p>Exito!</p>,
				position: 'center',
				icon: 'success',
				title: resultado.resultado,
				showConfirmButton: true,
			});

			if(sweetButton.isConfirmed) {
				return redirect('http://localhost:5173/admin/productos');
				return true;
			}

		} else {
			return resultado.errores;
		}
	} catch (error) {
		return false;
	}
}

export default function EditarProducto() {
	// -- DATOS -- //
	const datos = useLoaderData();

	const errores = useActionData();

	const lastState = useRef(null);

	// -- STATES -- //
	// -- State Selects -- //
	const [stateForm, setStateForm] = useState({
		descripcion: datos.registro.descripcion,
		edades: {
			value: datos.registro.edades_id,
			label: datos.registro.edades_nombre,
			id: '#edades',
			name: 'edades',
			index: 0,
		},
		generos: {
			value: datos.registro.generos_id,
			label: datos.registro.generos_nombre,
			id: '#generos',
			name: 'generos',
			index: 1,
		},
		categorias: {
			value: datos.registro.categorias_id,
			label: datos.registro.categorias_nombre,
			talle_tipo: datos.registro.categorias_tipo_talles,
			id: '#categorias',
			name: 'categorias',
			index: 2,
		},
		marcas: {
			value: datos.registro.marcas_id,
			label: datos.registro.marcas_nombre,
			id: '#marcas',
			name: 'marcas',
			index: 3,
		},
		talles: {
			value: datos.registro.talles_id,
			label: datos.registro.talles_nombre,
			id: '#talles',
			name: 'talles',
			index: 5,
		},
		colores: {
			value: datos.registro.colores_id,
			label: datos.registro.colores_nombre,
			id: '#colores',
			name: 'colores',
			index: 4,
			contenido: datos.registro.colores_valor,
		},
	});

	// -- State Files -- //
	const [files, setFiles] = useState([]);

	// -- OPTIONS -- //
	const edades = datos.datos_form.edades.map((edad) => {
		return {
			value: edad.id,
			label: edad.nombre,
			id: '#edades',
			name: 'edades',
			index: 0,
		};
	});

	const generos = datos.datos_form.generos.reduce((acc, genero) => {
		if (genero.edades_id == stateForm.edades?.value) {
			acc.push({
				value: genero.id,
				label: genero.nombre,
				id: '#generos',
				name: 'generos',
				index: 1,
			});
		}
		return acc;
	}, []);

	const categorias = datos.datos_form.categorias.reduce((acc, categoria) => {
		if (categoria.generos_id == stateForm.generos?.value) {
			acc.push({
				value: categoria.id,
				label: categoria.nombre,
				talle_tipo: categoria.talle_tipos_id,
				id: '#categorias',
				name: 'categorias',
				index: 2,
			});
		}

		return acc;
	}, []);

	const marcas = datos.datos_form.marcas.reduce((acc, marca) => {
		if (marca.categorias_id == stateForm.categorias?.value) {
			acc.push({
				value: marca.id,
				label: marca.nombre,
				id: '#marcas',
				name: 'marcas',
				index: 3,
			});
		}

		return acc;
	}, []);

	const talles = datos.datos_form.talles.reduce((acc, talle) => {
		if (talle.talle_tipos_id == stateForm.categorias?.talle_tipo) {
			acc.push({
				value: talle.id,
				label: talle.nombre,
				id: '#talles',
				name: 'talles',
				index: 4,
			});
		}

		return acc;
	}, []);

	const colores = datos.datos_form.colores.reduce((acc, color) => {
		acc.push({
			value: color.id,
			label: color.nombre,
			id: '#colores',
			name: 'colores',
			index: 5,
			contenido: color.valor,
		});

		return acc;
	}, []);

	// -- CLICK SELECT -- //
	function setearAtributo(e, a) {
		const name = e.name;
		const id = e.id;
		const valor = e;
		const seleccionIndex = e.index;

		lastState.current = id;

		const selectIndex = [
			'edades',
			'generos',
			'categorias',
			'marcas',
			'talles',
			'colores',
		];

		const reinicioSelect = selectIndex.reduce((acc, value, ind) => {
			if (ind > seleccionIndex) {
				acc[value] = null;
			}

			return acc;
		}, {});

		setStateForm({
			...stateForm,
			...reinicioSelect,
			[name]: valor,
		});
	}

	// -- FILES DROPZONE -- //
	// -- Setear en Preview -- //
	useEffect(() => {
		const fetchedFiles = datos.registro.imagen.map((urlImagen) => {
			const arrImg = urlImagen.split('/');

			const nombreImagen = arrImg[arrImg.length - 1];

			const fileDeImagen = new File([], nombreImagen, {
				type: 'image/jpg',
			});

			fileDeImagen.preview =
				'http://localhost:8000/storage/imagenes/' + urlImagen + '.webp';

			return fileDeImagen;
		});
		setFiles([...fetchedFiles]);
		imagenes = [...fetchedFiles];
	}, []);

	// -- Liberar Memoria luego de usarse para buscar archivos y mostrarlos -- //
	useEffect(() => {
		return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [files]);

	// -- Al Seleccionar File -- //
	const onDrop = (loadedFiles) => {
		if (files.length >= 3) return;

		setFiles((previousFiles) => [
			...previousFiles,
			...loadedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			),
		]);
		imagenes = [...files, ...loadedFiles];
	};

	// -- Configuración Dropzone -- //
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isFocused,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		maxSize: 1024 * 1024 * 2, // 3 MB
	});

	// -- ESTILOS -- //
	// -- Estilos Select -- //
	const estilosSelect = {
		option: (baseStyles, state) => {
			return {
				...baseStyles,
				borderColor: 'red',
				fontSize: '1.4rem',
				fontFamily: 'Outfit, sans-serif',
				color: state.data.name === 'colores' ? state.data.contenido : '',
			};
		},
		placeholder: (baseStyles, state) => ({
			...baseStyles,
			borderColor: 'red',
			fontSize: '1.4rem',
			fontFamily: 'Outfit, sans-serif',
		}),
		singleValue: (baseStyles, state) => ({
			...dot(state.data.contenido, state?.data.name),
			...baseStyles,
			borderColor: 'red',
			fontSize: '1.4rem',
			fontFamily: 'Outfit, sans-serif',
			color: state.data.name === 'colores' ? stateForm.colores.contenido : '',
		}),
		noOptionsMessage: (baseStyles, state) => ({
			...baseStyles,
			borderColor: 'red',
			fontSize: '1.4rem',
			fontFamily: 'Outfit, sans-serif',
		}),
	};
	const dot = (color = 'transparent', nombre) => {
		if (nombre === 'colores') {
			return {
				alignItems: 'center',
				display: 'flex',

				':before': {
					backgroundColor: color,
					borderRadius: 10,
					content: '" "',
					display: 'block',
					marginRight: 8,
					height: 10,
					width: 10,
				},
			};
		}
	};

	// -- Estilos Dropzone -- //
	const baseStyle = {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '20px',
		borderWidth: 2,
		borderRadius: 2,
		borderColor: '#eeeeee',
		borderStyle: 'dashed',
		backgroundColor: '#fafafa',
		color: 'black',
		outline: 'none',
		transition: 'border .24s ease-in-out',
		cursor: 'pointer',
		fontSize: '1.4rem',
	};

	const focusedStyle = {
		borderColor: '#2196f3',
	};

	const acceptStyle = {
		borderColor: '#00e676',
	};

	const rejectStyle = {
		borderColor: '#ff1744',
	};

	// -- Estilos Preview -- //
	const thumbsContainer = {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 16,
	};

	const thumb = {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: 2,
		border: '1px solid #eaeaea',
		marginBottom: 8,
		marginRight: 8,
		width: 100,
		height: 100,
		padding: 4,
		boxSizing: 'border-box',
		position: 'relative',
	};

	const thumbInner = {
		display: 'flex',
		minWidth: 0,
		overflow: 'hidden',
	};

	const img = {
		display: 'block',
		width: 'auto',
		height: '100%',
	};

	const button = {
		all: 'unset',
		fontSize: '2rem',
		position: 'absolute',
		right: '0',
		top: '0',
		cursor: 'pointer',
	};

	// -- Juntas Estilos -- //
	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	// -- PREVIEW -- //
	// -- Remover File -- //
	const removeFile = (fileName) => {
		const nuevos = files.filter((file) => {
			return file.name !== fileName;
		});
		setFiles([...nuevos]);

		imagenes = [...nuevos];
	};

	// -- Array Preview -- //
	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img
					src={`${file.preview}`}
					style={img}
					// Revoke data uri after image is loaded
					onLoad={() => {
						URL.revokeObjectURL(file.preview);
					}}
				/>
			</div>

			<p>{Math.round(parseInt(file.size) / 1024)} KB</p>

			<button
				style={button}
				type="button"
				onClick={() => removeFile(file.name)}
			>
				<FontAwesomeIcon icon={faCircleXmark} style={{ color: '#d1001f' }} />
			</button>
		</div>
	));

	return (
		<>
			<div className="formulario">
				<Link to="/admin/productos" className="formulario__boton">
					Volver
				</Link>

				<h3 className="formulario__titulo">Editar Producto</h3>

				<Form method="post" className="formulario__contenedor">
					<div className="formulario__campo">
						<div className="formulario__base">
							<label htmlFor="nombre" className="formulario__label">
								Nombre
							</label>
							<input
								id="nombre"
								name="nombre"
								type="text"
								className="formulario__input"
								defaultValue={datos.registro.nombre}
							/>
						</div>

						{errores && errores.nombre
							? errores.nombre.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label htmlFor="precio" className="formulario__label">
								Precio
							</label>
							<input
								id="precio"
								name="precio"
								type="number"
								className="formulario__input"
								defaultValue={datos.registro.precio}
							/>
						</div>

						{errores && errores.precio
							? errores.precio.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label htmlFor="descuento" className="formulario__label">
								Descuento
							</label>
							<input
								id="descuento"
								name="descuento"
								type="number"
								step="0.01"
								className="formulario__input"
								defaultValue={datos.registro.descuento}
							/>
						</div>

						{errores && errores.descuento
							? errores.descuento.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					{/*IMAGEN*/}
					<div className="formulario__campo">
						<div className="formulario__base">
							<label htmlFor="imagen" className="formulario__label">
								Imagen
							</label>

							<div {...getRootProps({ style })}>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p className="formulario__imagen-texto">
										Arrastra los archivos aquí
									</p>
								) : (
									<p className="formulario__imagen-texto">
										Arrastra y suelta algunos archivos aquí, o haz click para
										explorar <br></br>
										TAMAÑO MAXIMO POR IMAGEN: 2MB NUMERO MAXIMO DE IMAGENES: 3
									</p>
								)}
							</div>
						</div>

						{/*PREVIEW*/}
						<aside style={thumbsContainer}>{thumbs}</aside>

						{errores && errores.imagen
							? errores.imagen.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="edades">
								Edad
							</label>

							<Select
								options={edades}
								value={stateForm.edades}
								onChange={setearAtributo}
								name="edades_id"
								id="edades"
								placeholder="Selecciona"
								styles={estilosSelect}
							/>
						</div>

						{errores && errores.edades_id
							? errores.edades_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="generos">
								Genero
							</label>
							{stateForm.edades ? (
								<Select
									options={generos}
									value={stateForm.generos}
									onChange={setearAtributo}
									name="generos_id"
									id="generos"
									placeholder="Selecciona"
									styles={estilosSelect}
								/>
							) : (
								<div>SELECCIONA UN GENERO</div>
							)}
						</div>

						{errores && errores.generos_id
							? errores.generos_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="categorias">
								Categorias
							</label>

							{stateForm.generos ? (
								<Select
									options={categorias}
									value={stateForm.categorias}
									onChange={setearAtributo}
									name="categorias_id"
									placeholder="Selecciona"
									styles={estilosSelect}
									NoOptionsMessage="No hay Categorias"
								/>
							) : (
								<div>SELECCIONA UNA CATEGORIA</div>
							)}
						</div>

						{errores && errores.categorias_id
							? errores.categorias_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="marcas">
								Marcas
							</label>

							{stateForm.categorias ? (
								<Select
									options={marcas}
									value={stateForm.marcas}
									onChange={setearAtributo}
									name="marcas_id"
									placeholder="Selecciona"
									styles={estilosSelect}
								/>
							) : (
								<div>SELECCIONA UNA MARCA</div>
							)}
						</div>

						{errores && errores.marcas_id
							? errores.marcas_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="talles">
								Talle
							</label>
							{stateForm.marcas ? (
								<Select
									options={talles}
									value={stateForm.talles}
									onChange={setearAtributo}
									name="talles_id"
									placeholder="Selecciona"
									styles={estilosSelect}
								/>
							) : (
								<div>SELECCIONA UN TALLE</div>
							)}
						</div>

						{errores && errores.talles_id
							? errores.talles_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="colores">
								Color
							</label>
							{stateForm.talles ? (
								<Select
									options={colores}
									value={stateForm.colores}
									onChange={setearAtributo}
									name="colores_id"
									placeholder="Selecciona"
									styles={estilosSelect}
								/>
							) : (
								<div>SELECCIONA UN COLOR</div>
							)}
						</div>

						{errores && errores.colores_id
							? errores.colores_id.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<div className="formulario__campo">
						<div className="formulario__base">
							<label className="formulario__label" htmlFor="descripcion">
								Descripcion
							</label>

							<textarea
								name="descripcion"
								id="descripcion"
								cols="70"
								rows="5"
								className="formulario__textarea"
								defaultValue={datos.registro.descripcion}
							></textarea>
						</div>

						{errores && errores.descripcion
							? errores.descripcion.map((error, index) => {
									return (
										<div key={index} className="formulario__error">
											{error}
										</div>
									);
							  })
							: ''}
					</div>

					<input
						type="submit"
						className="formulario__boton"
						value="Editar Producto"
					/>
				</Form>
			</div>
		</>
	);
}
