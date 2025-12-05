"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle, DollarSign, Users, Calendar } from "lucide-react"
import { notificationsService, type Notification } from "@/lib/services/notifications.service"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface NotificationsListProps {
    onNotificationRead?: () => void
    onClose?: () => void
}

export function NotificationsList({ onNotificationRead, onClose }: NotificationsListProps) {
    const { toast } = useToast()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadNotifications()
    }, [])

    const loadNotifications = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await notificationsService.getAll({ per_page: 20 })
            setNotifications(data.data || [])
        } catch (err: any) {
            setError(err.message || 'Erreur de chargement')
            toast({
                title: "Erreur",
                description: "Impossible de charger les notifications",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationsService.markAsRead(id)
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            )
            onNotificationRead?.()
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: "Impossible de marquer comme lu",
                variant: "destructive"
            })
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead()
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
            )
            onNotificationRead?.()
            toast({
                title: "Succès",
                description: "Toutes les notifications ont été marquées comme lues"
            })
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: "Impossible de marquer toutes comme lues",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await notificationsService.delete(id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            onNotificationRead?.()
            toast({
                title: "Succès",
                description: "Notification supprimée"
            })
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer la notification",
                variant: "destructive"
            })
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case 'error':
                return <XCircle className="h-5 w-5 text-red-600" />
            case 'payment':
                return <DollarSign className="h-5 w-5 text-blue-600" />
            case 'presence':
                return <Users className="h-5 w-5 text-purple-600" />
            case 'activity':
                return <Calendar className="h-5 w-5 text-indigo-600" />
            default:
                return <Info className="h-5 w-5 text-gray-600" />
        }
    }

    const formatDate = (date: string) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
        } catch {
            return date
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <p className="text-sm text-destructive mb-2">{error}</p>
                <Button onClick={loadNotifications} variant="outline" size="sm">
                    Réessayer
                </Button>
            </div>
        )
    }

    const unreadNotifications = notifications.filter(n => !n.read_at)

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadNotifications.length > 0 && (
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                    >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Liste */}
            <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Info className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">Aucune notification</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read_at ? 'bg-blue-50/50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{notification.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>
                                            {!notification.read_at && (
                                                <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            {!notification.read_at && (
                                                <Button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                >
                                                    Marquer comme lu
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => handleDelete(notification.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
