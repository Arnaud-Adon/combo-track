"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function StrategyMatrixHelpDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("strategyMatrix");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <HelpCircle className="mr-2 h-4 w-4" />
          {t("help.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase">
            {t("help.title")}
          </DialogTitle>
          <DialogDescription>
            {t.rich("help.intro", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h3 className="font-display text-sm uppercase">
              {t("help.steps.heading")}
            </h3>
            <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5">
              <li>
                {t.rich("help.steps.step1", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </li>
              <li>
                {t.rich("help.steps.step2", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </li>
              <li>
                {t.rich("help.steps.step3", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </li>
              <li>
                {t.rich("help.steps.step4", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </li>
              <li>
                {t.rich("help.steps.step5", {
                  strong: (chunks) => (
                    <strong className="text-foreground">{chunks}</strong>
                  ),
                })}
              </li>
            </ol>
          </section>

          <section className="space-y-2">
            <h3 className="font-display text-sm uppercase">
              {t("help.example.heading")}
            </h3>
            <p className="text-muted-foreground">
              {t.rich("help.example.intro", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left font-semibold"></th>
                    <th className="p-2 text-left font-semibold">
                      {t("help.example.table.driveFull")}
                    </th>
                    <th className="p-2 text-left font-semibold">
                      {t("help.example.table.driveMid")}
                    </th>
                    <th className="p-2 text-left font-semibold">
                      {t("help.example.table.burnout")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="bg-muted/40 p-2 font-semibold">
                      {t("help.example.table.midscreen")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.midscreenFull")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.midscreenMid")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.midscreenBurnout")}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="bg-muted/40 p-2 font-semibold">
                      {t("help.example.table.corner")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.cornerFull")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.cornerMid")}
                    </td>
                    <td className="p-2">
                      {t("help.example.table.cornerBurnout")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground italic">
              {t("help.example.tip")}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-display text-sm uppercase">
              {t("help.bestPractices.heading")}
            </h3>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>
                {t.rich("help.bestPractices.item1", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>{t("help.bestPractices.item2")}</li>
              <li>{t("help.bestPractices.item3")}</li>
              <li>
                {t.rich("help.bestPractices.item4", {
                  code: (chunks) => <code>{chunks}</code>,
                })}
              </li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("help.gotIt")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
