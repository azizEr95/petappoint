import { useState, type ChangeEvent } from 'react';
import '../styles/search.modules.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from '@tanstack/react-router';

type SearchFieldProps = {
  searchNameBeginn: string,
  searchOrtBeginn: string
}

export function SearchField({searchNameBeginn, searchOrtBeginn}: SearchFieldProps) {
  let [searchTermName, setSearchTermName] = useState(searchNameBeginn);
  let [searchTermOrt, setSearchTermOrt] = useState(searchOrtBeginn);
  const navigate = useNavigate();

  //bei Suche ohne Ortangabe aktuellen Standort nehmen??: https://wiki.selfhtml.org/wiki/Geolocation
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let t = e.target;
    let typ = t.name;
    let wert = t.value;

    switch (typ) {
      case "Name":
        setSearchTermName(wert);
        break;
      case "Ort":
        setSearchTermOrt(wert);
        break;
    }
  }

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        name: searchTermName,
        ort: searchTermOrt
      }
    })
  }

    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="search-container">
            <input id="searchFieldName" type="text" className="form-control search-input" placeholder="Name" name="Name" value={searchTermName} onChange={handleChange} />
            <i className="bi bi-search search-icon"></i>
          </div>
          <div className="search-container">
            <input id="searchFieldOrt" type="text" className="form-control search-input" placeholder="Ort" name="Ort" value={searchTermOrt} onChange={handleChange} />
            <i className="bi bi-geo-alt search-icon"></i>
          </div>
          <Button className="btn btn-primary" onClick={handleSearch}>Suchen</Button>
        </div>
      </div>
    )
  }