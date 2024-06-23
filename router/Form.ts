import { matchRoutes, type AgnosticIndexRouteObject, type AgnosticRouteMatch } from "@remix-run/router";
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
  let path: `/${string}`;
  let routeMatches: AgnosticRouteMatch<string, AgnosticIndexRouteObject>[] | null;
	const subMitHandler: FormActionProps["on:submit"] = (e) => {
		e.preventDefault();
    path = `${rest.action}`
		routeMatches = matchRoutes(agnosticRouteObjects, {
			pathname: path,
		});

		if (routeMatches && len(routeMatches) !== 0) {
			const routeMatch = lastElement(routeMatches);
			const { action, path: rPath } = routeMatch.route;
			if (!action) return raise(`Specify a route action function for ${rPath}`);
			onSubmit?.(e);
			const formData = new FormData(e.currentTarget);
			callAction({
				actionPath: path,
				status: isSubmitting,
				formData,
				routeMatch,
			});
		}
	};
	return create(
		"form",
		{ ...rest, "on:submit": subMitHandler },
		children as any
	);
};
