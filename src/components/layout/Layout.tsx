import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";

export const Layout = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "m-auto mt-4 flex w-full max-w-3xl flex-wrap gap-4 px-4",
        props.className,
      )}
    ></div>
  );
};

export const LayoutHeader = (props: ComponentPropsWithRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full min-w-[200px] flex-col items-center gap-1 md:flex-1",
        props.className,
      )}
    ></div>
  );
};

export const LayoutContent = (props: ComponentPropsWithRef<"div">) => {
  return (
    <div {...props} className={cn("mx-auto w-2/4", props.className)}></div>
  );
};
