import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from 'react-bootstrap';
import { SuccessNotificationToast } from '../SuccessNotificationToast';
import { PersonEditNewDialog } from '../person/PersonEditNewDialog';
import { CustomerCard } from "./CustomerCard";
import type { CustomerType } from "@/api/CustomerAPI";
import "@/styles/components/customer/Customer.scss";
import type { ChangeEvent } from "react";

type CustomerListProps = {
    customers: Array<CustomerType> | undefined
    searchName: string
    sortBy: string
}

export function CustomerList({ customers, searchName, sortBy }: CustomerListProps) {
    const navigate = useNavigate();
    const searchNameURL = searchName || ''; // this empty strigs are important, otherwise it becomes 'undefined'
    const [searchString, setSearchString] = useState<string>(searchNameURL);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<CustomerType> | undefined>(customers);
    const [sortByState, setSortByState] = useState<string>(sortBy || 'name-asc');
    const [showPersonDialog, setShowPersonDialog] = useState<boolean>(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);

    useEffect(() => {
        handleFilter();
    }, []);

    const applySorting = (
        unsortedCustomer: Array<CustomerType>,
        sort: string,
    ): Array<CustomerType> => {
        const copy = [...unsortedCustomer];
        switch (sort) {
            case 'name-asc':
                return copy.sort((a, b) => a.animal.name.localeCompare(b.animal.name));
            case 'name-desc':
                return copy.sort((a, b) => b.animal.name.localeCompare(a.animal.name));
            case 'recent':
                return copy.sort((a, b) => b.animal.id - a.animal.id);
            default:
                return copy;
        }
    }

    const handleFilter = () => {
        if (!customers) {
            return;
        }

        let newfilteredCustomers = customers.filter((customer) => {
            const query = searchString.toLowerCase();
            if (customer.person.firstName.toLowerCase().includes(query) ||
                customer.person.lastName.toLowerCase().includes(query) ||
                customer.person.email.toLowerCase().includes(query) ||
                customer.animal.name.toLowerCase().includes(query)) {
                return true;
            }
        });

        newfilteredCustomers = applySorting(newfilteredCustomers, sortByState);
        setFilteredCustomers(newfilteredCustomers);
    }

    const handleSortChange = (newSort: string) => {
        setSortByState(newSort);
        if (filteredCustomers) {
            const sorted = applySorting(filteredCustomers, newSort);
            setFilteredCustomers(sorted);
        }
        updateUrl(newSort);
    }

    const updateUrl = (newSort?: string) => {
        navigate({
            to: '/customers',
            search: (prev) => ({
                ...prev,
                name: searchString,
                sortBy: newSort || sortByState
            }),
            replace: true,
        })
    }

    const handleSearch = () => {
        handleFilter();
        updateUrl();
    }

    const handleOpenPersonDialog = () => {
        setShowPersonDialog(true);
    }

    const handleClosePersonDialog = () => {
        setShowPersonDialog(false);
    }

    const handleShowSuccessNotification = () => {
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 4000);
    }

    if (!filteredCustomers) {
        return <div>Lade Kunden ...</div>;
    }

    return (
        <div>
            <h2 className="mb-3 customer-heading">Tiere und Kunden</h2>
            <div className="customer-search-container">
                <div className="customer-search-wrapper">
                    <div className="search-bar-clean">
                        <div className="search-icon-container">
                            <i className="bi bi-search"></i>
                        </div>
                        <input
                            type="text"
                            className="search-input-clean"
                            placeholder="Tiername, Name oder Email des Besitzers"
                            name="Name"
                            value={searchString}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-btn-clean" onClick={handleSearch}>
                            Suchen
                        </button>
                    </div>

                </div>
            </div>

            {/* Sort and Action Controls */}
            <div className="customer-controls">
                <div className="sort-dropdown-wrapper">
                    <label htmlFor="sort-select">Sortierung:</label>
                    <select
                        id="sort-select"
                        className="form-select sort-select"
                        value={sortByState}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="recent">Zuletzt hinzugefügt</option>
                    </select>
                </div>

                <div className="customer-create-button">
                    <Button variant="primary" onClick={handleOpenPersonDialog}>
                        Kunde anlegen
                    </Button>
                </div>
            </div>

            <div className="customer-cards-container">
                {filteredCustomers.map((customer) => (
                    <CustomerCard key={`${customer.person.id}-${customer.animal.id}`} customer={customer} />
                ))}
                {filteredCustomers.length === 0 && (
                    <div className="no-customers-message">
                        Keine Tiere gefunden.
                    </div>
                )}
            </div>

            {showPersonDialog && (
                <PersonEditNewDialog
                    hideDialogNewPerson={handleClosePersonDialog}
                    showSuccessNotification={handleShowSuccessNotification}
                />
            )}

            {showSuccessNotification && (
                <SuccessNotificationToast
                    message="Kunde erfolgreich angelegt"
                    onClose={() => setShowSuccessNotification(false)}
                />
            )}
        </div>
    );
}