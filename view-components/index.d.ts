import { Primitive } from "../primitives/types";
import type { ButtonHTMLAttributes, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "../types/index";
import type { BaseViewComponent, ViewComponent } from "./types/index";
/**
 * Returns a section that is a flexible box when NixixJS is used with TailwindCSS
 */
export declare const HStack: ({ children, className, ...rest }?: BaseViewComponent) => someView;
/**
 * Returns a stack that has its children aligned vertically - column
 */
export declare const VStack: ({ children, ...rest }?: BaseViewComponent) => someView;
/**
 * Returns an article element
 */
export declare const Article: ({ children, ...rest }?: BaseViewComponent) => someView;
/**
 * Returns an aside element
 */
export declare const Aside: ({ children, ...rest }?: BaseViewComponent) => someView;
/**
 * Returns a form element
 */
export declare const FormField: ({ children, ...rest }?: ViewComponent<FormHTMLAttributes<HTMLFormElement>>) => someView;
/**
 * Returns an input element
 */
export declare const TextField: (props?: Omit<ViewComponent<InputHTMLAttributes<HTMLInputElement>>, 'children'>) => someView;
/**
 * Returns a textarea element
 */
export declare const TextArea: ({ children, ...rest }?: ViewComponent<TextareaHTMLAttributes<HTMLTextAreaElement>>) => someView;
/**
 * Returns a button element
 */
export declare const Button: ({ children, ...rest }?: ViewComponent<ButtonHTMLAttributes<HTMLButtonElement>>) => someView;
/**
 * Returns a paragragh
 */
export declare const Paragragh: ({ children, ...rest }?: ViewComponent<HTMLAttributes<HTMLParagraphElement>>) => someView;
/**
 * Returns a div element
 */
export declare const Container: ({ children, ...rest }?: ViewComponent<HTMLAttributes<HTMLDivElement>>) => someView;
type HeadingProps = ViewComponent<HTMLAttributes<HTMLHeadingElement>> & {
    type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
/**
 * Returns an h1, h2, h3 heading element with prop passed else returns a h1 tag.
 */
export declare const Heading: ({ children, type: Type, ...rest }: HeadingProps) => someView;
/**
 * Returns a main element
 */
export declare const Main: ({ children, ...rest }?: BaseViewComponent) => someView;
type TextNodeProps<T = Primitive> = {
    children?: T[];
};
/**
 * Returns a textnode
 */
export declare const TextNode: ({ children }?: TextNodeProps) => someView;
export { BaseViewComponent, ViewComponent };
