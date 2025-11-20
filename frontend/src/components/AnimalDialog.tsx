import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Form, Modal, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { type AnimalsType, type husbandarySystemType, type sexesType } from "../../../shared/schemas/ZodSchemas";
import Select, { type MultiValue } from 'react-select';
import '../styles/components/AnimalDialog.scss';

type CreateAnimalDialogProps = {
    hideDialogNewAnimal: () => void,
    animalEdit: AnimalsType | undefined
}

enum StatusCreateAnimalDialog {
    selectAnimalType = 'SELECT_ANIMAL_TYPE',
    editInfos = 'EDIT_INFOS',
    created = 'CREATED',
}

//diese Komponente allgemein umbennen, damit auch fuer edit benutzt werden kann (animal als Props uebergeben, wenn animalProps !== null dann edit, sonst neu)

// TODO: bei edit optional save day of death, then it is not possible to make an appoitment for this animal
// visibility from this component has to be handled from the parent component
export function AnimalDialog({ hideDialogNewAnimal, animalEdit }: CreateAnimalDialogProps) {
    const [status, setStatus] = useState<StatusCreateAnimalDialog>(StatusCreateAnimalDialog.selectAnimalType);
    const [showSelectAnimalType, setShowAnimalType] = useState(true);
    const [animaltypeNewAnimal, setAnimaltypeNewAnimal] = useState("");
    // variables for Modal Dialog NewAnimal
    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [dateOfBirthIsExact, setDateOfBirthIsExact] = useState("Yes");
    const [ageInMonth, setAgeInMonth] = useState(0); //is only used if dateOfBirthIsExact is No/false
    const [sex, setSexes] = useState<sexesType | undefined>(undefined);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [isCastrated, setIsCastrated] = useState<boolean>();
    const [castrated, setCastrated] = useState("");
    const [lifestyle, setLifestyle] = useState<husbandarySystemType | null>(null);
    const [selectedRaces, setSelectedRaces] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [clickedSaveSubmit, setClickedSaveSubmit] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        name: string | undefined,
        dateOfBirth: string | undefined,
        dateOfBirthIsExact: string | undefined,
        sex: string | undefined,
        weight: string | undefined,
        height: string | undefined,
        castrated: string | undefined
    }>({
        name: undefined,
        dateOfBirth: undefined,
        dateOfBirthIsExact: undefined,
        sex: undefined,
        weight: undefined,
        height: undefined,
        castrated: undefined
    });

    // initialize if it is an edit dialog
    useEffect(() => {
        if (animalEdit !== undefined) {
            setShowAnimalType(false);
            setName(animalEdit.name);
            if (animalEdit.dateofbirth !== null) {
                if (animalEdit.dateofbirthisexact) {
                    setDateOfBirthIsExact("Yes");

                    const monthAsNumber = animalEdit.dateofbirth.getMonth() +1;
                    let monthAsString;
                    if(monthAsNumber <= 9) {
                        monthAsString = "0" + monthAsNumber;
                    } else {
                        monthAsString = monthAsNumber;
                    }
                    const dateAsString = animalEdit.dateofbirth.getFullYear() + "-" + monthAsString + "-" + animalEdit.dateofbirth.getDate();
                    setDateOfBirth(dateAsString);
                } else {
                    const now = new Date();
                    setDateOfBirthIsExact("No");
                    const yearDiff = now.getFullYear() - animalEdit.dateofbirth.getFullYear();
                    const monthDiff = now.getMonth() - animalEdit.dateofbirth.getMonth();
                    const ageMonth = 12 * yearDiff + monthDiff;
                    if (ageMonth > 180) {// the cases have to be same as the value in the select
                        setAgeInMonth(204);
                    } else if (ageMonth > 120) {
                        setAgeInMonth(150);
                    } else if (ageMonth > 96) {
                        setAgeInMonth(108);
                    } else if (ageMonth > 72) {
                        setAgeInMonth(84);
                    } else if (ageMonth > 48) {
                        setAgeInMonth(60);
                    } else if (ageMonth > 24) {
                        setAgeInMonth(36);
                    } else if (ageMonth > 6) {
                        setAgeInMonth(15);
                    } else {
                        setAgeInMonth(6);
                    }

                }
            }
            setSexes(animalEdit.sex);
            if (animalEdit.weightingram !== null) {
                setWeight(("" + animalEdit.weightingram / 1000).replace(".", ","));
            }
            if (animalEdit.heightincm !== null) {
                setHeight(("" + animalEdit.heightincm / 100).replace(".",","));
            }
            setIsCastrated(animalEdit.iscastrated);
            if(animalEdit.iscastrated){
                setCastrated("castrated");
            } else {
                setCastrated("notCastrated");
            }
            // Races ergaenzen (neue Route benoetigt)
            // Lifestyle ergaenzen
        }
    },[]);

    useEffect(() => {
        validate(false);
    }, [name, dateOfBirth, dateOfBirthIsExact, ageInMonth, sex, weight, height, castrated]);


    //animaltypes vom Backend abfragen, folgt spaeter
    const animaltypes = ['Hund', 'Katze', 'Kleintier'];

    // Rassen vom entsprechenden Typ abfragen, passiert erst nachdem Animaltyp ausgewaehlt wurde
    // mit enabled Abfrage (useQuery) erst nach Bedingung starten
    //wenn leeres Array zurueckgegeben wurde gibt es fuer diese Art keine Rassen (dann auch keine anzeigen)
    const races = [
        { value: '1', label: 'Labrador' },
        { value: '2', label: 'Pudel' },
        { value: '3', label: 'Schäferhund' },
        { value: '4', label: 'Labrador' },
        { value: '5', label: 'Pudel' },
        { value: '6', label: 'Schäferhund' },
        { value: '7', label: 'Labrador' },
        { value: '8', label: 'Pudel' },
        { value: '9', label: 'Schäferhund' },
        { value: '10', label: 'Labrador' },
        { value: '11', label: 'Pudel' },
        { value: '12', label: 'Schäferhund' }
    ];

    const handleSelectAnimalType = (animaltype: string) => {
        setAnimaltypeNewAnimal(animaltype);
        handleChangeStatus();
    }

    const handleChangeStatus = () => {
        switch (status) {
            case StatusCreateAnimalDialog.selectAnimalType:
                setShowAnimalType(false);
                setStatus(StatusCreateAnimalDialog.editInfos);
                break
            case StatusCreateAnimalDialog.editInfos:
                //nach diesem change tier erstellen

                setStatus(StatusCreateAnimalDialog.created);
                break
        }
    }

    const handleDateOfBirthIsExactChange = (newValue: string) => {
        setDateOfBirthIsExact(newValue);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const t = e.target
        const name = t.name
        const value = t.value
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'dateOfBirth':
                setDateOfBirth(value);
                break;
            case "dateOfBirthSelect":
                setAgeInMonth(parseInt(value));
                break;
            case 'sex':
                if (value === "male") {
                    setSexes("male");
                } else if (value === "female") {
                    setSexes("female");
                } else if (value === "notknown") {
                    setSexes("notknown");
                } else if (value === "notapplicable") {
                    setSexes("notapplicable");
                } else if (value === "") {
                    setSexes(undefined);
                } else {
                    throw Error("options in CreateNewAnimal by sexes are incorrect");
                }
                break;
            case 'castrated':
                if (value === "castrated") {
                    setIsCastrated(true);
                    setCastrated("castrated");
                } else if (value === "notCastrated") {
                    setIsCastrated(false);
                    setCastrated("notCastrated");
                } else if (value === "") {
                    setIsCastrated(undefined);
                    setCastrated("");
                } else {
                    throw Error("options in CreateNewAnimal by castrated are incorrect");
                }
                break;
            case 'height':
                let valueHeight = value.replace(/[^0-9,]/g, ''); // an input from letters is not allowed, only float numbers
                let valueCompleteHeight = valueHeight.split(",");  // check if there is only one ,

                if (valueCompleteHeight.length <= 1) {
                    setHeight(valueHeight);
                } else if (valueCompleteHeight.length <= 2 && valueCompleteHeight[1].length <= 2) {
                    setHeight(valueHeight);
                }
                break;
            case 'weight':
                let valueWeight = value.replace(/[^0-9,]/g, ''); // an input from letters is not allowed, only numbers
                let valueCompleteWeight = valueWeight.split(",")  // check if there is only one ,

                if (valueCompleteWeight.length <= 1) {
                    setWeight(valueWeight);
                } else if (valueCompleteWeight.length <= 2 && valueCompleteWeight[1].length <= 2) {
                    setWeight(valueWeight);
                }
                break;
        }
        validate(false);
    }

    const handleSelectRaces = (raceSelect: MultiValue<{ value: string, label: string }>) => {
        setSelectedRaces(raceSelect);
    }

    const validate = (validateFromSubmit: boolean) => {
        if (validateFromSubmit || clickedSaveSubmit) {
            setClickedSaveSubmit(true);
            if (name.trim().length < 2) {
                setValidationErrors((prevState) => ({ ...prevState, name: "Der Name muss eine Länge von mind. 2 Zeichen haben." }));
            } else if (!/^[a-zA-Z '`-]+$/.test(name)) {
                setValidationErrors((prevState) => ({ ...prevState, name: "Dieses Feld darf nur Buchstaben enthalten." }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, name: undefined }));
            }

            if (validateDateOfBirthIsInvalid()) {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirth: "Bitte ein richtiges Datum auswählen." }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirth: undefined }));
            }

            if (ageInMonth === 0) {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirthIsExact: "Bitte ein Geburtsdatum auswählen." }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirthIsExact: undefined }));
            }

            if (sex === undefined) {
                setValidationErrors((prevState) => ({ ...prevState, sex: "Bitte ein Geschlecht auswählen." }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, sex: undefined }));
            }

            if (castrated === "") {
                setValidationErrors((prevState) => ({ ...prevState, castrated: "Bitte eine Option auswählen." }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, castrated: undefined }));
            }

            const weightNumber: number = parseFloat(weight.replace(",", "."));
            if (weightNumber >= 1000) {
                setValidationErrors((prevState) => ({ ...prevState, weight: "Bitte ein richtiges Gewicht angeben. (max 1000kg)" }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, weight: undefined }));
            }

            const heightNumber: number = parseInt(height.replace(",", "."));
            if (heightNumber >= 12) {
                setValidationErrors((prevState) => ({ ...prevState, height: "Bitte eine richtige Größe angeben. (max 12m)" }));
            } else {
                setValidationErrors((prevState) => ({ ...prevState, height: undefined }));
            }
        }
    }

    const handleAddNewAnimal = () => {
        validate(true);
        //wie alle eingaben vor dem abschicken nochmals validieren
    }

    const validateDateOfBirthIsInvalid = (): boolean => {
        if (dateOfBirth === "") {
            return true;
        } else {
            try {
                const date = new Date(dateOfBirth);
                const now = new Date();
                if (date.getFullYear() > 1900 && date.getFullYear() <= now.getFullYear() && compareDates(date, now) <= 0) {
                    return false; // dateOfBirth is valid
                } else {
                    return true; //year or month or day or all together are invalid
                }
            } catch {
                return true; // error by parsing date
            }
        }
    }

    return (
        <Modal show={true} onHide={hideDialogNewAnimal} centered className="animal-dialog">
            <Modal.Header closeButton>
                <Modal.Title>
                    {animalEdit === undefined ? 'Neues Tier anlegen' : 'Tier bearbeiten'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {showSelectAnimalType && (
                    <div className="animal-type-selection">
                        <div className="selection-label">Tierart auswählen:</div>
                        <div className="animal-type-buttons">
                            {animaltypes.map((animaltype) => (
                                <Button
                                    key={animaltype}
                                    variant="success"
                                    onClick={() => handleSelectAnimalType(animaltype)}
                                    className="animal-type-button"
                                >
                                    {animaltype}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {!showSelectAnimalType && (
                    <Form className="animal-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Tiername*:</Form.Label>
                            <Form.Control
                                id="CreateAnimalName"
                                type="text"
                                placeholder="z.B. Bambi"
                                name="name"
                                onChange={handleChange}
                                value={name}
                                isInvalid={validationErrors.name !== undefined}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Geburtsdatum*:</Form.Label>
                            <div className="mb-2">Ich kenne das genaue Geburtsdatum:</div>
                            <ToggleButtonGroup
                                type="radio"
                                value={dateOfBirthIsExact}
                                name="dateOfBirthIsExact"
                                onChange={handleDateOfBirthIsExactChange}
                                className="mb-2"
                            >
                                <ToggleButton id="dateOfBirthIsExactNo" value="No" variant="outline-success">
                                    Nein
                                </ToggleButton>
                                <ToggleButton id="dateOfBirthIsExactYes" value="Yes" variant="outline-success">
                                    Ja
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {dateOfBirthIsExact === "Yes" && (
                                <Form.Control
                                    id="CreateAnimalDateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    onChange={handleChange}
                                    value={dateOfBirth}
                                    isInvalid={validationErrors.dateOfBirth !== undefined}
                                />
                            )}
                            {dateOfBirthIsExact === "No" && (
                                <Form.Control
                                    as="select"
                                    name="dateOfBirthSelect"
                                    value={ageInMonth}
                                    onChange={handleChange}
                                    isInvalid={validationErrors.dateOfBirthIsExact !== undefined}
                                >
                                    <option value={0}>Bitte auswählen</option>
                                    <option value={6}>jünger 6 Monate</option>
                                    <option value={15}>6-24 Monate</option>
                                    <option value={36}>2-4 Jahre</option>
                                    <option value={60}>4-6 Jahre</option>
                                    <option value={84}>6-8 Jahre</option>
                                    <option value={108}>8-10 Jahre</option>
                                    <option value={150}>10-15 Jahre</option>
                                    <option value={204}>älter 15 Jahre</option>
                                </Form.Control>
                            )}
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.dateOfBirth || validationErrors.dateOfBirthIsExact}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Geschlecht*:</Form.Label>
                            <Form.Control
                                as="select"
                                name="sex"
                                value={sex}
                                onChange={handleChange}
                                isInvalid={validationErrors.sex !== undefined}
                            >
                                <option value="">Bitte auswählen</option>
                                <option value="male">männlich</option>
                                <option value="female">weiblich</option>
                                <option value="notknown">unbekannt</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{validationErrors.sex}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kastriert*:</Form.Label>
                            <Form.Control
                                as="select"
                                name="castrated"
                                value={castrated}
                                onChange={handleChange}
                                isInvalid={validationErrors.castrated !== undefined}
                            >
                                <option value="">Bitte auswählen</option>
                                <option value="castrated">kastriert</option>
                                <option value="notCastrated">nicht kastriert</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{validationErrors.castrated}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Größe in m: (optional)</Form.Label>
                            <Form.Control
                                id="CreateAnimalHeight"
                                type="text"
                                placeholder="z.B. 1,10"
                                name="height"
                                onChange={handleChange}
                                value={height}
                                isInvalid={validationErrors.height !== undefined}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.height}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Gewicht in kg: (optional)</Form.Label>
                            <Form.Control
                                id="CreateAnimalWeight"
                                type="text"
                                placeholder="z.B. 4"
                                name="weight"
                                onChange={handleChange}
                                value={weight}
                                isInvalid={validationErrors.weight !== undefined}
                            />
                            <Form.Control.Feedback type="invalid">{validationErrors.weight}</Form.Control.Feedback>
                        </Form.Group>

                        {races.length > 0 && (
                            <Form.Group className="mb-3">
                                <Form.Label>Rasse auswählen: (optional, mehrere möglich)</Form.Label>
                                <Select
                                    closeMenuOnSelect={false}
                                    isMulti={true}
                                    placeholder="Bitte Rassen auswählen"
                                    options={races}
                                    value={selectedRaces}
                                    onChange={handleSelectRaces}
                                />
                            </Form.Group>
                        )}

                        <small className="text-muted">* = Pflichtfeld</small>
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-secondary" onClick={hideDialogNewAnimal}>
                    Abbrechen
                </Button>
                {!showSelectAnimalType && animalEdit === undefined && (
                    <Button variant="success" onClick={handleAddNewAnimal}>
                        Speichern
                    </Button>
                )}
                {!showSelectAnimalType && animalEdit !== undefined && (
                    <Button variant="success" onClick={handleAddNewAnimal}>
                        Speichern
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

// TODO: function is also in component NextAvailableAppointment, declare this only in extr file and use them in both
/**
 * gibt positive Zahl zurueck wenn date1 mehr in der zukunft ist als date2
 * wenn anders herum dann wird negative zahl zurueckgegeben
 * bei gleichen Datum wird 0 zurueckgegeben
 * 
 * @param date1 erstes Datum zum vergleichen
 * @param date2 zweites Datum zum vergleichen
 */
function compareDates(date1: Date, date2: Date): number {
    const dateToDayString = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };
  
    const date1String = dateToDayString(date1);
    const date2String = dateToDayString(date2);
  
    //einfach mit Strings vergleichen
    if (date1String > date2String) {
        return 1; // date1 ist spaeter
    } else if (date1String < date2String) {
        return -1; // date2 ist spaeter
    } else {
        return 0; // gleicher Tag
    }
  }