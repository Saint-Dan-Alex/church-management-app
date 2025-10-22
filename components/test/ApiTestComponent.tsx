'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/utils/api';
import { Monitor, Child, Statistics } from '@/lib/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function ApiTestComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [childrenStats, setChildrenStats] = useState<Statistics | null>(null);
  const [apiHealth, setApiHealth] = useState<any>(null);

  useEffect(() => {
    async function testApi() {
      try {
        setLoading(true);
        setError(null);

        // Test 1: Health check
        const health = await fetch('http://127.0.0.1:8000/api/health').then(r => r.json());
        setApiHealth(health);

        // Test 2: Get monitors (limit 5)
        const monitorsData = await api.get<Monitor[]>('/monitors?per_page=5');
        setMonitors(monitorsData);

        // Test 3: Get children statistics
        const stats = await api.get<Statistics>('/children-statistics');
        setChildrenStats(stats);

        setLoading(false);
      } catch (err: any) {
        console.error('API Test Error:', err);
        setError(err.message || 'Erreur de connexion à l\'API');
        setLoading(false);
      }
    }

    testApi();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test de connexion API</CardTitle>
          <CardDescription>Vérification de la connexion au backend Laravel...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Erreur de connexion
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Vérifiez que :</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Le backend Laravel est démarré : <code className="bg-muted px-1 rounded">php artisan serve</code></li>
              <li>L'URL de l'API est correcte dans <code className="bg-muted px-1 rounded">.env.local</code></li>
              <li>CORS est configuré dans <code className="bg-muted px-1 rounded">backend-laravel/config/cors.php</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            API Backend connectée
          </CardTitle>
          <CardDescription>
            {apiHealth?.message} - Version {apiHealth?.version}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="bg-green-50">
            Status: {apiHealth?.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Monitors */}
      <Card>
        <CardHeader>
          <CardTitle>Moniteurs ({monitors.length})</CardTitle>
          <CardDescription>Premiers moniteurs récupérés depuis l'API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monitors.map((monitor) => (
              <div key={monitor.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{monitor.nom} {monitor.post_nom} {monitor.prenom}</p>
                  <p className="text-sm text-muted-foreground">{monitor.email}</p>
                </div>
                <Badge variant="secondary">{monitor.salle_actuelle_nom || 'Non affecté'}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Children Statistics */}
      {childrenStats && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Enfants</CardTitle>
            <CardDescription>Données récupérées depuis l'API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(childrenStats).map(([key, value]) => (
                <div key={key} className="p-3 border rounded">
                  <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
