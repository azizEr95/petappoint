import '../styles/search.modules.css';

export function Search() {
    return (
    <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="search-container">
            <input type="text" className="form-control search-input" placeholder="Suche" />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>
    </div>
    )
}