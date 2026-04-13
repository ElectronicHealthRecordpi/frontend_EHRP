import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import esLocale from '@fullcalendar/core/locales/es'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, User, Calendar, Trash2, ExternalLink, Plus } from 'lucide-react'

interface AppointmentEvent extends EventInput {
    extendedProps?: {
        patient: string
        type: 'consulta' | 'seguimiento' | 'urgencia' | 'examen'
        notes?: string
    }
}

const eventTypeConfig: Record<string, { color: string; label: string; badgeClass: string }> = {
    consulta: {
        color: '#3b82f6',
        label: 'Consulta',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    seguimiento: {
        color: '#10b981',
        label: 'Seguimiento',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    urgencia: {
        color: '#ef4444',
        label: 'Urgencia',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
    },
    examen: {
        color: '#8b5cf6',
        label: 'Examen',
        badgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
    },
}

const today = new Date().toISOString().replace(/T.*/, '')

const initialEvents: AppointmentEvent[] = [
    {
        id: '1',
        title: 'Consulta - Juan Perez',
        start: `${today}T09:00:00`,
        end: `${today}T09:30:00`,
        color: eventTypeConfig.consulta.color,
        extendedProps: {
            patient: 'Juan Perez',
            type: 'consulta',
            notes: 'Control de presión arterial y revisión de medicación.',
        },
    },
    {
        id: '2',
        title: 'Seguimiento - Maria Lopez',
        start: `${today}T10:00:00`,
        end: `${today}T10:30:00`,
        color: eventTypeConfig.seguimiento.color,
        extendedProps: {
            patient: 'Maria Lopez',
            type: 'seguimiento',
            notes: 'Seguimiento post-operatorio, verificar cicatrización.',
        },
    },
    {
        id: '3',
        title: 'Urgencia - Carlos Ramos',
        start: `${today}T11:30:00`,
        end: `${today}T12:00:00`,
        color: eventTypeConfig.urgencia.color,
        extendedProps: {
            patient: 'Carlos Ramos',
            type: 'urgencia',
        },
    },
    {
        id: '4',
        title: 'Examen - Ana Torres',
        start: `${today}T14:00:00`,
        end: `${today}T14:45:00`,
        color: eventTypeConfig.examen.color,
        extendedProps: {
            patient: 'Ana Torres',
            type: 'examen',
            notes: 'Examen de laboratorio completo, ayuno previo requerido.',
        },
    },
]

export const DoctorHome = () => {
    const [events, setEvents] = useState<AppointmentEvent[]>(initialEvents)
    const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [newEventDate, setNewEventDate] = useState<string>('')
    const [newPatient, setNewPatient] = useState('')
    const [newType, setNewType] = useState<string>('consulta')
    const [newNotes, setNewNotes] = useState('')
    const navigate = useNavigate()

    const handleDateClick = (arg: DateClickArg) => {
        setNewEventDate(arg.dateStr)
        setNewPatient('')
        setNewType('consulta')
        setNewNotes('')
        setIsNewModalOpen(true)
    }

    const handleCreateEvent = () => {
        if (!newPatient.trim()) return
        const type = newType as keyof typeof eventTypeConfig
        const config = eventTypeConfig[type]
        setEvents(prev => [
            ...prev,
            {
                id: String(Date.now()),
                title: `${config.label} - ${newPatient}`,
                start: newEventDate,
                allDay: !newEventDate.includes('T'),
                color: config.color,
                extendedProps: {
                    patient: newPatient,
                    type: type as AppointmentEvent['extendedProps'] extends { type: infer T } ? T : never,
                    notes: newNotes || undefined,
                },
            },
        ])
        setIsNewModalOpen(false)
    }

    const handleEventClick = (arg: EventClickArg) => {
        setSelectedEvent(arg)
        setIsModalOpen(true)
    }

    const handleDelete = () => {
        if (selectedEvent) {
            setEvents(prev => prev.filter(e => e.id !== selectedEvent.event.id))
            setIsModalOpen(false)
            setSelectedEvent(null)
        }
    }

    const handleViewDetails = () => {
        if (selectedEvent) {
            navigate(`/doctor/patients`)
        }
    }

    const eventProps = selectedEvent?.event.extendedProps as AppointmentEvent['extendedProps']
    const typeConfig = eventProps?.type ? eventTypeConfig[eventProps.type] : null

    const formatTime = (date: Date | null) => {
        if (!date) return '--:--'
        return date.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (date: Date | null) => {
        if (!date) return ''
        return date.toLocaleDateString('es-BO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <main className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Agenda de Citas
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Gestiona tus consultas y citas médicas
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {Object.entries(eventTypeConfig).map(([key, config]) => (
                        <div key={key} className="hidden md:flex items-center gap-1.5">
                            <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                            <span className="text-xs text-gray-500">{config.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar container */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        locale={esLocale}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        buttonText={{
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="20:00:00"
                        allDaySlot={false}
                        events={events}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        editable
                        selectable
                        nowIndicator
                        height="auto"
                        dayMaxEvents={3}
                        eventDisplay="block"
                    />
                </div>
            </div>

            {/* ── Event Detail Modal ── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            {typeConfig && (
                                <Badge
                                    variant="outline"
                                    className={`text-[0.65rem] font-semibold px-2 py-0.5 ${typeConfig.badgeClass}`}
                                >
                                    {typeConfig.label}
                                </Badge>
                            )}
                        </div>
                        <DialogTitle className="text-base font-semibold text-gray-900">
                            {selectedEvent?.event.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Detalles de la cita médica
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <div className="space-y-3">
                        {/* Patient */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-gray-100">
                                <User className="size-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Paciente</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {eventProps?.patient ?? 'Sin asignar'}
                                </p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-gray-100">
                                <Calendar className="size-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Fecha</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                    {formatDate(selectedEvent?.event.start ?? null)}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-gray-100">
                                <Clock className="size-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Horario</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatTime(selectedEvent?.event.start ?? null)} — {formatTime(selectedEvent?.event.end ?? null)}
                                </p>
                            </div>
                        </div>

                        {/* Notes */}
                        {eventProps?.notes && (
                            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                                <p className="text-xs font-medium text-gray-500 mb-1">Notas</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {eventProps.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-row gap-2 sm:justify-between">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-1.5"
                        >
                            <Trash2 className="size-3.5" />
                            Eliminar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleViewDetails}
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <ExternalLink className="size-3.5" />
                            Ver paciente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── New Event Modal ── */}
            <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <Plus className="size-4" />
                            Nueva Cita
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Completa los datos para registrar una nueva cita.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                Paciente
                            </label>
                            <input
                                type="text"
                                value={newPatient}
                                onChange={(e) => setNewPatient(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                                placeholder="Nombre del paciente"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de cita
                            </label>
                            <select
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            >
                                {Object.entries(eventTypeConfig).map(([key, config]) => (
                                    <option key={key} value={key}>
                                        {config.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                Notas <span className="text-gray-400">(opcional)</span>
                            </label>
                            <textarea
                                value={newNotes}
                                onChange={(e) => setNewNotes(e.target.value)}
                                rows={2}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-none"
                                placeholder="Observaciones adicionales..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-row gap-2 sm:justify-end">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            size="sm"
                            onClick={handleCreateEvent}
                            disabled={!newPatient.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Crear cita
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
