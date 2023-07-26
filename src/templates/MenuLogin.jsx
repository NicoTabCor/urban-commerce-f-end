import {
	Form,
	useFetcher,
	NavLink,
	redirect,
	useSubmit,
} from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import tokens from '../src/js/helpers';
import axios from 'axios';

// -- Logout action of MenuLogin -- //
export async function action({ request }) {
	const data = await request.formData();

	// -- Check what kind of Button triggered the submit's event -- //
	const tipoAction = data.get('intent');

	// -- Execute different kind of Request -- //
	if (tipoAction === 'logout') {
		const MySwal = withReactContent(Swal);

		const verifyButton = await MySwal.fire({
			html: <p>Cerrar Sesión</p>,
			position: 'center',
			icon: 'question',
			title: '¿Estás Seguro/a?',
			showConfirmButton: true,
			showCancelButton: true,
		});

		if (verifyButton.isConfirmed) {
			const tokensData = tokens();
			const url = 'http://localhost:8000/api/logout';

			try {
				const peticion = await axios.get(url, {
					withCredentials: true,
					headers: {
						'X-XSRF-TOKEN': decodeURIComponent(tokensData['XSRF-TOKEN']),
					},
				});

				const cerrarSession = await peticion.data;

				if (cerrarSession.resultado) {
					return redirect('http://localhost:5173/user/login');
				} else {
					return resultado.errores;
				}
			} catch (error) {
				console.log(error);
				return error;
			}
		}
		return false;
	}
}

export default function MenuLogin({ auth, loginState }) {
	// -- Allow sending submit form without navigation -- //
	const fetcher = useFetcher();

	return (
		<div style={{display: `${loginState ? 'block' : 'none'}`}} className="login-cartel">
			<div className="login-cartel__sombra"></div>
			<div className="login-cartel__contenedor">
				<NavLink className="login-cartel__registro" to="/user/registro">
					Registrarse
				</NavLink>

				<NavLink style={{display: `${auth ? 'none' : 'block'}`}} className="login-cartel__login" to="/user/login">
					Iniciar Sesión
				</NavLink>

				<fetcher.Form style={{display: `${!auth ? 'none' : 'block'}`}} id="logout-form" method="post">
					<button
						name="intent"
						value="logout"
						className="login-cartel__logout"
						type="submit"

					>
						Cerrar Sesión
					</button>
					<input type="hidden" name="intent" value="logout" />
				</fetcher.Form>
			</div>
		</div>
	);
}
