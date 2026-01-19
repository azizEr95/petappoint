import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import { useTitle } from '@/utils/useTitle';
import { CustomerDetails } from '@/components/customer/CustomerDetails';
import { isLoggedInAndVerified } from '@/utils/Authentication';
import { useLoginContext } from '@/LoginContext';

export const Route = createFileRoute('/customers/$animalId')({
  component: AnimalComponent,
})

function AnimalComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useLoginContext();
  const customer = location.state.customer;
  useTitle(customer?.animal.name || 'Tierdetails');

  useEffect(() => {
    if (!isLoggedInAndVerified(login) || customer === undefined) {
      navigate({ to: '/customers', search: { name: '' } })
    }
  }, [login]);

  return (
    <div className="container py-4">
      {customer && <CustomerDetails customer={customer} />}
    </div>
  );
}
