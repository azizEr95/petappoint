import { useState } from 'react'
import '../../../styles/components/dashboard/DashboardPerson.scss'
import { CalendarPractice } from '@/components/CalendarPractice'

export function DashboardPractice() {
    const [activeTab, setActiveTab] = useState<
        'showAppointments' | 'bookAppointment'
    >('showAppointments')

    return <>
        <div className="dashboard-page">

            {/* Tab Navigation Header */}
            <div className="dashboard-tabs-header">
                <div className="dashboard-tabs">
                    {/* alle anstehenden Termine die von einem Tierbesitzer schon gebucht wurden */}
                    <button 
                        className={`dashboard-tab ${activeTab === 'showAppointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('showAppointments')}
                    > 
                        <i className="bi bi-calendar-check"></i> Termine anzeigen
                    </button>
                    {/* alle noch freien Termine die in der Praxis noch gebucht werden können, oder andere Ansicht hier darstellen??; Filteroption benoetigt */}
                    <button
                        className={`dashboard-tab ${activeTab === 'bookAppointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookAppointment')}
                    >
                        <i className="bi bi-calendar-check"></i> Termin buchen
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'showAppointments' && (
                    <CalendarPractice /> // Termine die angezeigt werden sollen uebergeben
                )}

                {activeTab === 'bookAppointment' && (
                    <CalendarPractice /> // Termine die angezeigt werden sollen uebergeben
                )}

            </div>
        </div>
    </>
}