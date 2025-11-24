import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function VideosPage() {
  const matches = await prisma.match.findMany();

  if (!matches) {
    return (
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Aucune vidéo trouvée</CardTitle>
          </CardHeader>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test</CardTitle>
      </CardHeader>
    </Card>
  );
}
