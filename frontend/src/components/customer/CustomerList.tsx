import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CustomerCard } from "./CustomerCard";
import type { CustomerType } from "@/api/CustomerAPI";
import "@/styles/components/customer/Customer.scss";
import type { ChangeEvent } from "react";

type CustomerListProps = {
    customers: Array<CustomerType> | undefined
    searchName: string
}

export function CustomerList({ customers, searchName }: CustomerListProps) {
    const navigate = useNavigate();
    const searchNameURL = searchName || ''; // this empty strigs are important, otherwise it becomes 'undefined'
    const [searchString, setSearchString] = useState<string>(searchNameURL);
    const [filteredCustomers, setFilteredCustomers] = useState<Array<CustomerType> | undefined>(customers);

    useEffect(() => {
        handleFilter();
    }, [customers, searchString]);

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

        newfilteredCustomers = newfilteredCustomers.sort((a, b) => a.animal.name.localeCompare(b.animal.name));
        setFilteredCustomers(newfilteredCustomers);
    }

    const handleSearch = () => {
        handleFilter();
        navigate({
            to: '/customers',
            search: (prev) => ({ ...prev, name: searchString }),
            replace: true,
        })
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
        </div>
    );
}