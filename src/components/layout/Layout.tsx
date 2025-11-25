import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";

export const Layout = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "max-w-3xl flex-wrap w-full flex gap-4 m-auto px-4 mt-4",
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
        "flex items-center gap-1 flex-col w-full md:flex-1 min-w-[200px]",
        props.className,
      )}
    ></div>
  );
};

export const LayoutContent = (props: ComponentPropsWithRef<"div">) => {
  return (
    <div {...props} className={cn("w-2/4 mx-auto", props.className)}></div>
  );
};
