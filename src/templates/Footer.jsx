import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer__contenedor">
				<a className="footer__enlace footer__enlace--terminos" href="#">
					Terminos y Condiciones de uso
				</a>

				<div className="footer__redes">
					<a className="footer__enlace footer__enlace--facebook" href="#">
						<p className="footer__texto">/CodexArg</p>
						<FontAwesomeIcon
							className="footer__icono"
							icon={faFacebook}
						/>
					</a>
					<a className="footer__enlace footer__enlace--twitter" href="#">
						<p className="footer__texto">@CodexArg</p>
						<FontAwesomeIcon
							className="footer__icono"
							icon={faTwitter}
						/>
					</a>
					<a className="footer__enlace footer__enlace--instagram" href="#">
						<p className="footer__texto">@CodexArg</p>
						<FontAwesomeIcon
							className="footer__icono"
							icon={faInstagram}
						/>
					</a>
				</div>

        <p className="footer__mensaje">Todos los derechos reservados &#169;</p>
			</div>

			<div className="footer__contacto">
				<a className="footer__enlace footer__enlace--yo" href="#">
					Codex ARG
				</a>

				<p className="footer__año">2023</p>
			</div>
		</footer>
	);
}
