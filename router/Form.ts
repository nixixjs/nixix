import { matchRoutes } from "@remix-run/router";
import { create } from "../dom";
import { raise } from "../shared";
import { callAction } from "./callAction";
import { lastElement, len } from "./helpers";
import type { FormActionProps } from "./types/index";
import { agnosticRouteObjects } from "./utils";

export const Form = ({
  children,
  "on:submit": onSubmit,
  isSubmitting,
  ...rest
}: FormActionProps) => {
  let path = `${rest.action}` as `/${string}`;
  const routeMatches = matchRoutes(agnosticRouteObjects, {
    pathname: path
  });

  if (routeMatches && len(routeMatches) !== 0) {
    const routeMatch = lastElement(routeMatches);
    const { action, path: rPath } = routeMatch.route
    if (!action) 
      raise(`Specify a route action function for ${rPath}`)
    const subMitHandler: FormActionProps["on:submit"] = (e) => {
      e.preventDefault();
      onSubmit?.(e);
      const formData = new FormData(e.currentTarget);
      path = `${rest.action}`
      callAction({ actionPath: path, status: isSubmitting, formData, routeMatch });
    };
    return create(
      "form",
      { ...rest, "on:submit": subMitHandler },
      children as any
    );
  } else raise(`There are no route matches for ${path}`);
};
