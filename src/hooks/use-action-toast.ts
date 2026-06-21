"use client";

import { useAction } from "next-safe-action/hooks";
import type {
  HookCallbacks,
  HookSafeActionFn,
  UseActionHookReturn,
} from "next-safe-action/hooks";
import { toast } from "sonner";

/**
 * Any next-safe-action client action. Every concrete action is assignable to
 * this (params are contravariant, so `never` accepts any input) — it lets the
 * hook stay generic without naming the library's internal schema type.
 */
type AnyHookSafeActionFn = (input: never) => Promise<unknown>;

type InferOnSuccess<Fn> =
  Fn extends HookSafeActionFn<infer SE, infer S, infer CVE, infer Data>
    ? NonNullable<HookCallbacks<SE, S, CVE, Data>["onSuccess"]>
    : never;

type InferOnError<Fn> =
  Fn extends HookSafeActionFn<infer SE, infer S, infer CVE, infer Data>
    ? NonNullable<HookCallbacks<SE, S, CVE, Data>["onError"]>
    : never;

type InferReturn<Fn> =
  Fn extends HookSafeActionFn<infer SE, infer S, infer CVE, infer Data>
    ? UseActionHookReturn<SE, S, CVE, Data>
    : never;

type InferData<Fn> = Parameters<InferOnSuccess<Fn>>[0] extends { data: infer D }
  ? D
  : never;

type UseActionToastOptions<Fn extends AnyHookSafeActionFn> = {
  /**
   * Success toast. A string shows unconditionally; a function lets the toast
   * depend on the returned data (return `undefined` to skip the toast).
   */
  successMessage?: string | ((data: InferData<Fn>) => string | null | undefined);
  /** Fallback error toast — `error.serverError` takes precedence when present. */
  errorMessage?: string;
  /** Extra side effects on success (router navigation, dialog reset, …). */
  onSuccess?: InferOnSuccess<Fn>;
  /** Extra side effects on error. */
  onError?: InferOnError<Fn>;
};

/**
 * `useAction` wrapper that centralizes the repeated sonner toast boilerplate
 * (`toast.success(t(...))` + `toast.error(error.serverError ?? t(...))`). Pass
 * already-translated messages; extra side effects stay overridable via
 * `onSuccess` / `onError`.
 */
export function useActionToast<Fn extends AnyHookSafeActionFn>(
  action: Fn,
  options: UseActionToastOptions<Fn> = {},
): InferReturn<Fn> {
  const { successMessage, errorMessage, onSuccess, onError } = options;

  return useAction(action as unknown as HookSafeActionFn<unknown, undefined, unknown, unknown>, {
    onSuccess: (args) => {
      const message =
        typeof successMessage === "function"
          ? successMessage(args.data as InferData<Fn>)
          : successMessage;
      if (message) {
        toast.success(message);
      }
      (onSuccess as ((args: unknown) => void) | undefined)?.(args);
    },
    onError: (args) => {
      const serverError = args.error.serverError as string | undefined;
      const fallback = serverError ?? errorMessage;
      if (fallback) {
        toast.error(fallback);
      }
      (onError as ((args: unknown) => void) | undefined)?.(args);
    },
  }) as unknown as InferReturn<Fn>;
}
