import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Aucune vidéo trouvée</CardTitle>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}
