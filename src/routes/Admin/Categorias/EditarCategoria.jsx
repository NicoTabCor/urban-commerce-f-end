import { useState, useEffect, useMemo } from 'react';
import { definirActionForm, definirLoaderForm } from '../../../src/js/helpers';
import Lista from '../template/Lista';
import { useActionData, useLoaderData } from 'react-router';
import { useDropzone } from 'react-dropzone';

export async function loader({params, request}) {

	const urlDatosFormulario = 'http://localhost:8000/api/admin/categorias/datos-formulario';
  const idCategoria = params.categoriaId;
	const urlRegistroActual = `http://localhost:8000/api/admin/categorias/editar/${idCategoria}`;

  const urls = {};
  urls.urlDatosFormulario = urlDatosFormulario;
  urls.urlRegistroActual = urlRegistroActual;

	return await definirLoaderForm(urls, false);
}

export async function action({ request, params }) {
	const categoriaId = params.categoriaId;
	const argsAction = {
		urlPost: `http://localhost:8000/api/admin/categorias/editar/${categoriaId}`,
		urlRedirect: 'http://localhost:5173/admin/categorias',
		request: request,
		mensajeCorrecto: 'Categoria Editada Correctamente',
	};

	return definirActionForm(argsAction);
}

export default function EditarCategoria() {

  const datos = useLoaderData();

  const errores = useActionData();

	// -- STATES -- //
	const [stateCat, setStateCat] = useState({
		talle_tipos: {
			value: datos.registroActual.resultado.talle_tipos_id,
			label: datos.registroActual.resultado.talle_tipos_nombre,
			id: '#talle-tipos',
			name: 'talle_tipos_id'
		},
		edades: {
			value: datos.registroActual.resultado.edades_id,
			label: datos.registroActual.resultado.edades_nombre,
			id: '#edades',
			name: 'edades_id',
			index: 0,
		},
		generos: {
			value: datos.registroActual.resultado.generos_id,
			label: datos.registroActual.resultado.generos_nombre,
			id: '#generos',
			name: 'generos_id',
			index: 1,
		},
	});

	const [files, setFiles] = useState([]);

	// -- OPTIONS -- //
	const talle_tipos = datos.datosFormulario.resultado.talle_tipos.reduce((acc, talle_tipo) => {
		acc.push({
			value: talle_tipo.id,
			label: talle_tipo.nombre,
			id: '#talle-tipos',
			name: 'talle_tipos',
		});

		return acc;
	}, []);

	const edades = datos.datosFormulario.resultado.edades.map((edad) => {
		return {
			value: edad.id,
			label: edad.nombre,
			id: '#edades',
			name: 'edades',
			index: 1,
		};
	});

	const generos = datos.datosFormulario.resultado.generos.reduce((acc, genero) => {
		if (genero.edades_id == stateCat.edades?.value) {
			acc.push({
				value: genero.id,
				label: genero.nombre,
				id: '#generos',
				name: 'generos',
				index: 2,
			});
		}
		return acc;
	}, []);

	// -- CLICK SELECT -- //
	function setearAtributo(e, a) {
		const name = e.name;
		const valor = e;
		const seleccionIndex = e.index;

		// -- REINICIO DE CAMPOS DEPENDIENTES -- //
		// -- Campos dependientes -- //
		const selectIndex = ['edades', 'generos'];

		// -- Funcion ejecutora -- //
		const reinicioSelect = selectIndex.reduce((acc, value, ind) => {
			if (ind > seleccionIndex) {
				acc[value] = null;
			}

			return acc;
		}, {});

		// -- Seteo de States y reinicio si es necesario + Agregado ultimo State -- //
		setStateCat({
			...stateCat,
			...reinicioSelect,
			[name]: valor,
		});
	}

	// -- FILES DROPZONE -- //
	// -- Setear en Preview -- //
	useEffect(() => {
		
		const fetchedFiles = datos.registroActual.resultado.imagen.map((urlImagen) => {
			const arrImg = urlImagen.split('/');

			const nombreImagen = arrImg[arrImg.length - 1];

			const fileDeImagen = new File([], nombreImagen);

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

	// -- CAMPOS -- //
	const urlVolver = 'categorias';
	const titulo = 'Editar Categoria';
	const botonSubmit = 'Editar Categoria';

	let campos = [];
	
	// -- Campo Nombre -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Nombre',
		campoTipo: 'text',
		campoId: 'nombre',
		campoOptions: '',
		campoValue: datos.registroActual.resultado.nombre,
		campoOnChange: '',
		campoNameYError: 'nombre',
		estilosSelect: '',
		noOptionMessage: '',
		errores,
		id: 1,
	});
	// -- Campo Imagen -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Imagen',
		campoTipo: 'file',
		campoId: 'imagen',
		campoFileSettings : {
			fileStyle: style,
			isDragActive,
			getRootProps,
			getInputProps,
			campoThumbsContainer: thumbsContainer,
			campoThumbs: thumbs
		},
		campoNameYError: 'imagen',
		errores,
		id: 2,
	});
	// -- Campo Tipo Talle -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Tipo Talle',
		campoTipo: 'select',
		campoId: 'talle-tipos',
		campoOptions: talle_tipos,
		campoValue: stateCat.talle_tipos,
		campoOnChange: setearAtributo,
		campoNameYError: 'talle_tipos_id',
		estilosSelect,
		noOptionMessage: 'No hay clase de talles',
		errores,
		id: 3,
	});

	// -- Campo Edad -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Edad',
		campoTipo: 'select',
		campoId: 'edades',
		campoOptions: edades,
		campoValue: stateCat.edades,
		campoOnChange: setearAtributo,
		campoNameYError: 'edades_id',
		estilosSelect,
		noOptionMessage: 'No hay edades',
		errores,
		id: 4,
	});

	// -- Campo Genero -- //
	campos.push({
		dependeDe: stateCat.generos,
		campoNombre: 'Generos',
		campoTipo: 'select',
		campoId: 'generos',
		campoOptions: generos,
		campoValue: stateCat.generos,
		campoOnChange: setearAtributo,
		campoNameYError: 'generos_id',
		estilosSelect,
		noOptionMessage: 'No hay generos',
		errores,
		mensajeVacio: 'Selecciona un genero',
		id: 5,
	});

	return <Lista
    urlVolver={urlVolver}
    titulo={titulo}
    botonSubmit={botonSubmit}
    campos={campos}
  />;
}
