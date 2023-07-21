import { NavLink, useNavigation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
	function colapso(event) {
		event.target.parentElement.classList.toggle('dashboard__sidebar--cerrado');
	}

	const navigation = useNavigation();

	return (
		<aside className="dashboard__sidebar">
			<nav className="dashboard__menu">
				<NavLink
					to="/admin/dashboard"
					className="dashboard__enlace"
					data-id="dashboard"
				>
					{/* <i className="fa-solid fa-house dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Inicio</span>
				</NavLink>

				<NavLink
					to="/admin/productos"
					className="dashboard__enlace"
					data-id="ponentes"
				>
					{/* <i className="fa-solid fa-microphone dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Productos</span>
				</NavLink>

				<NavLink
					to="/admin/ventas"
					className="dashboard__enlace"
					data-id="eventos"
				>
					{/* <i className="fa-solid fa-calendar-days dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Ventas</span>
				</NavLink>

				<NavLink
					to="/admin/aspecto"
					className="dashboard__enlace"
					data-id="registrados"
				>
					{/* <i className="fa-solid fa-users dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Aspecto</span>
				</NavLink>

				<NavLink
					to="/admin/pedidos"
					className="dashboard__enlace"
					data-id="regalos"
				>
					{/* <i className="fa-solid fa-gift dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Pedidos</span>
				</NavLink>

				<NavLink
					to="/admin/colores"
					className="dashboard__enlace"
					data-id="regalos"
				>
					{/* <i className="fa-solid fa-gift dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Colores</span>
				</NavLink>

				<NavLink
					to="/admin/categorias"
					className="dashboard__enlace"
					data-id="regalos"
				>
					{/* <i className="fa-solid fa-gift dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Categorias</span>
				</NavLink>

				<NavLink
					to="/admin/edades"
					className="dashboard__enlace"
					data-id="regalos"
				>
					{/* <i className="fa-solid fa-gift dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Edades</span>
				</NavLink>

				<NavLink
					to="/admin/generos"
					className="dashboard__enlace"
					data-id="regalos"
				>
					{/* <i className="fa-solid fa-gift dashboard__icono"></i> */}
					<span className="dashboard__menu-texto">Generos</span>
				</NavLink>
			</nav>
			<div className="dashboard__colapsador" onClick={colapso}>
				<FontAwesomeIcon className="dashboard__icono-colapso" icon={faArrowDown} />
			</div>
		</aside>
	);
}
