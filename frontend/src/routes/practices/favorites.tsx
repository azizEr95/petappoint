import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoritesVeterinaryPracticesDetails } from "../../api/VeterinaryPracticeAPI";
import { FavoritePractice } from "../../components/practice/FavoritePractice";
import { useLoginContext } from "../../LoginContext";
import type { VeterinaryPracticesType } from "../../../../shared/schemas/ZodSchemas";
import type { MouseEvent } from "react";

export const Route = createFileRoute('/practices/favorites')({
  component: FavoritePracticesPage,
})

function FavoritePracticesPage() {
  const { login } = useLoginContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = login ? login.id : -1; 

  const { 
    data: favorites = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery<Array<VeterinaryPracticesType>>({
    queryKey: ['favoritesDetails', userId],
    queryFn: () => getFavoritesVeterinaryPracticesDetails(userId.toString()),
    enabled: userId !== -1,
  });

  const openPraxisPage = (practiceId: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ['AnimaltypesPractice'] });
    queryClient.invalidateQueries({ queryKey: ['allAvailableServiceTypes'] });
    navigate({
      to: '/practices/$practiceId',
      params: {
        practiceId: practiceId.toString(),
      },
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Laden...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <p>Favoriten konnten nicht geladen werden.</p>
        <button 
          onClick={() => refetch()}
          style={{
            padding: '0.5rem 1rem',
            background: '#2d6a4f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#2d6a4f', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <i className="bi bi-heart-fill" style={{ color: '#dc3545' }}></i>
          Meine Favoriten
        </h1>
        <p style={{ color: '#666', marginTop: '2rem' }}>Noch keine Praxen favorisiert.</p>
        <Link 
          to="/search" 
          search={{ name: '', address: '', animalType: '', serviceType: '' }}
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#2d6a4f',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          <i className="bi bi-search"></i> Praxen suchen
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2d6a4f', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="bi bi-heart-fill" style={{ color: '#dc3545' }}></i>
          Meine Favoriten
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>{favorites.length} Praxis</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {favorites.map((practice) => (
          <div key={practice.id} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#2d6a4f' }}>
                {practice.name}
              </h3>
              <FavoritePractice practice={practice} />
            </div>
            
            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <i className="bi bi-geo-alt" style={{ color: '#2d6a4f', fontSize: '1.2rem', marginTop: '0.1rem' }}></i>
                <span style={{ fontSize: '0.95rem', color: '#666' }}>
                  {practice.address.street}, {practice.address.cityCode} {practice.address.city}
                </span>
              </div>
              
              {practice.phone && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <i className="bi bi-telephone" style={{ color: '#2d6a4f', fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '0.95rem', color: '#666' }}>{practice.phone}</span>
                </div>
              )}
              
              {practice.email && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <i className="bi bi-envelope" style={{ color: '#2d6a4f', fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '0.95rem', color: '#666' }}>{practice.email}</span>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              background: '#f8f9fa',
              borderTop: '1px solid #eee'
            }}>
              <button 
                onClick={openPraxisPage(practice.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: '#2d6a4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                <i className="bi bi-calendar-plus"></i> Termin buchen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}