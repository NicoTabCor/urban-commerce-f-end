import { useState } from 'react';
import { definirActionForm, definirLoaderForm } from '../../../src/js/helpers';
import Lista from '../template/Lista';
import { useActionData, useLoaderData } from 'react-router';

export async function loader() {
	const url = 'http://localhost:8000/api/admin/categorias/datos-formulario';

	return await definirLoaderForm(url);
}

export async function action({ request }) {
	const argsAction = {
		urlPost: 'http://localhost:8000/api/admin/categorias/crear',
		urlRedirect: 'http://localhost:5173/admin/categorias',
		request: request,
		mensajeCorrecto: 'Categoria Creada Correctamente',
	};

	return definirActionForm(argsAction);
}

export default function CrearCategoria() {
  const datos = useLoaderData();
  const errores = useActionData();

	// -- STATES -- //
	const [stateCat, setStateCat] = useState({
		talle_tipos: null,
		edades: null,
		generos: null,
	});

	// -- OPTIONS -- //
	const talle_tipos = datos.resultado.talle_tipos.reduce((acc, talle_tipo) => {
		acc.push({
			value: talle_tipo.id,
			label: talle_tipo.nombre,
			id: '#talle-tipos',
			name: 'talle_tipos',
		});

		return acc;
	}, []);

	const edades = datos.resultado.edades.map((edad) => {
		return {
			value: edad.id,
			label: edad.nombre,
			id: '#edades',
			name: 'edades',
			index: 0,
		};
	});

	const generos = datos.resultado.generos.reduce((acc, genero) => {
		if (genero.edades_id == stateCat.edades?.value) {
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

	// -- ESTILOS SELECT -- //

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
			color: state.data.name === 'colores' ? stateCat.colores.contenido : '',
		}),
		noOptionsMessage: (baseStyles, state) => ({
			...baseStyles,
			borderColor: 'red',
			fontSize: '1.4rem',
			fontFamily: 'Outfit, sans-serif',
		}),
	};

	// -- CAMPOS -- //
	const urlVolver = 'categorias';
	const titulo = 'Crear un Nueva Categoria';
	const botonSubmit = 'Crear Categoria';

	let campos = [];

	// -- Campo Nombre -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Nombre',
		campoTipo: 'text',
		campoId: 'nombre',
		campoOptions: '',
		campoValue: '',
		campoOnChange: '',
		campoNameYError: 'nombre',
		estilosSelect: '',
		noOptionMessage: '',
		errores,
		id: 1,
	});

	// -- Campo Tipo Talle -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Tipo Talle',
		campoTipo: 'select',
		campoId: 'talle-tipos',
		campoOptions: talle_tipos,
		campoValue: stateCat[talle_tipos],
		campoOnChange: setearAtributo,
		campoNameYError: 'talle_tipos_id',
		estilosSelect,
		noOptionMessage: 'No hay clase de talles',
		errores,
		id: 2,
	});

	// -- Campo Edad -- //
	campos.push({
		dependeDe: true,
		campoNombre: 'Edad',
		campoTipo: 'select',
		campoId: 'edades',
		campoOptions: edades,
		campoValue: stateCat[edades],
		campoOnChange: setearAtributo,
		campoNameYError: 'edades_id',
		estilosSelect,
		noOptionMessage: 'No hay edades',
		errores,
		id: 3,
	});

	// -- Campo Edad -- //
	campos.push({
		dependeDe: stateCat['edades'],
		campoNombre: 'Generos',
		campoTipo: 'select',
		campoId: 'generos',
		campoOptions: generos,
		campoValue: stateCat[generos],
		campoOnChange: setearAtributo,
		campoNameYError: 'generos_id',
		estilosSelect,
		noOptionMessage: 'No hay generos',
		errores,
		mensajeVacio: 'Selecciona una Edad',
		id: 4,
	});

	return <Lista
    urlVolver={urlVolver}
    titulo={titulo}
    botonSubmit={botonSubmit}
    campos={campos}
  />;
}
