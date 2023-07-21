import Header from "./Header"

export default function HeaderAdmin() {
  return (
    <header className="dashboard__header">
      <div className="dashboard__header-grid">
        <a href="/">
          <h2 className="dashboard__logo">
           
          </h2>
        </a>

        <nav className="dashboard__nav">
          <form action="/logout" method="POST" className="dashboard__form">
            <input type="submit" value="Cerrar Sesión" className="dashboard__submit--logout" />
          </form>
        </nav>
      </div>
    </header>
  )
}