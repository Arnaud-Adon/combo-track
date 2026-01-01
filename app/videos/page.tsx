import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function VideosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const matches = await prisma.match.findMany({
    where: {
      userId: session.user.id,
    },
  });

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
