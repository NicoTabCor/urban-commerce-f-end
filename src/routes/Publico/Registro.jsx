import { Form, NavLink, redirect, useActionData, useNavigation } from 'react-router-dom';

export async function action({ request }) {
	console.log('registro');
	// -- REQUERIR TOKEN -- //
	const urlToken = 'http://localhost:8000/sanctum/csrf-cookie';
	await fetch(urlToken, {
		credentials: 'include',
	});

	// -- ALMACENAR TOKEN -- //
	const tokenCookie = document.cookie.split(';').reduce((acc, cookie) => {
		const [nombre, valor] = cookie.trim().split('=');

		return { ...acc, [nombre]: valor };
	}, {});

	// -- REQUEST REGISTRO -- //
	const url = 'http://localhost:8000/api/registro';

	const formData = await request.formData();

	const response = await fetch(url, {
		method: 'POST',
		body: formData,
		headers: {
			// 'X-Requested-With': 'XMLHttpRequest',
			// 'Accept': 'application/json',
			// 'Content-Type': 'application/json',
			'X-XSRF-TOKEN': decodeURIComponent(tokenCookie['XSRF-TOKEN']),
		},
		credentials: 'include',
	});
	const resultado = await response.json();

	console.log(resultado);

	if (resultado.resultado) {
		return redirect('/user/mensaje-verificar');

	} else {
		// -- Errores -- //
		return resultado;
	}
}

export default function Registro() {
	const data = useActionData();
	const navigation = useNavigation();

	return (
		<div className="formulario">
			<h3 className="formulario__titulo">Registro</h3>
			<Form method="POST" className="formulario__contenedor">
				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="nombre">
							Nombre
						</label>

						<input
							// required
							name="name"
							id="nombre"
							className="formulario__input"
							type="text"
							placeholder="Tu Nombre"
						/>
					</div>

					{data ? <div className="formulario__error">{data.name}</div> : ''}
				</div>

				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="apellido">
							Apellido
						</label>
						<input
							// required
							name="last_name"
							id="apellido"
							className="formulario__input"
							type="text"
							placeholder="Tu Apellido"
						/>
					</div>
					{data ? (
						<div className="formulario__error">{data.last_name}</div>
					) : (
						''
					)}
				</div>

				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="email">
							Email
						</label>
						<input
							// required
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
						<label className="formulario__label" htmlFor="contraseña">
							Contraseña
						</label>
						<input
							// required
							name="password"
							id="contraseña"
							className="formulario__input"
							type="password"
							placeholder="Tu Contraseña"
						/>
					</div>
					{data ? <div className="formulario__error">{data.password}</div> : ''}
				</div>

				<div className="formulario__campo">
					<div className="formulario__base">
						<label className="formulario__label" htmlFor="confirmar_contraseña">
							Confirmar Contraseña
						</label>
						<input
							// required
							name="password_confirmation"
							id="confirmar_contraseña"
							className="formulario__input"
							type="password"
							placeholder="Confirma tu contraseña"
						/>
					</div>
				</div>

				<button
					className={
						navigation.state === 'submitting'
							? 'formulario__boton formulario__boton--loading'
							: 'formulario__boton'
					}
					type="submit"
				>
					Crear
				</button>
			</Form>

			<div className="formulario__enlaces">
				<NavLink to="/user/olvide" className="formulario__enlace">
					¿Has olvidado tu contraseña?
				</NavLink>
				<NavLink to="/user/login" className="formulario__enlace">
					¿Ya tienes una cuenta? Inicia Sesión
				</NavLink>
			</div>
		</div>
	);
}
