import { getRequestConfig } from "next-intl/server";

import { frMessages } from "./messages";

export const DEFAULT_LOCALE = "fr";

export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  messages: frMessages,
}));
