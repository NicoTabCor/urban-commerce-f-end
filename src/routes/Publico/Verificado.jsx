import { redirect } from 'react-router';
import tokens from '../../src/js/helpers';

export async function loader() {
	const urlBruta = window.location.href;
	const paramentros = urlBruta.slice(37);
	const url = `http://localhost:8000/api/verificar/${paramentros}`;
	
	const cookieTokens = tokens();
  
	try {
		const request = await fetch(url, {
			credentials: 'include',
			headers: {
				'X-XSRF-TOKEN': decodeURIComponent(cookieTokens['XSRF-TOKEN']),
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		const resquestJson = await request.json();
		if(resquestJson.resultado) {
			console.log(resquestJson.resultado);
			return true;
		} 
		// return redirect('http://localhost:5173/user/login');
	} catch (error) {
		console.log(error);
		return redirect('http://localhost:5173/user/login');
	}
}

export default function Verificado() {
	return (
		<div className="mensaje">
			<h2 className="mensaje__header">Tu Cuenta Ha sido Verificada Correctamente</h2>
		</div>
	);
}
