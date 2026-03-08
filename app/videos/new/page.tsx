import { MatchForm } from "@/components/features/match/match-form";
import { Layout, LayoutHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewVideoPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <Layout className="max-w-2xl">
      <LayoutHeader>
        <div className="flex w-full items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Nouveau replay</h1>
        </div>
      </LayoutHeader>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un replay YouTube</CardTitle>
        </CardHeader>
        <CardContent>
          <MatchForm />
        </CardContent>
      </Card>
    </Layout>
  );
}
