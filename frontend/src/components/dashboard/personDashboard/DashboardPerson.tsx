import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardAppointmentsSection } from "./DashboardAppointmentsSection";
import { DashboardFavoritesSection } from "./DashboardFavoritesSection";
import { DashboardPetsSection } from "./DashboardPetsSection";
import type { PersonsType } from "vetilib-shared/schemas/ZodSchemas";
import { AnimalEditNewDialog } from "@/components/animal/AnimalEditNewDialog";
import { ProfileEditDialog } from "@/components/profile/ProfileEditDialog";
import { useLoginContext } from "@/LoginContext";
import { isLoggedInAndVerified } from "@/utils/Authentication";
import { getPersonById, getPictureURLForPersonId } from "@/api/PersonsAPI";
import '../../../styles/components/dashboard/DashboardPerson.scss';
import { SuccessNotificationToast } from "@/components/SuccessNotificationToast";

export function DashboardPerson() {
    const navigate = useNavigate();
    const { login } = useLoginContext();
    const [showAddPetDialog, setShowAddPetDialog] = useState(false);
    const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
    const [hasAnimals, setHasAnimals] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'appointments' | 'pets' | 'favorites'
    >('appointments');
     const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false);

    const userId = login ? login.id : -1; // userId is always !== -1

    const { data: user, isLoading: isLoadingUser } = useQuery<PersonsType>({
        queryKey: ['person', userId],
        queryFn: () => getPersonById(userId),
        retry: false,
        enabled: userId !== -1,
    })

    useEffect(() => {
        if (!isLoggedInAndVerified(login)) {
            navigate({
                to: '/login',
                search: {
                    redirect: '/dashboard',
                },
            });
        }
    }, [login])

    const handleEditProfile = () => {
        setShowEditProfileDialog(true);
    }

    const handleAddPet = () => {
        setShowAddPetDialog(true);
    }

    const handleBookAppointment = () => {
        navigate({
            to: '/search',
            search: {
                address: '',
                animalType: '',
                serviceType: '',
            },
        });
    }

    if (isLoadingUser || !user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="dashboard-page">
                {/* Header with greeting + profile */}
                <div className="dashboard-header-section">
                    <div className="dashboard-header-text">
                        <h1 className="greeting-title">Hallo {user.firstName}!</h1>
                    </div>
                    <div className="dashboard-header-actions">
                        <button
                            className="dashboard-header-cta"
                            onClick={handleBookAppointment}
                        >
                            <i className="bi bi-calendar-plus"></i> Termin buchen
                        </button>
                        <div className="dashboard-header-profile">
                            <div className="profile-image-wrapper">
                                <img
                                    src={getPictureURLForPersonId(userId, Date.now())}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="profile-image"
                                />
                                <button
                                    className="profile-edit-btn"
                                    onClick={handleEditProfile}
                                    title="Profil bearbeiten"
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation Header */}
                <div className="dashboard-tabs-header">
                    <div className="dashboard-tabs">
                        <button
                            className={`dashboard-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            <i className="bi bi-calendar-check"></i> Termine
                        </button>
                        <button
                            className={`dashboard-tab ${activeTab === 'pets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pets')}
                        >
                            <i className="bi bi-paw"></i> Meine Tiere
                        </button>
                        <button
                            className={`dashboard-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <i className="bi bi-star"></i> Favoriten
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="dashboard-content">
                    {activeTab === 'appointments' && (
                        <DashboardAppointmentsSection userId={userId} />
                    )}

                    {activeTab === 'pets' && (
                        <>
                            <div className="section-actions">
                                {!hasAnimals ? (
                                    <></>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-add-pet"
                                        onClick={handleAddPet}
                                        data-testid="add-animal"
                                    >
                                        <i className="bi bi-plus-circle"></i> Tier hinzufügen
                                    </button>
                                )}
                            </div>
                            <DashboardPetsSection userId={userId}
                                onAnimalsLoaded={setHasAnimals} />
                        </>
                    )}

                    {activeTab === 'favorites' && (
                        <DashboardFavoritesSection userId={userId} />
                    )}
                </div>
            </div>

            {/* Animal Dialog */}
            {showAddPetDialog && (
                <AnimalEditNewDialog
                    hideDialogNewAnimal={() => setShowAddPetDialog(false)}
                    animalEdit={undefined}
                    showSuccessNotification={() => {setShowSuccessNotification(true)}}
                />
            )}

            {/* Profile Edit Dialog */}
            {showEditProfileDialog && (
                <ProfileEditDialog
                    hideDialog={() => setShowEditProfileDialog(false)}
                    person={user}
                />
            )}

            {showSuccessNotification &&
                <SuccessNotificationToast
                    message={"Das Tier wurde erfolgreich angelegt."}
                    onClose={() => setShowSuccessNotification(false)} />
            }
        </>
    )


}