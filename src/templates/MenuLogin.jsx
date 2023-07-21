import { Form, NavLink } from 'react-router-dom';

export default function MenuLogin({auth}) {
	return (
		<div className="login-cartel">
			<div className="login-cartel__sombra"></div>
			<div className="login-cartel__contenedor">
				<NavLink className="login-cartel__registro" to="/user/registro">Registrarse</NavLink>
				{!auth ? (
					<NavLink className="login-cartel__login" to="/user/login">Iniciar Sesión</NavLink>
				) : (
					<Form>
						<caption>Logout</caption>
					</Form>
				)}
				
			</div>
		</div>
	);
}
