import { getVeterinaryPracticesById } from '@/api/VeterinaryPracticeAPI';
import { useLoginContext } from '@/LoginContext';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { VeterinaryPracticesType } from 'vetilib-shared/schemas/ZodSchemas';
import { PraxisProfileEditDialog } from './PraxisProfileEditDialog';

export function PraxisProfile() {
    const { login } = useLoginContext();
    const [showEditDialog, setShowEditDialog] = useState(false);

    const practiceId = login ? login.id : -1;

    const { isSuccess, data } = useQuery<VeterinaryPracticesType>({
        queryKey: ['veterinaryPractice', practiceId],
        queryFn: () => getVeterinaryPracticesById(practiceId.toString()),
        retry: false,
        enabled: practiceId !== -1
    })

    return (
        <>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-8">Praxisprofil</h1>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Praxisname */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Praxisname</h2>
                        <p className="text-gray-900 text-lg">{data?.name}</p>
                    </div>

                    {/* Kontaktdaten */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Kontaktdaten</h2>
                        <div className="space-y-2">
                            <p className="text-gray-900">
                                <span className="font-medium">Telefon:</span> {data?.phone}
                            </p>
                            <p className="text-gray-900">
                                <span className="font-medium">E-Mail:</span> {data?.email}
                            </p>
                            <p className="text-gray-900">
                                <span className="font-medium">Info E-Mail:</span> {data?.infoEmail}
                            </p>
                            {data?.website && (
                                <p className="text-gray-900">
                                    <span className="font-medium">Website:</span> {data?.website}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Adresse */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Adresse</h2>
                        <div className="text-gray-900">
                            <p>{data?.address.street}</p>
                            <p>{data?.address.cityCode} {data?.address.city}</p>
                        </div>
                    </div>

                    {/* Zusätzliche Info */}
                    {data?.info && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-3">Zusätzliche Informationen</h2>
                            <p className="text-gray-900">{data?.info}</p>
                        </div>
                    )}

                    {/* Bearbeiten Button */}
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mt-4"
                        onClick={() => setShowEditDialog(true)}
                    >
                        Profil bearbeiten
                    </button>
                </div>
            </div>

            {showEditDialog && data && (
                <PraxisProfileEditDialog
                    hideDialog={() => setShowEditDialog(false)}
                    practice={data}
                />
            )}
        </>
    );
}