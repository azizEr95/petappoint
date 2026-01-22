import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { CustomerType } from '@/api/CustomerAPI';
import { useLoginContext } from '@/LoginContext';
import { getCustomersFromPractice } from '@/api/CustomerAPI';
import { isLoggedInAndVerified } from '@/utils/Authentication';
import { CustomerList } from '@/components/customer/CustomerList';
import { useTitle } from '@/utils/useTitle';

export type CustomerSearch = {
    name: string
    sortBy: string
}

export const Route = createFileRoute('/customers/')({
    validateSearch: (search: CustomerSearch): CustomerSearch => {
        return search;
    },
    component: CustomerComponent,
})

function CustomerComponent() {
    useTitle('Kunden und Tiere');
    const { login } = useLoginContext();
    const navigate = useNavigate();
    const { name, sortBy } = Route.useSearch();

    const practiceID = login ? login.id : -1;

    const { isSuccess: isSuccessCustomers, data: dataCustomers } = useQuery<Array<CustomerType>>({
        queryKey: ['customers', practiceID],
        queryFn: () => getCustomersFromPractice(practiceID.toString()),
        retry: false,
    })

    useEffect(() => {
        if (!isLoggedInAndVerified(login)) {
            navigate({
                to: '/login',
                search: {
                    redirect: '/customers',
                },
            })
        } else if (isLoggedInAndVerified(login) && login && login.role === "person") {
            navigate({ to: '/' })
        }
    }, [login]);

    if (!isSuccessCustomers) {
        return;
    }

    return <CustomerList customers={dataCustomers} searchName={name} sortBy={sortBy || 'name-asc'} />
}
