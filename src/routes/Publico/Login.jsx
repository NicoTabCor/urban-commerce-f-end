import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import tokens from '../../src/js/helpers';

export async function action({ request }) {
	// -- CSRF -- //
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
	// -- Form Data -- //
	const datos = await request.formData();
	// -- GOOGLE O NORMAL -- //

	if (datos.get('token') === null || datos.get('token') === '') {
		// -- LOGIN -- //
		const url = 'http://localhost:8000/api/login';
		try {
			const response = await fetch(url, {
				method: 'post',
				body: datos,
				credentials: 'include',
				headers: {
					'X-XSRF-TOKEN': decodeURIComponent(tokenCookie['XSRF-TOKEN']),
				},
			});

			// -- EXITO O ERROR -- //
			const resultado = await response.json();

			if (resultado.resultado) {
				// -- Redireccion a Admin -- //
				console.log(resultado);
				return true;
				return redirect('http://localhost:5173/admin/dashboard');
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
	const navigation = useNavigation();

	const [tokenState, setTokenState] = useState('');

	const firstTime = useRef(true);

	useEffect(() => {
		if (firstTime.current) {
			firstTime.current = false;
			return;
		}
		const boton = document.querySelector('.google-login');
		boton.click();
	}, [tokenState]);

	async function loginGoogle(token) {
		setTokenState(token.credential);
	}

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
					{data ? <div className="formulario__error">{data.email}</div> : ''}
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
					{data ? <div className="formulario__error">{data.password}</div> : ''}
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

			<Form action="/user/login" method="post">
				<GoogleLogin
					onSuccess={loginGoogle}
					onError={() => {
						console.log('Login Failed');
					}}
				/>

				<input type="hidden" name="token" value={tokenState} />

				<input
					className="google-login"
					type="submit"
					style={{ display: 'none' }}
				/>
			</Form>

			<div className="formulario__enlaces">
				<a href="#" className="formulario__enlace">
					¿Has olvidado tu contraseña?
				</a>
				<a href="/user/registro" className="formulario__enlace">
					¿No tienes una cuenta? Crea una
				</a>
			</div>
		</div>
	);
}
