import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("video");

  return (
    <div>
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>{t("notFound.title")}</CardTitle>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}
