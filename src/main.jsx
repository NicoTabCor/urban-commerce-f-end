import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './scss/app.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import User, { loader as headerLoader } from './routes/Publico/User.jsx';
import Login, { action as loginAction } from './routes/Publico/Login.jsx';
import Registro, {
	action as registroAction,
} from './routes/Publico/Registro.jsx';

import Admin, { loader as adminLoader } from './routes/Admin/Admin';
import Dashboard from './routes/Admin/Dashboard';
import Productos, {
	loader as productosLoader,
	action as productosAction,
} from './routes/Admin/Productos/Productos';
import CrearProducto, {
	action as crearProductoAction,
	loader as crearProductoLoader,
} from './routes/Admin/Productos/CrearProducto';
import EditarProducto, {
	loader as editarProductoLoader,
	action as editarProductoAction,
} from './routes/Admin/Productos/EditarProducto';

import Ventas from './routes/Admin/Ventas';
import Aspecto from './routes/Admin/Aspecto';
import Pedidos from './routes/Admin/Pedidos';
import Colores from './routes/Admin/Colores';
import Edades from './routes/Admin/Edades';
import Generos from './routes/Admin/Generos';

import Categorias, {
	loader as categoriasLoader,
	action as categoriasAction,
} from './routes/Admin/Categorias/Categorias';

import CrearCategoria, {
	loader as crearCategoriaLoader,
	action as crearCategoriaAction,
} from './routes/Admin/Categorias/CrearCategoria';

import EditarCategoria, {
	loader as editarCategoriaLoader,
	action as editarCategoriaAction,
} from './routes/Admin/Categorias/EditarCategoria';
import Verificar, {
	action as verificarAction,
} from './routes/Publico/Verificar';
import Verificado, {
	loader as verificadoLoader,
} from './routes/Publico/Verificado';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,

		children: [
			// -- ADMIN -- //
			{
				path: '/admin',
				element: <Admin />,
				loader: adminLoader,
				children: [
					{ index: true, element: <Dashboard /> },
					{
						path: '/admin/dashboard',
						element: <Dashboard />,
					},
					{
						path: '/admin/productos',
						element: <Productos />,
						loader: productosLoader,
						action: productosAction,
					},
					{
						path: '/admin/productos/crear',
						element: <CrearProducto />,
						action: crearProductoAction,
						loader: crearProductoLoader,
					},
					{
						path: '/admin/productos/:registroId/editar',
						element: <EditarProducto />,
						action: editarProductoAction,
						loader: editarProductoLoader,
					},
					{
						path: '/admin/ventas',
						element: <Ventas />,
					},
					{
						path: '/admin/aspecto',
						element: <Aspecto />,
					},
					{
						path: '/admin/pedidos',
						element: <Pedidos />,
					},
					{
						path: '/admin/colores',
						element: <Colores />,
					},
					// -- CATEGORIAS -- //
					{
						path: '/admin/categorias',
						element: <Categorias />,
						loader: categoriasLoader,
						action: categoriasAction,
					},
					{
						path: '/admin/categorias/crear',
						element: <CrearCategoria />,
						loader: crearCategoriaLoader,
						action: crearCategoriaAction,
					},
					{
						path: '/admin/categorias/:categoriaId/editar',
						element: <EditarCategoria />,
						loader: editarCategoriaLoader,
						action: editarCategoriaAction,
					},
					{
						path: '/admin/edades',
						element: <Edades />,
					},
					{
						path: '/admin/generos',
						element: <Generos />,
					},
				],
			},
			// -- NO ADMIN -- //
			{
				path: '/user',
				element: <User />,
				loader: headerLoader,
				children: [
					{ index: true, element: <Login /> },
					{
						path: '/user/login',
						element: <Login />,
						action: loginAction,
					},
					{
						path: '/user/registro',
						element: <Registro />,
						action: registroAction,
					},
					{
						path: '/user/mensaje-verificar',
						element: <Verificar />,
						action: verificarAction,
					},
					{
						path: '/user/verificar/:id/:hash',
						loader: verificadoLoader,
						element: <Verificado />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId="258932292798-6pc858uab9si4varr8e7e6rbjpe3t29s.apps.googleusercontent.com">
			<RouterProvider router={router} />
		</GoogleOAuthProvider>
	</React.StrictMode>
);
