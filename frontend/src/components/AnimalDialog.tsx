import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Button, Form, Modal, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { type AnimalracesType, type AnimalsCreateType, type AnimalsType, type AnimalTypeType, type AnimalUpdateType, type sexesType } from "../../../shared/schemas/ZodSchemas";
import Select, { type MultiValue } from 'react-select';
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllAnimalTypes } from "../api/AnimalTypeAPI";
import { createAnimal, editAnimal } from "../api/AnimalsAPI";
import { getRacesByAnimalID, getRacesByAnimalTypeID } from "../api/AnimalRacesAPI";
import { compareDates } from "../utils/DateToStringFormat";
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

// visibility from this component has to be handled from the parent component
export function AnimalDialog({ hideDialogNewAnimal, animalEdit }: CreateAnimalDialogProps) {
    const [status, setStatus] = useState<StatusCreateAnimalDialog>(StatusCreateAnimalDialog.selectAnimalType);
    const [showSelectAnimalType, setShowAnimalType] = useState(true);
    const [animalTypeAnimal, setAnimalTypeAnimal] = useState<AnimalTypeType>();
    // variables for Modal Dialog NewAnimal
    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [dateOfBirthIsExact, setDateOfBirthIsExact] = useState<"" | "Yes" | "No">("Yes");
    const [ageInMonth, setAgeInMonth] = useState(0); //is only used if dateOfBirthIsExact is No/false
    const [sex, setSexes] = useState<sexesType | undefined>(undefined);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [castrated, setCastrated] = useState<"" | "castrated" | "notCastrated">("");
    const [lifestyle, setLifestyle] = useState<"" | "lifestyleIsIndoor" | "lifestyleIsNotIndoor">("");
    const [selectedRaces, setSelectedRaces] = useState<MultiValue<{ value: AnimalracesType, label: string }>>([]);
    const [dateOfDeath, setDateOfDeath] = useState("");
    const [clickedSaveSubmit, setClickedSaveSubmit] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        name: string | undefined,
        dateOfBirth: string | undefined,
        dateOfBirthIsExact: string | undefined,
        sex: string | undefined,
        weight: string | undefined,
        height: string | undefined,
        castrated: string | undefined,
        lifestyle: string | undefined,
        dateOfDeath: string | undefined
    }>({
        name: undefined,
        dateOfBirth: undefined,
        dateOfBirthIsExact: undefined,
        sex: undefined,
        weight: undefined,
        height: undefined,
        castrated: undefined,
        lifestyle: undefined,
        dateOfDeath: undefined
    });

    // initialize if it is an edit dialog
    useEffect(() => {
        if (animalEdit !== undefined) {
            if (isSuccessAnimalType) {
                const typeEditAnimal = dataAnimalType.find((type) => {
                    if (type.id === animalEdit.animaltypeid) {
                        return type;
                    }
                });
                setAnimalTypeAnimal(typeEditAnimal)
            }
            setShowAnimalType(false);
            setName(animalEdit.name);
            if (animalEdit.dateofbirth !== null) {
                if (animalEdit.dateofbirthisexact) {
                    setDateOfBirthIsExact("Yes");

                    const monthAsNumber = animalEdit.dateofbirth.getMonth() + 1;
                    let monthAsString;
                    if (monthAsNumber <= 9) {
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
                setHeight(("" + animalEdit.heightincm / 100).replace(".", ","));
            }
            if (animalEdit.iscastrated) {
                setCastrated("castrated");
            } else {
                setCastrated("notCastrated");
            }
            if (animalEdit.lifestyleisindoors) {
                setLifestyle("lifestyleIsIndoor");
            } else {
                setLifestyle("lifestyleIsNotIndoor");
            }
            if (animalEdit.timeofdeath !== null) {
                const monthAsNumber = animalEdit.timeofdeath.getMonth() + 1;
                let monthAsString;
                if (monthAsNumber <= 9) {
                    monthAsString = "0" + monthAsNumber;
                } else {
                    monthAsString = monthAsNumber;
                }
                const dateAsString = animalEdit.timeofdeath.getFullYear() + "-" + monthAsString + "-" + animalEdit.timeofdeath.getDate();
                setDateOfDeath(dateAsString);
            }

            if (isSuccessRacesEdit) {
                const initialSelectedOptions = dataRacesEdit.map(race => ({
                    value: race,
                    label: race.name,
                }));
                setSelectedRaces(initialSelectedOptions);
            }
        }
    }, []);

    useEffect(() => {
        validate(false);
    }, [name, dateOfBirth, dateOfBirthIsExact, ageInMonth, sex, weight, height, castrated, lifestyle]);

    // get all Animaltypes 
    const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<Array<AnimalTypeType>>({
        queryKey: ['allAnimaltypes'],
        queryFn: () => getAllAnimalTypes(),
        retry: false
    });

    // get all Races from these Animaltype
    const { isSuccess: isSuccessRaces, data: dataRaces } = useQuery<Array<AnimalracesType>>({
        queryKey: ['Animalraces', animalTypeAnimal],
        queryFn: () => getRacesByAnimalTypeID(animalTypeAnimal?.id),
        retry: false,
        enabled: animalTypeAnimal !== undefined
    });

    // get all Races from these Animal if it is an edit
    const { isSuccess: isSuccessRacesEdit, data: dataRacesEdit } = useQuery<Array<AnimalracesType>>({
        queryKey: ['Animalraces', animalEdit],
        queryFn: () => getRacesByAnimalID(animalTypeAnimal?.id),
        retry: false,
        enabled: animalEdit !== undefined
    });

    // save the raceOptions from selectedAnimalType
    const raceOptions = useMemo(() => {
        if (!isSuccessRaces || dataRaces.length === 0) {
            return [];
        }
        console.log(isSuccessRaces)
        console.log(dataAnimalType)
        console.log(dataRaces)
        return dataRaces.map((x) => ({
            value: x,
            label: x.name,
        }));
    }, [isSuccessRaces, dataRaces]);

    const { mutate: mutateCreateAnimal } = useMutation({
        mutationFn: (animal: AnimalsCreateType) =>
            createAnimal(animal),
        onError: () => {
            // error by creating the animal
            console.log("error")
        },
        onSuccess: () => {
            // animal was successful created
            hideDialogNewAnimal()
        },
    })

    type AnimalEditPayload = {
        animalID: number
        animal: AnimalsCreateType
    }

    const { mutate: mutateEditAnimal } = useMutation({
        mutationFn: ({ animalID, animal }: AnimalEditPayload) =>
            editAnimal(animalID, animal),
        onError: () => {
            // error by editing the animal
            console.log("error")
        },
        onSuccess: () => {
            // animal was successful edited
            hideDialogNewAnimal()
        },
    })

    const handleSelectAnimalType = (animaltype: AnimalTypeType) => {
        setAnimalTypeAnimal(animaltype);
        handleChangeStatus();
    }

    const handleChangeStatus = () => {
        switch (status) {
            case StatusCreateAnimalDialog.selectAnimalType:
                setShowAnimalType(false);
                setStatus(StatusCreateAnimalDialog.editInfos);
                break;
            case StatusCreateAnimalDialog.editInfos:
                setStatus(StatusCreateAnimalDialog.created);
                break;
        }
    }

    const handleDateOfBirthIsExactChange = (newValue: string) => {
        if (newValue === "Yes") {
            setDateOfBirthIsExact(newValue);
        } else if (newValue === "No") {
            setDateOfBirthIsExact(newValue);
        } else {
            setDateOfBirthIsExact("");
        }
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
            case 'dateOfDeath':
                setDateOfDeath(value);
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
                    setCastrated("castrated");
                } else if (value === "notCastrated") {
                    setCastrated("notCastrated");
                } else if (value === "") {
                    setCastrated("");
                } else {
                    throw Error("options in CreateNewAnimal by castrated are incorrect");
                }
                break;
            case 'lifestyle':
                if (value === "lifestyleIsIndoor") {
                    setLifestyle("lifestyleIsIndoor");
                } else if (value === "lifestyleIsNotIndoor") {
                    setLifestyle("lifestyleIsNotIndoor");
                } else if (value === "") {
                    setLifestyle("");
                } else {
                    throw Error("options in CreateNewAnimal by lifestyle are incorrect");
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

    const handleSelectRaces = (raceSelect: MultiValue<{ value: AnimalracesType, label: string }>) => {
        setSelectedRaces(raceSelect);
    }

    // returns true if all inputs are valid
    const validate = (validateFromSubmit: boolean): boolean => {
        let allUndefined: boolean = true;
        if (validateFromSubmit || clickedSaveSubmit) {
            setClickedSaveSubmit(true);
            if (name.trim().length < 2) {
                setValidationErrors((prevState) => ({ ...prevState, name: "Der Name muss eine Länge von mind. 2 Zeichen haben." }));
                allUndefined = false;
            } else if (!/^[a-zA-Z '`-]+$/.test(name)) {
                setValidationErrors((prevState) => ({ ...prevState, name: "Dieses Feld darf nur Buchstaben enthalten." }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, name: undefined }));
            }

            if (validateDateOfBirthIsInvalid()) {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirth: "Bitte ein richtiges Datum auswählen." }));
                if (dateOfBirthIsExact === "Yes") {
                    allUndefined = false;
                }
            } else {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirth: undefined }));
            }

            if (validateDateOfDeathIsInvalid()) { // validation dateOfDeath
                setValidationErrors((prevState) => ({ ...prevState, dateOfDeath: "Das Todesdatum muss nach dem Geburtsdatum sein." }));
                if (compareDates(new Date(dateOfDeath), new Date()) > 0) {
                    setValidationErrors((prevState) => ({ ...prevState, dateOfDeath: "Das Todesdatum darf nicht in der Zukunft sein." }));
                }
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, dateOfDeath: undefined }));
            }

            if (ageInMonth === 0) {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirthIsExact: "Bitte ein Geburtsdatum auswählen." }));
                if (dateOfBirthIsExact === "No") {
                    allUndefined = false;
                }
            } else {
                setValidationErrors((prevState) => ({ ...prevState, dateOfBirthIsExact: undefined }));
            }

            if (sex === undefined) {
                setValidationErrors((prevState) => ({ ...prevState, sex: "Bitte ein Geschlecht auswählen." }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, sex: undefined }));
            }

            if (castrated === "") {
                setValidationErrors((prevState) => ({ ...prevState, castrated: "Bitte eine Option auswählen." }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, castrated: undefined }));
            }

            if (lifestyle === "") {
                setValidationErrors((prevState) => ({ ...prevState, lifestyle: "Bitte eine Option auswählen." }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, lifestyle: undefined }));
            }

            const weightNumber: number = parseFloat(weight.replace(",", "."));
            if (weightNumber >= 1000) {
                setValidationErrors((prevState) => ({ ...prevState, weight: "Bitte ein richtiges Gewicht angeben. (max 1000kg)" }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, weight: undefined }));
            }

            const heightNumber: number = parseInt(height.replace(",", "."));
            if (heightNumber >= 12) {
                setValidationErrors((prevState) => ({ ...prevState, height: "Bitte eine richtige Größe angeben. (max 12m)" }));
                allUndefined = false;
            } else {
                setValidationErrors((prevState) => ({ ...prevState, height: undefined }));
            }
        }
        return allUndefined;
    }

    const handleSubmitAnimalDialog = () => {
        const allUndefined = validate(true);

        if (allUndefined) { // all Inputs are valid and correct
            const weightInGram = Math.floor(parseFloat(weight.replace(",", ".")) * 1000);
            const heightInCm = Math.floor(parseFloat(height.replace(",", ".")) * 100);

            let animal: AnimalsCreateType = {
                name: name,
                sex: sex !== undefined ? sex : "notknown",
                dateofbirth: null, //new Date(dateOfBirth), //if Backend Route is fixed new Date uebergeben
                dateofbirthisexact: dateOfBirthIsExact === "Yes" ? true : false,
                weightingram: weightInGram,
                heightincm: heightInCm,
                timeofdeath: null,
                iscastrated: castrated === "castrated" ? true : false,
                lifestyleisindoors: lifestyle === "lifestyleIsIndoor" ? true : false,
                animaltypeid: animalTypeAnimal !== undefined ? animalTypeAnimal.id : 1,
                animalgroupid: 1 // should be null, Backend Route has to be fixed
            }

            if (animalEdit === undefined) { // new animal
                mutateCreateAnimal(animal);
                handleChangeStatus();
            } else { // edit animal
                let animalUpdate: AnimalUpdateType = { // to be removed, should be also AnimalCreateType by edit
                    ...animal,
                    id: animalEdit.id
                }
                mutateEditAnimal({ animalID: animalEdit.id, animal: animalUpdate });
                handleChangeStatus();
            }
        }
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

    const validateDateOfDeathIsInvalid = (): boolean => {
        if (dateOfDeath === "") {
            return false; // no dateOfDeath is selected
        } else {
            try {
                const date = new Date(dateOfDeath);
                const birthDate = new Date(dateOfBirth);
                if (date.getFullYear() >= birthDate.getFullYear() && compareDates(date, birthDate) >= 0 && compareDates(new Date(dateOfDeath), new Date()) <= 0) {
                    return false; // dateOfBirth is valid
                } else {
                    return true; //year or month or day or all together are invalid
                }
            } catch {
                return true; // error by parsing date
            }
        }
    }

    if (isSuccessAnimalType) {
        const animaltypes = dataAnimalType;

        // show is always true, visibility is changed from the parent component
        return <Modal show={true} onHide={hideDialogNewAnimal}>
            <Modal.Header closeButton>
                {animalEdit === undefined && animalTypeAnimal !== undefined && <Modal.Title>Neues Tier anlegen ({animalTypeAnimal?.name})</Modal.Title>}
                {animalEdit === undefined && animalTypeAnimal === undefined && <Modal.Title>Neues Tier anlegen</Modal.Title>}
                {animalEdit !== undefined && <Modal.Title>Tier bearbeiten</Modal.Title>}
            </Modal.Header>

            <Modal.Body>
                {showSelectAnimalType && (
                    <div className="animal-type-selection">
                        <div className="selection-label">Tierart auswählen:</div>
                        <div className="animal-type-buttons">
                            {animaltypes.map((animaltype) => (
                                <Button
                                    key={animaltype.id}
                                    variant="success"
                                    onClick={() => handleSelectAnimalType(animaltype)}
                                    className="animal-type-button"
                                >
                                    {animaltype.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                {!showSelectAnimalType && <Form className="animal-form">
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Tiername*:</Form.Label>
                        <Form.Control id="AnimalName" type="text" placeholder="z.B. Nala" name="name" onChange={handleChange} value={name} isInvalid={validationErrors.name !== undefined} />
                        <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Geburtsdatum*:</Form.Label>
                        <div className="mb-2">Ich kenne das genaue Geburtsdatum:</div>
                        <ToggleButtonGroup type="radio" value={dateOfBirthIsExact} name="dateOfBirthIsExact" onChange={handleDateOfBirthIsExactChange}>
                            <ToggleButton id="dateOfBirthIsExactNo" value="No" variant="outline-primary">Nein</ToggleButton>
                            <ToggleButton id="dateOfBirthIsExactYes" value="Yes" variant="outline-primary">Ja</ToggleButton>
                        </ToggleButtonGroup>
                    </Form.Group>
                    {dateOfBirthIsExact === "Yes" &&
                        <Form.Group className="mb-3">
                            <Form.Control id="AnimalDateOfBirth" type="date" name="dateOfBirth" onChange={handleChange} value={dateOfBirth} isInvalid={validationErrors.dateOfBirth !== undefined} />
                            <Form.Control.Feedback type="invalid">{validationErrors.dateOfBirth}</Form.Control.Feedback>
                        </Form.Group>
                    }
                    {dateOfBirthIsExact === "No" &&
                        <Form.Group className="mb-3">
                            <Form.Control as="select" name="dateOfBirthSelect" value={ageInMonth} onChange={handleChange} isInvalid={validationErrors.dateOfBirthIsExact !== undefined} >
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
                            <Form.Control.Feedback type="invalid">{validationErrors.dateOfBirthIsExact}</Form.Control.Feedback>
                        </Form.Group>}
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Geschlecht*:</Form.Label>
                        <Form.Control as="select" name="sex" value={sex} onChange={handleChange} isInvalid={validationErrors.sex !== undefined}>
                            <option value="">Bitte auswählen</option>
                            <option value={"male"}>männlich</option>
                            <option value={"female"}>weiblich</option>
                            <option value={"notknown"}>unbekannt</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{validationErrors.sex}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Kastriert*:</Form.Label>
                        <Form.Control as="select" name="castrated" value={castrated} onChange={handleChange} isInvalid={validationErrors.castrated !== undefined}>
                            <option value="">Bitte auswählen</option>
                            <option value="castrated">kastriert</option>
                            <option value="notCastrated">nicht kastriert</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{validationErrors.castrated}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Lifestyle*:</Form.Label>
                        <Form.Control as="select" name="lifestyle" value={lifestyle} onChange={handleChange} isInvalid={validationErrors.lifestyle !== undefined}>
                            <option value="">Bitte auswählen</option>
                            <option value="lifestyleIsIndoor">in der Wohnung</option>
                            <option value="lifestyleIsNotIndoor">im Freien</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{validationErrors.lifestyle}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Größe in m: (optional)</Form.Label>
                        <Form.Control id="AnimalHeight" type="text" placeholder="z.B. 0,89" name="height" onChange={handleChange} value={height} isInvalid={validationErrors.height !== undefined} />
                        <Form.Control.Feedback type="invalid">{validationErrors.height}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-CreateAnimal">Gewicht in kg: (optional)</Form.Label>
                        <Form.Control id="AnimalWeight" type="text" placeholder="z.B. 1,5" name="weight" onChange={handleChange} value={weight} isInvalid={validationErrors.weight !== undefined} />
                        <Form.Control.Feedback type="invalid">{validationErrors.weight}</Form.Control.Feedback>
                    </Form.Group>
                    {raceOptions.length > 0 && <>
                        <div>Rasse auswählen: (optional, mehrere möglich)</div>
                        <Select closeMenuOnSelect={false} isMulti={true} placeholder="Bitte Rassen auswählen" options={raceOptions} value={selectedRaces} onChange={handleSelectRaces} />
                    </>}
                    {animalEdit !== undefined && <>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-CreateAnimal">Todesdatum: (optional)</Form.Label>
                            <Form.Control id="TimeOfDeath" type="date" name="dateOfDeath" onChange={handleChange} value={dateOfDeath} isInvalid={validationErrors.dateOfDeath !== undefined} />
                            <Form.Control.Feedback type="invalid">{validationErrors.dateOfDeath}</Form.Control.Feedback>
                        </Form.Group></>
                    }
                    <div>* = Pflichtfeld</div>
                </Form>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideDialogNewAnimal}>Abbrechen</Button>
                {!showSelectAnimalType && animalEdit === undefined && <Button variant="primary" onClick={handleSubmitAnimalDialog}>Tier anlegen</Button>}
                {!showSelectAnimalType && animalEdit !== undefined && <Button variant="primary" onClick={handleSubmitAnimalDialog}>Speichern</Button>}
            </Modal.Footer>
        </Modal>;
    }
}
