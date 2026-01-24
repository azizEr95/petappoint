import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap'
import Select from 'react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllAnimalTypes } from '../../api/AnimalTypeAPI'
import {
  createAnimal,
  deletePictureForAnimalId,
  editAnimal,
  getPictureFromAnimal,
  getPicturePlaceholderAnimal,
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
import type { MultiValue } from 'react-select';
import type { ChangeEvent } from 'react';
import type { AddRacesToAnimalType, AnimalTypeType, AnimalUpdateType, AnimalracesType, AnimalsCreateType, AnimalsType, sexesType } from 'vetilib-shared/schemas/ZodSchemas';
import '../../styles/components/animal/AnimalDialog.scss'

type AnimalEditNewDialogProps = {
  hideDialogNewAnimal: () => void
  animalEdit: AnimalsType | undefined
  preselectedAnimalTypeId?: number
  onAnimalCreated?: () => void
  showSuccessNotification: () => void
}

// visibility from this component has to be handled from the parent component
export function AnimalEditNewDialog({
  hideDialogNewAnimal,
  animalEdit,
  preselectedAnimalTypeId,
  onAnimalCreated,
  showSuccessNotification
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
  const [ageInMonth, setAgeInMonth] = useState(0) // is only used if dateOfBirthIsExact is No/false
  const [dateOfBirthFromAgeInMonth, setDateOfBirthFromAgeInMonth] = useState('')
  const [sex, setSexes] = useState<sexesType | undefined>(undefined)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [castrated, setCastrated] = useState<'' | 'castrated' | 'notCastrated'>(
    '',
  )
  const [lifestyle, setLifestyle] = useState<
    '' | 'indoor' | 'outdoor' | 'mixed'
  >('')
  const [selectedRaces, setSelectedRaces] = useState<
    MultiValue<{ value: AnimalracesType; label: string }>
  >([])
  const [racesIdNumbers] = useState<Array<number>>([])
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

  // fetch animal picture
  const { data: animalPictureData, isSuccess: isSuccessPictureData } = useQuery({
    queryKey: ['animalPicture', animalEdit?.id],
    queryFn: () => getPictureFromAnimal(animalEdit!.id),
    enabled: animalEdit !== undefined,
    staleTime: 0,
  })
  const { data: animalUnknownPictureData, isSuccess: isSuccessUnknownPictureData } = useQuery({
    queryKey: ['animalUnknownPicture'],
    queryFn: () => getPicturePlaceholderAnimal(),
    staleTime: 0,
  })

  // BEGIN IMAGE FORM
  const [animalPictureURL, setAnimalPictureURL] = useState<string | undefined>(undefined)
  const [selectedPictureFile, setSelectedPictureFile] = useState<File>()
  const [pictureIsPlaceholder, setPictureIsPlaceholder] = useState<boolean>(false)
  const [shouldDeletePicture, setShouldDeletePicture] = useState<boolean>(false)

  useEffect(() => {
    if (isSuccessPictureData) {
      setAnimalPictureURL(animalPictureData)
      setPictureIsPlaceholder(false)
    } else if (isSuccessUnknownPictureData) {
      setAnimalPictureURL(animalUnknownPictureData)
      setPictureIsPlaceholder(true)
    }
  }, [animalPictureData, animalUnknownPictureData, isSuccessPictureData, isSuccessUnknownPictureData])

  useEffect(() => {
    if (selectedPictureFile) {
      const url = URL.createObjectURL(selectedPictureFile)
      setAnimalPictureURL(url)
      setPictureIsPlaceholder(false);
      return () => URL.revokeObjectURL(url)
    } else {
      setAnimalPictureURL(animalUnknownPictureData ?? undefined);
      setPictureIsPlaceholder(true);
    }
  }, [selectedPictureFile, animalUnknownPictureData])

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file: File | undefined = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setErrorText('Nur Bilder erlaubt.')
        return
      }

      // 2MB max
      if (file.size > 2 * 1024 * 1024) {
        setErrorText('Datei darf maximal 2MB groß sein.')
        return
      }

      setSelectedPictureFile(file)
      setShouldDeletePicture(false)
      setErrorText('')
    }
  }

  const handleDeletePicture = () => {
    setAnimalPictureURL(animalUnknownPictureData ?? undefined);
    setPictureIsPlaceholder(true);
    setSelectedPictureFile(undefined);
    setShouldDeletePicture(true);
  }

  // END IMAGE FORM

  // Pre-select animal type if provided
  useEffect(() => {
    if (preselectedAnimalTypeId !== undefined && isSuccessAnimalType) {
      const preselectedType = dataAnimalType.find((type) => {
        return type.id === preselectedAnimalTypeId
      })
      setAnimalTypeAnimal(preselectedType)
    }
  }, [preselectedAnimalTypeId, isSuccessAnimalType, dataAnimalType])

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
          ; (setDateOfBirthIsExact('Yes'),
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
      } else {
        setDateOfBirthIsExact('No');
        setAgeInMonth(-1);
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
      setLifestyle(animalEdit.lifestyle)
      if (animalEdit.timeOfDeath !== null) {
        setDateOfDeath(getDateStringFromDate(animalEdit.timeOfDeath))
      }
      if (isSuccessPictureData && isSuccessUnknownPictureData) {
        setAnimalPictureURL(animalPictureData)
        setPictureIsPlaceholder(false)
      }
    }
  }, [isSuccessAnimalType, isSuccessPictureData, animalPictureData, isSuccessUnknownPictureData, animalUnknownPictureData])

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
      const sameRace = selectedRaces.find((selRace) => {
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
        const findSelect = selectedRaces.find((selRace) => {
          if (selRace.value.id === race.id) {
            return true
          }
        })
        const findOptions = selectedRaces.find((opRace) => {
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

  const { mutate: mutateAddPictureAnimal } = useMutation({
    mutationFn: (animalId: number) => uploadPictureForAnimalId(animalId, selectedPictureFile ?? new File([], '')), // selectedPictureFile is always defined here (if condition before call mutation)
    onError: () => {
      setErrorText('Fehler beim Erstellen des Tieres')
    },
    onSuccess: () => {
      setErrorText('')
      setShouldDeletePicture(false)
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      queryClient.invalidateQueries({ queryKey: ['animalPicture'] })
      queryClient.invalidateQueries({ queryKey: ['animalUnknownPicture'] })
      // Call onAnimalCreated callback if this was a new animal creation
      if (animalEdit === undefined && onAnimalCreated) {
        onAnimalCreated()
      }
      hideDialogNewAnimal()
    }
  })

  const { mutate: mutateDeletePicture } = useMutation({
    mutationFn: (animalId: number) => deletePictureForAnimalId(animalId),
    onSuccess: () => {
      setErrorText('')
      setShouldDeletePicture(false)
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      queryClient.invalidateQueries({ queryKey: ['animalPicture'] })
      queryClient.invalidateQueries({ queryKey: ['animalUnknownPicture'] })
      // Call onAnimalCreated callback if this was a new animal creation
      if (animalEdit === undefined && onAnimalCreated) {
        onAnimalCreated()
      }
      hideDialogNewAnimal()
    }
  })

  type AnimalEditPayload = {
    animalID: number
    animal: AnimalsCreateType
  }

  const { mutate: mutateEditAnimal } = useMutation({
    mutationFn: ({ animalID, animal }: AnimalEditPayload) =>
      editAnimal(animalID, animal),
    onError: () => {
      setErrorText('Fehler beim Bearbeiten des Tieres');
    },
    onSuccess: (data) => {
      // animal was successful edited
      // edit animalraces, delete all first, then add selected ones
      setErrorText('');
      mutateDeleteAllRaces(data.id);
    },
  })

  const { mutate: mutateAddRacesToAnimal } = useMutation({
    mutationFn: (animalID: AddRacesToAnimalType) => addRacesToAnimal(animalID),
    onError: () => {
      if (animalEdit === undefined) {
        setErrorText('Fehler beim Erstellen des Tieres');
      } else {
        setErrorText('Fehler beim Bearbeiten des Tieres');
      }
    },
    onSuccess: (data) => {
      // animalraces was successful edited
      // now handle picture upload/deletion
      if (selectedPictureFile) {
        mutateAddPictureAnimal(data.animalId);
      } else if (shouldDeletePicture) {
        mutateDeletePicture(data.animalId);
      } else { // if neither: user didn't change picture, do nothing (keep existing)
        setErrorText('');
        setShouldDeletePicture(false);
        queryClient.invalidateQueries({ queryKey: ['animals'] });
        queryClient.invalidateQueries({ queryKey: ['animalPicture'] });
        queryClient.invalidateQueries({ queryKey: ['animalUnknownPicture'] });
        // Call onAnimalCreated callback if this was a new animal creation
        if (animalEdit === undefined && onAnimalCreated) {
          onAnimalCreated();
        }
        console.log('hide dialog');
        showSuccessNotification();
        hideDialogNewAnimal();
      }
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
    const nameTarget = t.name
    const value = t.value
    switch (nameTarget) {
      case 'name':
        setName(value)
        break
      case 'animalType':
        {
          const selectedType = dataAnimalType?.find(
            (type) => type.id === parseInt(value),
          )
          setAnimalTypeAnimal(selectedType);
          setSelectedRaces([]); // clear all selected races
          break
        }
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
        if (value === 'indoor' || value === 'outdoor' || value === 'mixed') {
          setLifestyle(value)
        } else if (value === '') {
          setLifestyle('')
        } else {
          throw Error('options in CreateNewAnimal by lifestyle are incorrect')
        }
        break
      case 'height':
        {
          const valueHeight = value.replace(/[^0-9,]/g, '') // an input from letters is not allowed, only float numbers
          const valueCompleteHeight = valueHeight.split(',') // check if there is only one ,

          if (valueCompleteHeight.length <= 1) {
            setHeight(valueHeight)
          } else if (
            valueCompleteHeight.length <= 2 &&
            valueCompleteHeight[1].length <= 2
          ) {
            setHeight(valueHeight)
          }
          break
        }
      case 'weight':
        {
          const valueWeight = value.replace(/[^0-9,]/g, '') // an input from letters is not allowed, only numbers
          const valueCompleteWeight = valueWeight.split(',') // check if there is only one ,

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
    let allUndefined = true
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
      if (weightNumber > 1000) {
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
      if (heightNumber > 12) {
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
    queryClient.invalidateQueries({ queryKey: ['animalPicture'] })

    const allUndefined = validate(true)
    if (allUndefined) {
      // all Inputs are valid and correct
      const weightInGram = Math.floor(
        parseFloat(weight.replace(',', '.')) * 1000,
      )
      const heightInCm = Math.floor(parseFloat(height.replace(',', '.')) * 100)

      let dateOfBirthCreate: Date | null = null;
      if (dateOfBirthIsExact === "Yes") {
        dateOfBirthCreate = new Date(dateOfBirth);
      } else if (dateOfBirthIsExact === "No" && ageInMonth !== -1) {
        new Date(dateOfBirthFromAgeInMonth)
      }

      const animal: AnimalsCreateType = {
        name: name,
        sex: sex !== undefined ? sex : 'not_known',
        dateOfBirth: dateOfBirthCreate,
        dateOfBirthIsExact: dateOfBirthIsExact === 'Yes' ? true : false,
        weightInGram: weightInGram,
        heightInCm: heightInCm,
        timeOfDeath: dateOfDeath !== '' ? new Date(dateOfDeath) : null,
        isCastrated: castrated === 'castrated' ? true : false,
        lifestyle: lifestyle as 'indoor' | 'outdoor' | 'mixed',
        animalTypeId: animalTypeAnimal !== undefined ? animalTypeAnimal.id : 1,
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
        const animalUpdate: AnimalUpdateType = {
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
          return true // year or month or day or all together are invalid
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
      <Modal
        show={true}
        onHide={hideDialogNewAnimal}
        size="lg"
        centered
        className="animal-dialog"
      >
        <Modal.Header closeButton>
          {animalEdit === undefined && (
            <Modal.Title>Neues Tier anlegen</Modal.Title>
          )}
          {animalEdit !== undefined && (
            <Modal.Title>Tier bearbeiten</Modal.Title>
          )}
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row className="justify-content-center mb-4">
              <Col xs="auto" sm="auto" lg={9} className="text-center">
                <Image
                  src={animalPictureURL}
                  roundedCircle
                  width={200}
                  height={200}
                  alt="Tierbild"
                  className="mb-3"
                />
                <Form.Group>
                  <Form.Label>Tierbild ändern</Form.Label>
                  <div className='flex-row'>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <Button variant="danger" onClick={handleDeletePicture} disabled={pictureIsPlaceholder} className='button'><i className="bi bi-trash"></i></Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {errorText && (
              <Row>
                <Col>
                  <div className="alert alert-danger">{errorText}</div>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <h5 className="mt-3 mb-3">Tierdaten</h5>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  {animalEdit !== undefined && (
                    <Form.Label>Tierart: {animalTypeAnimal?.name}</Form.Label>
                  )}
                  {animalEdit === undefined && (
                    <>
                      <Form.Label>Tierart*</Form.Label>
                      <Form.Control
                        as="select"
                        name="animalType"
                        value={animalTypeAnimal?.id || ''}
                        onChange={handleChange}
                        isInvalid={validationErrors.animalType !== undefined}
                        data-testid="animal-type-select"
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
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiername*</Form.Label>
                  <Form.Control
                    id="AnimalName"
                    type="text"
                    placeholder="z.B. Nala"
                    name="name"
                    onChange={handleChange}
                    value={name}
                    isInvalid={validationErrors.name !== undefined}
                    data-testid="animal-name-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Geburtsdatum*</Form.Label>
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
                </Form.Group>
              </Col>
            </Row>
            {dateOfBirthIsExact === 'Yes' && (
              <Form.Group className="mb-3">
                <Form.Control
                  id="AnimalDateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={dateOfBirth}
                  isInvalid={validationErrors.dateOfBirth !== undefined}
                  data-testid="animal-dateOfBirth-input"
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
                  <option value={-1}>weiß ich nicht</option>
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
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Geschlecht*</Form.Label>
                  <Form.Control
                    as="select"
                    name="sex"
                    value={sex}
                    onChange={handleChange}
                    isInvalid={validationErrors.sex !== undefined}
                    data-testid="animal-sex-select"
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
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kastriert*</Form.Label>
                  <Form.Control
                    as="select"
                    name="castrated"
                    value={castrated}
                    onChange={handleChange}
                    isInvalid={validationErrors.castrated !== undefined}
                    data-testid="animal-castrated-select"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="castrated">kastriert</option>
                    <option value="notCastrated">nicht kastriert</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.castrated}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lifestyle*</Form.Label>
                  <Form.Control
                    as="select"
                    name="lifestyle"
                    value={lifestyle}
                    onChange={handleChange}
                    isInvalid={validationErrors.lifestyle !== undefined}
                    data-testid="animal-lifestyle-select"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="mixed">Mixed</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.lifestyle}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Größe in m (optional)</Form.Label>
                  <Form.Control
                    id="AnimalHeight"
                    type="text"
                    placeholder="z.B. 0,89"
                    name="height"
                    onChange={handleChange}
                    value={height}
                    isInvalid={validationErrors.height !== undefined}
                    data-testid="animal-height-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.height}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gewicht in kg (optional)</Form.Label>
                  <Form.Control
                    id="AnimalWeight"
                    type="text"
                    placeholder="z.B. 1,5"
                    name="weight"
                    onChange={handleChange}
                    value={weight}
                    isInvalid={validationErrors.weight !== undefined}
                    data-testid="animal-weight-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {animalEdit !== undefined && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Todesdatum (optional)</Form.Label>
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
                </Col>
              )}
            </Row>

            {(raceOptions.length > 0 || selectedRaces.length > 0) && (
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Rasse auswählen (optional, mehrere möglich)
                    </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti={true}
                      placeholder="Bitte Rassen auswählen"
                      options={raceOptions}
                      value={selectedRaces}
                      onChange={handleSelectRaces}
                      data-testid="animal-races-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <div className="mt-3">* = Pflichtfeld</div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={hideDialogNewAnimal} data-testid="animal-cancel-button">
            Abbrechen
          </Button>
          {animalEdit === undefined && (
            <Button variant="primary" onClick={handleSubmitAnimalDialog} data-testid="animal-create-button">
              Tier anlegen
            </Button>
          )}
          {animalEdit !== undefined && (
            <Button variant="primary" onClick={handleSubmitAnimalDialog} data-testid="animal-save-button">
              Speichern
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}
