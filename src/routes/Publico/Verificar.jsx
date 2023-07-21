import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import tokens from '../../src/js/helpers';
import { Form } from 'react-router-dom';

export async function action() {
	const url = 'http://localhost:8000/api/verificar-reenvio';

	const tokenCookie = tokens();

	try {
		const peticion = await fetch(url, {
			method: 'post',
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(tokenCookie['XSRF-TOKEN']),
			},
		});

		const peticionJson = await peticion.json();

		if (peticionJson.resultado) {
			const MySwal = withReactContent(Swal);
			const verifyButton = await MySwal.fire({
				html: <p>{peticionJson.resultado}</p>,
				position: 'center',
				icon: 'success',
				showConfirmButton: true,
			});
		}

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export default function Verificar() {
	return (
		<div className="mensaje">
			<h2 className="mensaje__header">
				Revisa tu Correo para Verificar tu email
			</h2>

			<Form className="formulario" method="post">
				<div className="formulario__reenvio">
					<label className="formulario__label">
						¿No has recibido el email de verificación?
					</label>
					<input
						className="formulario__boton"
						type="submit"
						value={`Click aquí para reenviar email`}
					/>
				</div>
			</Form>
		</div>
	);
}
