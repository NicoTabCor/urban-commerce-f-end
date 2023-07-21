import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { redirect } from 'react-router-dom';

export default function tokens() {
	const tokenCookie = document.cookie.split(';').reduce((acc, cookie) => {
		const [nombre, valor] = cookie.trim().split('=');

		return { ...acc, [nombre]: valor };
	}, {});

	return tokenCookie;
}

export async function definirActionForm({
	urlPost,
	urlRedirect,
	request,
	mensajeCorrecto,
}) {
	const url = urlPost;
	const tokensData = tokens();
	const datos = await request.formData();

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

			await MySwal.fire({
				title: <p>Exito!</p>,
				position: 'center',
				icon: 'success',
				title: mensajeCorrecto,
				showConfirmButton: true,
			});
			console.log(urlRedirect);
			return redirect(urlRedirect);
		} else {
			return resultado.errores;
		}
	} catch (error) {
		console.log(error);
		return error;
	}
}

export async function definirLoaderForm(urls, crear = true) {
	// -- TOKENS -- //
	const tokensData = tokens();

	// --- SI ES CREAR --- //
	if (crear === true) {

		const url = urls;

		try {
			const peticion = await fetch(url, {
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
				},
				credentials: 'include',
			});

			const resultado = await peticion.json();
			console.log(resultado);
			return resultado;
		} catch (error) {
			console.log(error);
			throw new Error('error al cargar datos del loader');
		}

		
	} else {
		// --- SI ES EDITAR --- //
		// -- DATOS PARA COMPONENTE -- //
		const datos = {};
		// -- REGISTRO ACTUAL -- //
		const urlRegistroActual = urls.urlRegistroActual;

		try {
			const peticionRegistro = await fetch(urlRegistroActual, {
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
				},
				credentials: 'include',
			});

			const resultadoRegistro = await peticionRegistro.json();
			datos.registroActual = resultadoRegistro;
		} catch (error) {
			console.log(error);
			throw new Error('error al cargar datos del loader');
		}

		// -- DATOS FORMULARIO -- //
		const url = urls.urlDatosFormulario;

		try {
			const peticion = await fetch(url, {
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					Authorization: `Bearer ${decodeURIComponent(tokensData['accessT'])}`,
				},
				credentials: 'include',
			});

			const resultadoFormulario = await peticion.json();

			datos.datosFormulario = resultadoFormulario;
		} catch (error) {
			console.log(error);
			throw new Error('error al cargar datos del loader');
		}
		console.log(datos);
		return datos;
	}
}

export async function definirLoaderLista({}) {}

export async function definirActionLista(url, urlRedireccion, request) {
	// -- TOKENS -- //
	const tokensData = tokens();

	const MySwal = withReactContent(Swal);
	
	const confirmacion = await MySwal.fire({
		title: 'Seguro que deseas Eliminarlo?',
		text: '',
		html: <p>NO PODRAS VOLVER ATRAS Y SE ELIMINARAN LOS PRODUCTOS Y MARCAS DE DICHA CATEGORIA</p>,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: '<p>Cancelar</p>',
		confirmButtonText: '<p>SI</p>',
	});

	if (confirmacion.isConfirmed) {
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

			if(resultado.resultado) {
				MySwal.fire('Borrado!', 'Registro Eliminado', 'success');

			} else {
				MySwal.fire('Error!', 'Registro No Eliminado', 'error');
			}
			
			return redirect(urlRedireccion);
		} catch (error) {
			console.log(error);
			throw new Error('error al cargar datos del loader');
		}
	} else {
		return false;
	}
}
