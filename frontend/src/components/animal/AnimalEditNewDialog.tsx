import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  ToggleButton,
  ToggleButtonGroup,
  Image,
} from 'react-bootstrap'
import {
  type AddRacesToAnimalType,
  type AnimalracesType,
  type AnimalsCreateType,
  type AnimalsType,
  type AnimalTypeType,
  type AnimalUpdateType,
  type sexesType,
} from '../../../../shared/schemas/ZodSchemas'
import Select, { type MultiValue } from 'react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import {
  createAnimal,
  editAnimal,
  getPictureURLForAnimalId,
  uploadPictureForAnimalId,
} from '../../api/AnimalsAPI'
import {
  addRacesToAnimal,
  deleteAllRacesFromAnimal,
  getRacesByAnimalID,
  getRacesByAnimalTypeID,
} from '../../api/AnimalRacesAPI'
import {
  compareDates,
  getDateStringFromDate,
} from '../../utils/DateToStringFormat'
import '../../styles/components/AnimalDialog.scss'

type AnimalEditNewDialogProps = {
  hideDialogNewAnimal: () => void
  animalEdit: AnimalsType | undefined
}

// visibility from this component has to be handled from the parent component
export function AnimalEditNewDialog({
  hideDialogNewAnimal,
  animalEdit,
}: AnimalEditNewDialogProps) {
  const queryClient = useQueryClient()
  const [animalTypeAnimal, setAnimalTypeAnimal] = useState<
    AnimalTypeType | undefined
  >(undefined)
  // variables for Modal Dialog NewAnimal
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dateOfBirthIsExact, setDateOfBirthIsExact] = useState<
    '' | 'Yes' | 'No'
  >('Yes')
  const [ageInMonth, setAgeInMonth] = useState(0) //is only used if dateOfBirthIsExact is No/false
  const [dateOfBirthFromAgeInMonth, setDateOfBirthFromAgeInMonth] = useState('')
  const [sex, setSexes] = useState<sexesType | undefined>(undefined)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [castrated, setCastrated] = useState<'' | 'castrated' | 'notCastrated'>(
    '',
  )
  const [lifestyle, setLifestyle] = useState<
    '' | 'lifestyleIsIndoor' | 'lifestyleIsNotIndoor'
  >('')
  const [selectedRaces, setSelectedRaces] = useState<
    MultiValue<{ value: AnimalracesType; label: string }>
  >([])
  const [racesIdNumbers] = useState<number[]>([])
  const [dateOfDeath, setDateOfDeath] = useState('')
  const [clickedSaveSubmit, setClickedSaveSubmit] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    name: string | undefined
    dateOfBirth: string | undefined
    dateOfBirthIsExact: string | undefined
    sex: string | undefined
    weight: string | undefined
    height: string | undefined
    castrated: string | undefined
    lifestyle: string | undefined
    dateOfDeath: string | undefined
    animalType: string | undefined
  }>({
    name: undefined,
    dateOfBirth: undefined,
    dateOfBirthIsExact: undefined,
    sex: undefined,
    weight: undefined,
    height: undefined,
    castrated: undefined,
    lifestyle: undefined,
    dateOfDeath: undefined,
    animalType: undefined,
  })

  // BEGIN IMAGE FORM
  const [animalPictureURL, setAnimalPictureURL] = useState<string>(
    getPictureURLForAnimalId(animalEdit?.id ?? 0),
  )
  const [selectedPictureFile, setSelectedPictureFile] = useState<File>()
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    if (e.target.files !== null) {
      const file: File | undefined = e.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          console.error('Does not start with image.')
          return
        }

        // 2MB max
        if (file.size > 2 * 1024 * 1024) {
          console.error('File bigger than 2MB.')
          return
        }

        setSelectedPictureFile(file)
      }
    }
  }
  const onSubmitPicture = () => {
    if (!selectedPictureFile) {
      return
    }

    console.log('Uploading image 333.')
    if (animalEdit) {
      console.log('Uploading image.')
      uploadPictureForAnimalId(animalEdit.id, selectedPictureFile)
      setAnimalPictureURL(getPictureURLForAnimalId(animalEdit.id))
    }
  }

  // END IMAGE FORM

  // get all Animaltypes
  const { isSuccess: isSuccessAnimalType, data: dataAnimalType } = useQuery<
    Array<AnimalTypeType>
  >({
    queryKey: ['allAnimalTypes'],
    queryFn: () => getAllAnimalTypes(undefined),
    retry: false,
  })

  // get all Races from these Animal if it is an edit
  const { isSuccess: isSuccessRacesEdit, data: dataRacesEdit } = useQuery<
    Array<AnimalracesType>
  >({
    queryKey: ['Animalraces', animalEdit?.id],
    queryFn: () => getRacesByAnimalID(animalEdit?.id),
    retry: false,
    enabled: animalEdit !== undefined,
    staleTime: 0,
  })

  // initialize if it is an edit dialog
  useEffect(() => {
    if (animalEdit !== undefined) {
      if (isSuccessAnimalType) {
        const typeEditAnimal = dataAnimalType.find((type) => {
          if (type.id === animalEdit.animalTypeId) {
            return type
          }
        })
        setAnimalTypeAnimal(typeEditAnimal)
      }
      setName(animalEdit.name)
      if (animalEdit.dateOfBirth !== null) {
        if (animalEdit.dateOfBirthIsExact) {
          ;(setDateOfBirthIsExact('Yes'),
            setDateOfBirth(getDateStringFromDate(animalEdit.dateOfBirth)))
        } else {
          const now = new Date()
          setDateOfBirthIsExact('No')
          setDateOfBirthFromAgeInMonth(
            getDateStringFromDate(animalEdit.dateOfBirth),
          )
          const yearDiff =
            now.getFullYear() - animalEdit.dateOfBirth.getFullYear()
          const monthDiff = now.getMonth() - animalEdit.dateOfBirth.getMonth()
          const ageMonth = 12 * yearDiff + monthDiff
          if (ageMonth > 180) {
            // the cases have to be same as the value in the select
            setAgeInMonth(204)
          } else if (ageMonth > 120) {
            setAgeInMonth(150)
          } else if (ageMonth > 96) {
            setAgeInMonth(108)
          } else if (ageMonth > 72) {
            setAgeInMonth(84)
          } else if (ageMonth > 48) {
            setAgeInMonth(60)
          } else if (ageMonth > 24) {
            setAgeInMonth(36)
          } else if (ageMonth > 6) {
            setAgeInMonth(15)
          } else {
            setAgeInMonth(6)
          }
        }
      }
      setSexes(animalEdit.sex)
      if (animalEdit.weightInGram !== null) {
        setWeight(('' + animalEdit.weightInGram / 1000).replace('.', ','))
      }
      if (animalEdit.heightInCm !== null) {
        setHeight(('' + animalEdit.heightInCm / 100).replace('.', ','))
      }
      if (animalEdit.isCastrated) {
        setCastrated('castrated')
      } else {
        setCastrated('notCastrated')
      }
      if (animalEdit.lifestyleIsIndoors) {
        setLifestyle('lifestyleIsIndoor')
      } else {
        setLifestyle('lifestyleIsNotIndoor')
      }
      if (animalEdit.timeOfDeath !== null) {
        setDateOfDeath(getDateStringFromDate(animalEdit.timeOfDeath))
      }
    }
  }, [isSuccessAnimalType])

  useEffect(() => {
    if (animalEdit !== undefined && isSuccessRacesEdit) {
      const initialSelectedOptions = dataRacesEdit.map((race) => ({
        value: race,
        label: race.name,
      }))
      setSelectedRaces(initialSelectedOptions)
    }
  }, [isSuccessRacesEdit, dataRacesEdit])

  useEffect(() => {
    validate(false)
  }, [
    name,
    dateOfBirth,
    dateOfBirthIsExact,
    ageInMonth,
    sex,
    weight,
    height,
    castrated,
    lifestyle,
    animalTypeAnimal,
  ])

  useEffect(() => {
    const dateNotExact = new Date()
    dateNotExact.setMonth(dateNotExact.getMonth() - ageInMonth)
    setDateOfBirthFromAgeInMonth(getDateStringFromDate(dateNotExact))
  }, [ageInMonth])

  // get all Races from these Animaltype
  const { isSuccess: isSuccessRaces, data: dataRaces } = useQuery<
    Array<AnimalracesType>
  >({
    queryKey: ['Animalraces', animalTypeAnimal?.id],
    queryFn: () => getRacesByAnimalTypeID(animalTypeAnimal?.id),
    retry: false,
    enabled: animalTypeAnimal !== undefined,
  })

  // save the raceOptions from selectedAnimalType
  const raceOptions = useMemo(() => {
    if (!isSuccessRaces || dataRaces.length === 0) {
      return []
    }
    let options = dataRaces
    options = options.filter((race) => {
      let sameRace = selectedRaces.find((selRace) => {
        if (selRace.value.id === race.id) {
          return true
        }
      })
      if (sameRace !== undefined) {
        return false
      } else {
        return true
      }
    })
    if (selectedRaces.length + options.length !== dataRaces.length) {
      // not all options are currently shown
      dataRaces.map((race) => {
        let findSelect = selectedRaces.find((selRace) => {
          if (selRace.value.id === race.id) {
            return true
          }
        })
        let findOptions = selectedRaces.find((opRace) => {
          if (opRace.value.id === race.id) {
            return true
          }
        })
        if (findSelect === undefined && findOptions === undefined) {
          options.push(race)
        }
      })
    }
    return options.map((x) => ({
      value: x,
      label: x.name,
    }))
  }, [isSuccessRaces, dataRaces, selectedRaces])

  const { mutate: mutateCreateAnimal } = useMutation({
    mutationFn: (animal: AnimalsCreateType) => createAnimal(animal),
    onError: () => {
      setErrorText('Fehler beim Erstellen des Tieres')
    },
    onSuccess: (data) => {
      // add races to the created animal
      setErrorText('')
      const addRaces: AddRacesToAnimalType = {
        animalId: data.id,
        animalraceids: racesIdNumbers,
      }
      mutateAddRacesToAnimal(addRaces)
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
      setErrorText('Fehler beim Bearbeiten des Tieres')
    },
    onSuccess: (data) => {
      // animal was successful edited
      setErrorText('')
      mutateDeleteAllRaces(data.id)
    },
  })
  const { mutate: mutateAddRacesToAnimal } = useMutation({
    mutationFn: (animalID: AddRacesToAnimalType) => addRacesToAnimal(animalID),
    onError: () => {
      if (animalEdit === undefined) {
        setErrorText('Fehler beim Erstellen des Tieres')
      } else {
        setErrorText('Fehler beim Bearbeiten des Tieres')
      }
    },
    onSuccess: () => {
      // animalraces was successful edited
      setErrorText('')
      hideDialogNewAnimal()
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })

  const { mutate: mutateDeleteAllRaces } = useMutation({
    mutationFn: (animalID: number) => deleteAllRacesFromAnimal(animalID),
    onSuccess: () => {
      if (animalEdit !== undefined) {
        // is always not undefined because it is edit here
        const addRaces: AddRacesToAnimalType = {
          animalId: animalEdit.id,
          animalraceids: racesIdNumbers,
        }
        mutateAddRacesToAnimal(addRaces)
      }
    },
  })

  const handleDateOfBirthIsExactChange = (newValue: string) => {
    if (newValue === 'Yes') {
      setDateOfBirthIsExact(newValue)
    } else if (newValue === 'No') {
      setDateOfBirthIsExact(newValue)
    } else {
      setDateOfBirthIsExact('')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const t = e.target
    const name = t.name
    const value = t.value
    switch (name) {
      case 'name':
        setName(value)
        break
      case 'animalType':
        const selectedType = dataAnimalType?.find(
          (type) => type.id === parseInt(value),
        )
        setAnimalTypeAnimal(selectedType)
        break
      case 'dateOfBirth':
        setDateOfBirth(value)
        break
      case 'dateOfDeath':
        setDateOfDeath(value)
        break
      case 'dateOfBirthSelect':
        setAgeInMonth(parseInt(value))
        break
      case 'sex':
        if (value === 'male') {
          setSexes('male')
        } else if (value === 'female') {
          setSexes('female')
        } else if (value === 'not_known') {
          setSexes('not_known')
        } else if (value === 'not_applicable') {
          setSexes('not_applicable')
        } else if (value === '') {
          setSexes(undefined)
        } else {
          throw Error('options in CreateNewAnimal by sexes are incorrect')
        }
        break
      case 'castrated':
        if (value === 'castrated') {
          setCastrated('castrated')
        } else if (value === 'notCastrated') {
          setCastrated('notCastrated')
        } else if (value === '') {
          setCastrated('')
        } else {
          throw Error('options in CreateNewAnimal by castrated are incorrect')
        }
        break
      case 'lifestyle':
        if (value === 'lifestyleIsIndoor') {
          setLifestyle('lifestyleIsIndoor')
        } else if (value === 'lifestyleIsNotIndoor') {
          setLifestyle('lifestyleIsNotIndoor')
        } else if (value === '') {
          setLifestyle('')
        } else {
          throw Error('options in CreateNewAnimal by lifestyle are incorrect')
        }
        break
      case 'height':
        let valueHeight = value.replace(/[^0-9,]/g, '') // an input from letters is not allowed, only float numbers
        let valueCompleteHeight = valueHeight.split(',') // check if there is only one ,

        if (valueCompleteHeight.length <= 1) {
          setHeight(valueHeight)
        } else if (
          valueCompleteHeight.length <= 2 &&
          valueCompleteHeight[1].length <= 2
        ) {
          setHeight(valueHeight)
        }
        break
      case 'weight':
        let valueWeight = value.replace(/[^0-9,]/g, '') // an input from letters is not allowed, only numbers
        let valueCompleteWeight = valueWeight.split(',') // check if there is only one ,

        if (valueCompleteWeight.length <= 1) {
          setWeight(valueWeight)
        } else if (
          valueCompleteWeight.length <= 2 &&
          valueCompleteWeight[1].length <= 2
        ) {
          setWeight(valueWeight)
        }
        break
    }
    validate(false)
  }

  const handleSelectRaces = (
    raceSelect: MultiValue<{ value: AnimalracesType; label: string }>,
  ) => {
    setSelectedRaces(raceSelect)
  }

  // returns true if all inputs are valid
  const validate = (validateFromSubmit: boolean): boolean => {
    let allUndefined: boolean = true
    if (validateFromSubmit || clickedSaveSubmit) {
      setClickedSaveSubmit(true)

      if (animalTypeAnimal === undefined) {
        setValidationErrors((prevState) => ({
          ...prevState,
          animalType: 'Bitte eine Tierart auswählen.',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          animalType: undefined,
        }))
      }

      if (name.trim().length < 2) {
        setValidationErrors((prevState) => ({
          ...prevState,
          name: 'Der Name muss eine Länge von mind. 2 Zeichen haben.',
        }))
        allUndefined = false
      } else if (!/^[a-zA-Z '`-]+$/.test(name)) {
        setValidationErrors((prevState) => ({
          ...prevState,
          name: 'Dieses Feld darf nur Buchstaben enthalten.',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({ ...prevState, name: undefined }))
      }

      if (validateDateOfBirthIsInvalid()) {
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfBirth: 'Bitte ein richtiges Datum auswählen.',
        }))
        if (dateOfBirthIsExact === 'Yes') {
          allUndefined = false
        }
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfBirth: undefined,
        }))
      }

      if (validateDateOfDeathIsInvalid()) {
        // validation dateOfDeath
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfDeath: 'Das Todesdatum muss nach dem Geburtsdatum sein.',
        }))
        if (compareDates(new Date(dateOfDeath), new Date()) > 0) {
          setValidationErrors((prevState) => ({
            ...prevState,
            dateOfDeath: 'Das Todesdatum darf nicht in der Zukunft sein.',
          }))
        }
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfDeath: undefined,
        }))
      }

      if (ageInMonth === 0) {
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfBirthIsExact: 'Bitte ein Geburtsdatum auswählen.',
        }))
        if (dateOfBirthIsExact === 'No') {
          allUndefined = false
        }
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          dateOfBirthIsExact: undefined,
        }))
      }

      if (sex === undefined) {
        setValidationErrors((prevState) => ({
          ...prevState,
          sex: 'Bitte ein Geschlecht auswählen.',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({ ...prevState, sex: undefined }))
      }

      if (castrated === '') {
        setValidationErrors((prevState) => ({
          ...prevState,
          castrated: 'Bitte eine Option auswählen.',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          castrated: undefined,
        }))
      }

      if (lifestyle === '') {
        setValidationErrors((prevState) => ({
          ...prevState,
          lifestyle: 'Bitte eine Option auswählen.',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          lifestyle: undefined,
        }))
      }

      const weightNumber: number = parseFloat(weight.replace(',', '.'))
      if (weightNumber >= 1000) {
        setValidationErrors((prevState) => ({
          ...prevState,
          weight: 'Bitte ein richtiges Gewicht angeben. (max 1000kg)',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          weight: undefined,
        }))
      }

      const heightNumber: number = parseInt(height.replace(',', '.'))
      if (heightNumber >= 12) {
        setValidationErrors((prevState) => ({
          ...prevState,
          height: 'Bitte eine richtige Größe angeben. (max 12m)',
        }))
        allUndefined = false
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          height: undefined,
        }))
      }
    }
    return allUndefined
  }

  const handleSubmitAnimalDialog = () => {
    const allUndefined = validate(true)
    if (allUndefined) {
      // all Inputs are valid and correct
      const weightInGram = Math.floor(
        parseFloat(weight.replace(',', '.')) * 1000,
      )
      const heightInCm = Math.floor(parseFloat(height.replace(',', '.')) * 100)

      const animal: AnimalsCreateType = {
        name: name,
        sex: sex !== undefined ? sex : 'not_known',
        dateOfBirth:
          dateOfBirthIsExact === 'Yes'
            ? new Date(dateOfBirth)
            : new Date(dateOfBirthFromAgeInMonth),
        dateOfBirthIsExact: dateOfBirthIsExact === 'Yes' ? true : false,
        weightInGram: weightInGram,
        heightInCm: heightInCm,
        timeOfDeath: dateOfDeath !== '' ? new Date(dateOfDeath) : null,
        isCastrated: castrated === 'castrated' ? true : false,
        lifestyleIsIndoors: lifestyle === 'lifestyleIsIndoor' ? true : false,
        animalTypeId: animalTypeAnimal !== undefined ? animalTypeAnimal.id : 1,
        animalGroupId: null, // should be null, Backend Route has to be fixed
      }
      selectedRaces.forEach((race) => {
        // save all ids from the selected races
        racesIdNumbers.push(race.value.id)
      })
      if (animalEdit === undefined) {
        // new animal
        mutateCreateAnimal(animal)
      } else {
        // edit animal
        let animalUpdate: AnimalUpdateType = {
          ...animal,
          id: animalEdit.id,
        }
        mutateEditAnimal({ animalID: animalEdit.id, animal: animalUpdate })
      }
    }
  }

  const validateDateOfBirthIsInvalid = (): boolean => {
    if (dateOfBirth === '') {
      return true
    } else {
      try {
        const date = new Date(dateOfBirth)
        const now = new Date()
        if (
          date.getFullYear() > 1900 &&
          date.getFullYear() <= now.getFullYear() &&
          compareDates(date, now) <= 0
        ) {
          return false // dateOfBirth is valid
        } else {
          return true // year or month or day or all together are invalid
        }
      } catch {
        return true // error by parsing date
      }
    }
  }

  const validateDateOfDeathIsInvalid = (): boolean => {
    if (dateOfDeath === '') {
      return false // no dateOfDeath is selected
    } else {
      try {
        const date = new Date(dateOfDeath)
        let birthDate = new Date(dateOfBirth)
        if (dateOfBirthIsExact === 'No') {
          birthDate = new Date(dateOfBirthFromAgeInMonth)
        }
        if (
          date.getFullYear() >= birthDate.getFullYear() &&
          compareDates(date, birthDate) >= 0 &&
          compareDates(new Date(dateOfDeath), new Date()) <= 0
        ) {
          return false // dateOfBirth is valid
        } else {
          return true //year or month or day or all together are invalid
        }
      } catch {
        return true // error by parsing date
      }
    }
  }

  let classNameYesButton = ''
  let classNameNoButton = ''
  if (dateOfBirthIsExact === 'Yes') {
    classNameNoButton = ''
    classNameYesButton = 'active'
  } else if (dateOfBirthIsExact === 'No') {
    classNameNoButton = 'active'
    classNameYesButton = ''
  }

  if (isSuccessAnimalType) {
    const animaltypes = dataAnimalType
    // show is always true, visibility is changed from the parent component
    return (
      <Modal show={true} onHide={hideDialogNewAnimal} className="animal-dialog">
        <Modal.Header closeButton>
          {animalEdit === undefined && (
            <Modal.Title>Neues Tier anlegen</Modal.Title>
          )}
          {animalEdit !== undefined && (
            <Modal.Title>Tier bearbeiten</Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body>
          {
            // TODO: ALIGN IMAGE CENTER HORIZONTAL
          }
          <Container>
            <Image
              src={animalPictureURL}
              width={200}
              height={200}
              roundedCircle
            />
            <Form>
              <Form.Group>
                <Form.Label>Bild auswählen</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Form.Group>
              <Button onClick={onSubmitPicture}>Upload</Button>
            </Form>
          </Container>
          <Form className="animal-form">
            <Form.Group className="mb-3">
              {animalEdit !== undefined && (
                <Form.Label>Tierart: {animalTypeAnimal?.name}</Form.Label>
              )}
              {animalEdit === undefined && (
                <>
                  <Form.Label>Tierart*:</Form.Label>
                  <Form.Control
                    as="select"
                    name="animalType"
                    value={animalTypeAnimal?.id || ''}
                    onChange={handleChange}
                    isInvalid={validationErrors.animalType !== undefined}
                  >
                    <option value="">Bitte auswählen</option>
                    {animaltypes.map((animaltype) => (
                      <option key={animaltype.id} value={animaltype.id}>
                        {animaltype.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.animalType}
                  </Form.Control.Feedback>
                </>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tiername*:</Form.Label>
              <Form.Control
                id="AnimalName"
                type="text"
                placeholder="z.B. Nala"
                name="name"
                onChange={handleChange}
                value={name}
                isInvalid={validationErrors.name !== undefined}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Geburtsdatum*:</Form.Label>
              <div className="flex-row">
                <div className="mb-2">Ich kenne das genaue Geburtsdatum:</div>
                <ToggleButtonGroup
                  type="radio"
                  value={dateOfBirthIsExact}
                  name="dateOfBirthIsExact"
                  onChange={handleDateOfBirthIsExactChange}
                >
                  <ToggleButton
                    id="dateOfBirthIsExactNo"
                    value="No"
                    variant="outline-primary"
                    className={classNameNoButton}
                  >
                    Nein
                  </ToggleButton>
                  <ToggleButton
                    id="dateOfBirthIsExactYes"
                    value="Yes"
                    variant="outline-primary"
                    className={classNameYesButton}
                  >
                    Ja
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Form.Group>
            {dateOfBirthIsExact === 'Yes' && (
              <Form.Group className="mb-3">
                <Form.Control
                  id="AnimalDateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={dateOfBirth}
                  isInvalid={validationErrors.dateOfBirth !== undefined}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.dateOfBirth}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {dateOfBirthIsExact === 'No' && (
              <Form.Group className="mb-3">
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
                <Form.Control.Feedback type="invalid">
                  {validationErrors.dateOfBirthIsExact}
                </Form.Control.Feedback>
              </Form.Group>
            )}
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
                <option value={'male'}>männlich</option>
                <option value={'female'}>weiblich</option>
                <option value={'not_known'}>unbekannt</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.sex}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {validationErrors.castrated}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lifestyle*:</Form.Label>
              <Form.Control
                as="select"
                name="lifestyle"
                value={lifestyle}
                onChange={handleChange}
                isInvalid={validationErrors.lifestyle !== undefined}
              >
                <option value="">Bitte auswählen</option>
                <option value="lifestyleIsIndoor">in der Wohnung</option>
                <option value="lifestyleIsNotIndoor">im Freien</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.lifestyle}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Größe in m: (optional)</Form.Label>
              <Form.Control
                id="AnimalHeight"
                type="text"
                placeholder="z.B. 0,89"
                name="height"
                onChange={handleChange}
                value={height}
                isInvalid={validationErrors.height !== undefined}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.height}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gewicht in kg: (optional)</Form.Label>
              <Form.Control
                id="AnimalWeight"
                type="text"
                placeholder="z.B. 1,5"
                name="weight"
                onChange={handleChange}
                value={weight}
                isInvalid={validationErrors.weight !== undefined}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.weight}
              </Form.Control.Feedback>
            </Form.Group>
            {(raceOptions.length > 0 || selectedRaces.length > 0) && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Rasse auswählen: (optional, mehrere möglich)
                </Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  isMulti={true}
                  placeholder="Bitte Rassen auswählen"
                  options={raceOptions}
                  value={selectedRaces}
                  onChange={handleSelectRaces}
                />
              </Form.Group>
            )}
            {animalEdit !== undefined && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Todesdatum: (optional)</Form.Label>
                  <Form.Control
                    id="TimeOfDeath"
                    type="date"
                    name="dateOfDeath"
                    onChange={handleChange}
                    value={dateOfDeath}
                    isInvalid={validationErrors.dateOfDeath !== undefined}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.dateOfDeath}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <div>* = Pflichtfeld</div>
            {errorText !== '' && <div>{errorText}</div>}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={hideDialogNewAnimal}>
            Abbrechen
          </Button>
          {animalEdit === undefined && (
            <Button variant="primary" onClick={handleSubmitAnimalDialog}>
              Tier anlegen
            </Button>
          )}
          {animalEdit !== undefined && (
            <Button variant="primary" onClick={handleSubmitAnimalDialog}>
              Speichern
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}
