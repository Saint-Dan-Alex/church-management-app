import { ApiTestComponent } from '@/components/test/ApiTestComponent';

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test de connexion API</h1>
          <p className="text-muted-foreground mt-2">
            Cette page teste la connexion entre le frontend Next.js et le backend Laravel
          </p>
        </div>

        <ApiTestComponent />

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Instructions :</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Assurez-vous que le backend Laravel est démarré sur <code className="bg-background px-1 rounded">http://127.0.0.1:8000</code></li>
            <li>Créez le fichier <code className="bg-background px-1 rounded">.env.local</code> avec <code className="bg-background px-1 rounded">NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1</code></li>
            <li>Redémarrez le serveur Next.js si nécessaire</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
