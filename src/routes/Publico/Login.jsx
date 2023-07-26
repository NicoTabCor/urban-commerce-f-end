import {
	Form,
	NavLink,
	redirect,
	useActionData,
	useNavigation,
	useSubmit,
} from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import tokens from '../../src/js/helpers';
import { useEffect } from 'react';

export async function loader() {}

export async function action({ request }) {
	// -- CSRF Request -- //
	const urlToken = 'http://localhost:8000/sanctum/csrf-cookie';

	try {
		await fetch(urlToken, {
			credentials: 'include',
		});
	} catch (error) {
		console.log(error);
	}

	// -- Tokens -- //
	const tokenCookie = tokens();
	const datos = await request.formData();

	// -- Login with Credentials or with Google  -- //
	if (datos.get('token') === null || datos.get('token') === '') {
		// -- With Credentials -- //
		const url = 'http://localhost:8000/api/login';

		try {
			const response = await fetch(url, {
				method: 'post',
				body: datos,
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'X-XSRF-TOKEN': decodeURIComponent(tokenCookie['XSRF-TOKEN']),
				},
			});

			// -- EXITO O ERROR -- //
			const resultado = await response.json();
			console.log(resultado);
			if (resultado) {
				// -- Redirect to Admin or User Section -- //
				return resultado;
				return redirect('http://localhost:5173/admin/dashboard');
				return redirect('http://localhost:5173/user/profile');
			} else {
				console.log(resultado);
				return resultado;
			}
		} catch (errores) {
			console.log(errores);
			return false;
		}
	} else {
		// -- GOOGLE LOGIN -- //
		const url = 'http://localhost:8000/api/googlelogin';

		try {
			// -- CONSUMIR API -- //
			const envioToken = await fetch(url, {
				method: 'post',
				body: datos,
				credentials: 'include',
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokenCookie['XSRF-TOKEN']),
				},
			});

			const respuestaJson = await envioToken.json();
			if (respuestaJson) {
				const tokenAcceso = await respuestaJson.token;

				document.cookie = `accessT=${tokenAcceso};expires=7;path=/`;

				return redirect('http://localhost:5173/admin/dashboard');
			}
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}

export default function Login() {

	const data = useActionData();
	const submit = useSubmit();
	const navigation = useNavigation();

	const loginGoogle = async (token) => {
		const form = document.querySelector('#form-google');
		const oculto = form.querySelector('.oculto');
		oculto.value = token.credential;

		submit(form, {
			method: 'post',
			action: '/user/login',
		});
	};

	useEffect(() => {
		google.accounts.id.initialize({
			client_id: "258932292798-6pc858uab9si4varr8e7e6rbjpe3t29s.apps.googleusercontent.com",
			callback: loginGoogle
		});

		google.accounts.id.renderButton(
			document.getElementById("signInDiv"),
			{
				theme: "outline",
				size: "large",
				width: "200px"
			}
		)
	}, [])

	return (
		<div className="formulario">
			<h3 className="formulario__titulo">Login</h3>

			<Form
				action="/user/login"
				method="post"
				className="formulario__contenedor"
			>
				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="email">
							Email
						</label>
						<input
							name="email"
							id="email"
							className="formulario__input"
							type="email"
							placeholder="Tu Email"
						/>
					</div>
					{data && data.errores.email
						? data.errores.email.map((error) => (
								<div key={error} className="formulario__error">
									{error}
								</div>
						  ))
						: ''}
				</div>

				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="password">
							Contraseña
						</label>
						<input
							name="password"
							id="password"
							className="formulario__input"
							type="password"
							placeholder="Tu Contraseña"
						/>
					</div>
					{data && data.errores.password
						? data.errores.password.map((error) => (
								<div key={error} className="formulario__error">
									{error}
								</div>
						  ))
						: ''}
				</div>

				<button
					className={
						navigation.state === 'submitting'
							? 'formulario__boton formulario__boton--loading'
							: 'formulario__boton'
					}
					type="submit"
				>
					Iniciar Sesión
				</button>
			</Form>

			<Form
				id="form-google"
				className="formulario__google"
				action="/user/login"
				method="post"
			>
				<div id="signInDiv"></div>
				{/* <GoogleLogin
					onSuccess={loginGoogle}
					onError={() => {
						console.log('Login Failed');
					}}
				/> */}
				

				<input className="oculto" type="hidden" name="token" />
			</Form>

			<div className="formulario__enlaces">
				<NavLink to="/user/olvide" className="formulario__enlace">
					¿Has olvidado tu contraseña?
				</NavLink>
				<NavLink to="/user/registro" className="formulario__enlace">
					¿No tienes una cuenta? Crea una
				</NavLink>
			</div>
		</div>
	);
}
