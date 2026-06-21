import { frMessages } from "@/i18n/messages";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof frMessages;
  }
}
