import { Link, Form } from 'react-router-dom';
import Select from 'react-select';

export default function Lista({ urlVolver, titulo, botonSubmit, campos  }) {
	return (
		<div className="formulario">
			<Link to={`/admin/${urlVolver}`} className="formulario__boton">
				Volver
			</Link>

			<h3 className="formulario__titulo">{titulo}</h3>

			<Form method="post" className="formulario__contenedor">
				{campos.map(campo => {
					return (
						<div key={campo.id} className="formulario__campo">
							<div className="formulario__base">
								<label htmlFor={campo.campoId} className="formulario__label">
									{campo.campoNombre}
								</label>

								{/* SI NO ES SELECT */}
								{(campo.campoTipo !== 'select' && campo.Tipo !== 'file') && (
									<input
										id={campo.campoId}
										name={campo.campoNameYError}
										type={campo.campoTipo}
										className="formulario__input"
										defaultValue={campo.campoValue}
									/>
								)}

								{/* SI ES SELECT */}
								{campo.campoTipo === 'select' && campo.dependeDe ? (
									<Select
										options={campo.campoOptions}
										value={campo.campoValue}
										onChange={campo.campoOnChange}
										name={campo.campoNameYError}
										placeholder="Selecciona"
										styles={campo.estilosSelect}
										NoOptionsMessage={campo.mensajeSiNoHayOpciones}
									/>
								) : (
									<p className="formulario__sin-elegir">{campo.mensajeVacio}</p>
								)}
								
								{/* SI ES FILE */}
								{campo.campoTipo === 'file' && (
									<div {...(campo.campoFileSettings.getRootProps( campo.campoFileSettings.fileStyle ))}>
										<input {...(campo.campoFileSettings.getInputProps())} />
										{ campo.campoFileSettings.isDragActive ? (
											<p className="formulario__imagen-texto">
												Arrastra los archivos aquí
											</p>
										) : (
											<p className="formulario__imagen-texto">
												Arrastra y suelta algunos archivos aquí, o haz click
												para explorar <br></br>
												TAMAÑO MAXIMO POR IMAGEN: 2MB NUMERO MAXIMO DE
												IMAGENES: 3
											</p>
										)}
									</div>
								)}
							</div>

							{campo.campoTipo === 'file' && (
								<aside style={campo.campoFileSettings.campoThumbsContainer}>{campo.campoFileSettings.campoThumbs}</aside>
							)}

							{campo.errores && campo.errores[campo.campoNameYError]
								? campo.errores[campo.campoNameYError].map((error, index) => {
										return (
											<div key={index} className="formulario__error">
												{error}
											</div>
										);
								  })
								: ''}
						</div>
					);
				})}

				<input
					type="submit"
					className="formulario__boton"
					value={botonSubmit}
				/>
			</Form>
		</div>
	);
}
