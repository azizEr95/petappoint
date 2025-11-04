import { useState, type ChangeEvent } from 'react';
import '../styles/search.modules.css';
import { Button } from 'react-bootstrap';

type SearchProps = {
  search: () => void
}

export function Search({search}: SearchProps) {
  let [searchTermName, setSearchTermName] = useState("");
  let [searchTermOrt, setSearchTermOrt] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let t = e.target;
    let typ = t.name;
    let wert = t.value;
    
    switch(typ) {
      case "Name":
        setSearchTermName(wert);
        console.log("Name: " + searchTermName);
        break;
      case "Ort":
        setSearchTermOrt(wert);
        console.log("Name: " + searchTermOrt);
        break;
    }
    
  }

    return (
    <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="search-container">
            <input id="searchFieldName" type="text" className="form-control search-input" placeholder="Name" name="Name" value={searchTermName} onChange={handleChange}/>
            <i className="bi bi-search search-icon"></i>
          </div>
          <div className="search-container">
            <input id="searchFieldOrt" type="text" className="form-control search-input" placeholder="Ort" name="Ort" value={searchTermOrt} onChange={handleChange}/>
            <i className="bi bi-geo-alt search-icon"></i>
          </div>
          <Button className="btn btn-primary" onClick={search}>Suchen</Button>
        </div>
    </div>
    )
}