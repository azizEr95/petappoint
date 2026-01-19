import type { CountryType, PersonsCreateType, VeterinaryPracticesCreateType, sexesType } from "vetilib-shared/schemas/ZodSchemas";

export type PersonsValidateType = {
    sex: sexesType | undefined;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: {
        country: CountryType | undefined;
        street: string;
        streetNumber: string;
        cityCode: string;
        city: string;
    };
    password?: string;
    confirmPassword?: string;
}

export type PracticeValidateType = {
    name: string;
    phone: string;
    email: string;
    address: {
        country: CountryType | undefined;
        street: string;
        streetNumber: string;
        cityCode: string;
        city: string;
    };
    password: string;
    confirmPassword: string;
    infoEmail: string;
    website: string;
    info: string;
}

// if verifyField is undefined, validate all fields
export function validatePersonFormular(personData: PersonsValidateType, oldErrors: { [key: string]: string }, verifyField?: string): { [key: string]: string } {
    const newPersonErrors: { [key: string]: string } = { ...oldErrors };

    if (verifyField === "firstName" || verifyField === undefined) {
        if (!personData.firstName.trim()) {
            newPersonErrors.firstName = 'Vorname ist erforderlich';
        } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(personData.firstName)) {
            newPersonErrors.firstName =
                'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
        } else if (personData.firstName.length < 2) {
            newPersonErrors.firstName = 'Vorname muss mindestens aus 2 Zeichen bestehen';
        } else if (personData.firstName.length > 60) {
            newPersonErrors.firstName = 'Vorname darf maximal 60 Zeichen lang sein';
        } else {
            delete newPersonErrors.firstName;
        }
    }

    if (verifyField === "lastName" || verifyField === undefined) {
        if (!personData.lastName.trim()) {
            newPersonErrors.lastName = 'Nachname ist erforderlich';
        } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(personData.lastName)) {
            newPersonErrors.lastName =
                'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
        } else if (personData.lastName.length < 2) {
            newPersonErrors.lastName = 'Nachname muss mindestens aus 2 Zeichen bestehen';
        } else if (personData.lastName.length > 60) {
            newPersonErrors.lastName = 'Nachname darf maximal 60 Zeichen lang sein';
        } else {
            delete newPersonErrors.lastName;
        }
    }

    if (verifyField === "street" || verifyField === undefined) {
        if (!personData.address.street.trim()) {
            newPersonErrors.street = 'Straße ist erforderlich';
        } else if (!/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(personData.address.street)) {
            newPersonErrors.street =
                'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten';
        } else if (personData.address.street.length < 3) {
            newPersonErrors.street = 'Straße muss mindestens aus 3 Zeichen bestehen';
        } else if (personData.address.street.length > 80) {
            newPersonErrors.street = 'Straße darf maximal 80 Zeichen lang sein';
        } else {
            delete newPersonErrors.street;
        }
    }

    if (verifyField === "streetNumber" || verifyField === undefined) {
        if (!personData.address.streetNumber.trim()) {
            newPersonErrors.streetNumber = 'Hausnummer ist erforderlich';
        } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(personData.address.streetNumber)) {
            newPersonErrors.streetNumber = 'Hausnummer muss mindestens eine Zahl enthalten';
        } else if (personData.address.streetNumber.length > 10) {
            newPersonErrors.streetNumber = 'Hausnummer darf maximal 10 Zeichen lang sein';
        } else {
            delete newPersonErrors.streetNumber;
        }
    }

    if (verifyField === "cityCode" || verifyField === undefined) {
        if (!personData.address.cityCode.trim()) {
            newPersonErrors.cityCode = 'Postleitzahl ist erforderlich';
        } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(personData.address.cityCode)) {
            newPersonErrors.cityCode = 'Postleitzahl muss mindestens eine Zahl enthalten';
        } else if (personData.address.cityCode.length < 3) {
            newPersonErrors.cityCode = 'Postleitzahl muss mindestens aus 3 Zeichen bestehen';
        } else if (personData.address.cityCode.length > 12) {
            newPersonErrors.cityCode = 'Postleitzahl darf maximal 12 Zeichen lang sein';
        } else {
            delete newPersonErrors.cityCode;
        }
    }

    if (verifyField === "city" || verifyField === undefined) {
        if (!personData.address.city.trim()) {
            newPersonErrors.city = 'Stadt ist erforderlich';
        } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(personData.address.city)) {
            newPersonErrors.city =
                'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
        } else if (personData.address.city.length < 3) {
            newPersonErrors.city = 'Stadt muss mindestens aus 3 Zeichen bestehen';
        } else if (personData.address.city.length > 60) {
            newPersonErrors.city = 'Stadt darf maximal 60 Zeichen lang sein';
        } else {
            delete newPersonErrors.city;
        }
    }

    if (verifyField === "country" || verifyField === undefined) {
        if (!personData.address.country) {
            newPersonErrors.country = 'Land ist erforderlich';
        } else {
            delete newPersonErrors.country;
        }
    }

    if (verifyField === "email" || verifyField === undefined) {
        if (!personData.email.trim()) {
            newPersonErrors.email = 'E-Mail ist erforderlich';
        } else if (personData.email.length > 100) {
            newPersonErrors.email = 'E-Mail darf maximal 100 Zeichen lang sein';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(personData.email)) {
            newPersonErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        } else if ((personData.email.match(/@/g) || []).length !== 1) {
            newPersonErrors.email = 'E-Mail darf nur ein @ enthalten';
        } else {
            const beforeAt = personData.email.split('@')[0];
            if (!/[a-zA-Z]/.test(beforeAt)) {
                newPersonErrors.email =
                    'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten';
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(personData.email)) {
                newPersonErrors.email = 'E-Mail enthält ungültige Zeichen';
            } else {
                delete newPersonErrors.email;
            }
        }
    }

    if ((verifyField === "password" || verifyField === undefined) && personData.password !== undefined && personData.password !== "") {
        if (!personData.password.trim()) {
            newPersonErrors.password = 'Passwort ist erforderlich';
        } else if (personData.password.length < 8) {
            newPersonErrors.password = 'Passwort muss mindestens aus 8 Zeichen bestehen';
        } else if (!/[A-Z]/.test(personData.password)) {
            newPersonErrors.password =
                'Passwort muss mindestens einen Großbuchstaben enthalten';
        } else if (!/[0-9]/.test(personData.password)) {
            newPersonErrors.password = 'Passwort muss mindestens eine Zahl enthalten';
        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(personData.password)) {
            newPersonErrors.password =
                'Passwort muss mindestens ein Sonderzeichen enthalten';
        } else {
            delete newPersonErrors.password;
        }
    }

    if ((verifyField === "confirmPassword" || verifyField === undefined) && personData.confirmPassword !== undefined) {
        console.log(personData.confirmPassword);
        console.log(personData.password);
        if (!personData.confirmPassword.trim()) {
            newPersonErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich';
        } else if (personData.confirmPassword !== personData.password && personData.password !== undefined) {
            newPersonErrors.confirmPassword = 'Passwörter stimmen nicht überein';
        } else {
            delete newPersonErrors.confirmPassword;
        }
    }

    if (verifyField === "phone" || verifyField === undefined) {
        if (!personData.phone.trim()) {
            newPersonErrors.phone = 'Telefon ist erforderlich';
        } else if (!/^[+]?[0-9]+$/.test(personData.phone)) {
            newPersonErrors.phone =
                'Telefon darf nur Zahlen und optional ein + am Anfang enthalten';
        } else {
            const numbers = personData.phone.replace('+', '')
            if (numbers.length < 5) {
                newPersonErrors.phone = 'Telefon muss mindestens aus 5 Zahlen bestehen';
            } else if (numbers.length > 20) {
                newPersonErrors.phone = 'Telefon darf maximal 20 Zeichen lang sein';
            } else {
                delete newPersonErrors.phone;
            }
        }
    }

    if (verifyField === "dateOfBirth" || verifyField === undefined) {
        if (!personData.dateOfBirth.trim()) {
            newPersonErrors.dateOfBirth = 'Geburtsdatum ist erforderlich';
        } else {
            const birthDate = new Date(personData.dateOfBirth);
            const today = new Date();

            if (birthDate > today) {
                newPersonErrors.dateOfBirth = 'Geburtsdatum darf nicht in der Zukunft liegen';
            } else {
                const age = calculateAge(birthDate);
                if (age < 14) {
                    newPersonErrors.dateOfBirth = 'Sie müssen mindestens 14 Jahre alt sein';
                } else if (age > 120) {
                    newPersonErrors.dateOfBirth = 'Das Alter darf nicht mehr als 120 Jahre betragen';
                } else {
                    delete newPersonErrors.dateOfBirth;
                }
            }
        }
    }

    if (verifyField === "sex" || verifyField === undefined) {
        if (!personData.sex) {
            newPersonErrors.sex = 'Geschlecht ist erforderlich';
        } else {
            delete newPersonErrors.sex;
        }
    }

    return newPersonErrors;
}

export function getPersonCreateType(personData: PersonsValidateType): PersonsCreateType | null {
    if ((personData.sex === "male" || personData.sex === "female" || personData.sex === "not_known" || personData.sex === "not_applicable") && personData.address.country && personData.password) {
        return {
            firstName: personData.firstName,
            lastName: personData.lastName,
            email: personData.email,
            password: personData.password,
            phone: personData.phone,
            dateOfBirth: new Date(personData.dateOfBirth),
            sex: personData.sex,
            address: {
                street: personData.address.street + " " + personData.address.streetNumber,
                cityCode: personData.address.cityCode,
                city: personData.address.city,
                country: personData.address.country.id,
                latitude: 0,
                longitude: 0,
            },
        }
    } else {
        return null;
    }
}

// if verifyField is undefined, validate all fields
export function validatePracticeFormular(practiceData: PracticeValidateType, oldErrors: { [key: string]: string }, verifyField?: string): { [key: string]: string } {
    const newErrors: { [key: string]: string } = { ...oldErrors };

    if (verifyField === "name" || verifyField === undefined) {
        if (!practiceData.name.trim()) {
            newErrors.name = 'Praxisname ist erforderlich';
        } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(practiceData.name)) {
            newErrors.name = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
        } else if (practiceData.name.length < 5) {
            newErrors.name = 'Praxisname muss mindestens aus 5 Zeichen bestehen';
        } else {
            delete newErrors.name;
        }
    }

    if (verifyField === "street" || verifyField === undefined) {
        if (!practiceData.address.street.trim()) {
            newErrors.street = 'Straße ist erforderlich';
        } else if (!/^(?=.*[a-zA-ZäöüÄÖÜß0-9])[a-zA-ZäöüÄÖÜß0-9 '`.-]+$/.test(practiceData.address.street)) {
            newErrors.street = 'Straße muss mindestens einen Buchstaben oder eine Zahl enthalten';
        } else if (practiceData.address.street.length < 3) {
            newErrors.street = 'Straße muss mindestens aus 3 Zeichen bestehen';
        } else {
            delete newErrors.street;
        }
    }

    if (verifyField === "streetNumber" || verifyField === undefined) {
        if (!practiceData.address.streetNumber.trim()) {
            newErrors.streetNumber = 'Hausnummer ist erforderlich';
        } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(practiceData.address.streetNumber)) {
            newErrors.streetNumber = 'Hausnummer muss mindestens eine Zahl enthalten';
        } else {
            delete newErrors.streetNumber;
        }
    }

    if (verifyField === "cityCode" || verifyField === undefined) {
        if (!practiceData.address.cityCode.trim()) {
            newErrors.cityCode = 'Postleitzahl ist erforderlich';
        } else if (!/^(?=.*[0-9])[a-zA-Z0-9]+$/.test(practiceData.address.cityCode)) {
            newErrors.cityCode = 'Postleitzahl muss mindestens eine Zahl enthalten';
        } else {
            delete newErrors.cityCode;
        }
    }

    if (verifyField === "city" || verifyField === undefined) {
        if (!practiceData.address.city.trim()) {
            newErrors.city = 'Stadt ist erforderlich';
        } else if (!/^[a-zA-ZäöüÄÖÜß '`-]+$/.test(practiceData.address.city)) {
            newErrors.city = 'Diese Zeichen sind in diesem Feld nicht erlaubt (Zahlen,/,.)';
        } else if (practiceData.address.city.length < 3) {
            newErrors.city = 'Stadt muss mindestens aus 3 Zeichen bestehen';
        } else {
            delete newErrors.city;
        }
    }

    if (verifyField === "country" || verifyField === undefined) {
        if (!practiceData.address.country) {
            newErrors.country = 'Land ist erforderlich';
        } else {
            delete newErrors.country;
        }
    }

    if (verifyField === "email" || verifyField === undefined) {
        if (!practiceData.email.trim()) {
            newErrors.email = 'E-Mail ist erforderlich';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(practiceData.email)) {
            newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        } else if ((practiceData.email.match(/@/g) || []).length !== 1) {
            newErrors.email = 'E-Mail darf nur ein @ enthalten';
        } else {
            const beforeAt = practiceData.email.split('@')[0];
            if (!/[a-zA-Z]/.test(beforeAt)) {
                newErrors.email = 'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten';
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(practiceData.email)) {
                newErrors.email = 'E-Mail enthält ungültige Zeichen';
            } else {
                delete newErrors.email;
            }
        }
    }

    if (verifyField === "password" || verifyField === undefined) {
        if (!practiceData.password.trim()) {
            newErrors.password = 'Passwort ist erforderlich';
        } else if (practiceData.password.length < 8) {
            newErrors.password = 'Passwort muss mindestens aus 8 Zeichen bestehen';
        } else if (!/[A-Z]/.test(practiceData.password)) {
            newErrors.password = 'Passwort muss mindestens einen Großbuchstaben enthalten';
        } else if (!/[0-9]/.test(practiceData.password)) {
            newErrors.password = 'Passwort muss mindestens eine Zahl enthalten';
        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(practiceData.password)) {
            newErrors.password = 'Passwort muss mindestens ein Sonderzeichen enthalten';
        } else {
            delete newErrors.password;
        }
    }

    if (verifyField === "confirmPassword" || verifyField === undefined) {
        if (!practiceData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Passwort-Wiederholung ist erforderlich';
        } else if (practiceData.confirmPassword !== practiceData.password) {
            newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
        } else {
            delete newErrors.confirmPassword;
        }
    }

    if (verifyField === "phone" || verifyField === undefined) {
        if (!practiceData.phone.trim()) {
            newErrors.phone = 'Telefon ist erforderlich';
        } else if (!/^[+]?[0-9]+$/.test(practiceData.phone)) {
            newErrors.phone = 'Telefon darf nur Zahlen und optional ein + am Anfang enthalten';
        } else {
            const numbers = practiceData.phone.replace('+', '');
            if (numbers.length < 5) {
                newErrors.phone = 'Telefon muss mindestens aus 5 Zahlen bestehen';
            } else if (numbers.length > 20) {
                newErrors.phone = 'Telefon darf maximal 20 Zeichen lang sein';
            } else {
                delete newErrors.phone;
            }
        }
    }

    if (verifyField === "infoEmail" || verifyField === undefined) {
        if (!practiceData.infoEmail.trim()) {
            newErrors.infoEmail = 'E-Mail ist erforderlich';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(practiceData.infoEmail)) {
            newErrors.infoEmail = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        } else if ((practiceData.infoEmail.match(/@/g) || []).length !== 1) {
            newErrors.infoEmail = 'E-Mail darf nur ein @ enthalten';
        } else {
            const beforeAt = practiceData.infoEmail.split('@')[0];
            if (!/[a-zA-Z]/.test(beforeAt)) {
                newErrors.infoEmail = 'E-Mail muss vor dem @ mindestens einen Buchstaben enthalten';
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(practiceData.infoEmail)) {
                newErrors.infoEmail = 'E-Mail enthält ungültige Zeichen';
            } else {
                delete newErrors.infoEmail;
            }
        }
    }

    if (verifyField === "website" || verifyField === undefined) {
        if (practiceData.website.trim()) {
            if (!/^https?:\/\/.+\..+/.test(practiceData.website)) {
                newErrors.website = 'Bitte geben Sie eine gültige URL ein (z.B. https://beispiel.de)';
            } else {
                delete newErrors.website;
            }
        } else {
            delete newErrors.website;
        }
    }

    return newErrors;
}

export function getPracticeCreateType(practiceData: PracticeValidateType): VeterinaryPracticesCreateType | null {
    if (practiceData.address.country) {
        return {
            name: practiceData.name,
            email: practiceData.email,
            password: practiceData.password,
            phone: practiceData.phone,
            infoEmail: practiceData.infoEmail,
            website: practiceData.website || null,
            info: practiceData.info,
            address: {
                street: practiceData.address.street + ' ' + practiceData.address.streetNumber,
                cityCode: practiceData.address.cityCode,
                city: practiceData.address.city,
                country: practiceData.address.country.id,
                latitude: 0,
                longitude: 0,
            },
        };
    } else {
        return null;
    }
}

// Helper function to calculate age
const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export const scrollToFirstError = (errorsScroll: { [key: string]: string }) => {
    const firstErrorKey = Object.keys(errorsScroll)[0];
    if (firstErrorKey) {
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ; (errorElement as HTMLElement).focus();
        }
    }
}