import { GlossaryList } from "@/components/features/glossary/glossary-list";
import { getAllPublishedArticles } from "../../../prisma/query/glossary.query";

export default async function GlossaryPage() {
  const articles = await getAllPublishedArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <GlossaryList articles={articles} />
    </div>
  );
}
