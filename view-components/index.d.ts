import { Signal } from "../primitives/types";
import type { ButtonHTMLAttributes, FC, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, TextareaHTMLAttributes } from "../types/index";
import type { BaseViewComponent, ViewComponent } from "./types/index";
/**
 * Returns a section that is a flexible box when NixixJS is used with TailwindCSS
 */
export declare const HStack: FC<BaseViewComponent>;
/**
 * Returns a stack that has its children aligned vertically - column
 */
export declare const VStack: FC<BaseViewComponent>;
/**
 * Returns an article element
 */
export declare const Article: FC<BaseViewComponent>;
/**
 * Returns an aside element
 */
export declare const Aside: FC<BaseViewComponent>;
/**
 * Returns a form element
 */
export declare const FormField: FC<ViewComponent<FormHTMLAttributes<HTMLFormElement>>>;
/**
 * Returns an input element
 */
export declare const TextField: FC<Omit<ViewComponent<InputHTMLAttributes<HTMLInputElement>>, 'children'>>;
/**
 * Returns a textarea element
 */
export declare const TextArea: FC<ViewComponent<TextareaHTMLAttributes<HTMLTextAreaElement>>>;
/**
 * Returns a button element
 */
export declare const Button: FC<ViewComponent<ButtonHTMLAttributes<HTMLButtonElement>>>;
/**
 * Returns a paragragh
 */
export declare const Paragragh: FC<ViewComponent<HTMLAttributes<HTMLParagraphElement>>>;
/**
 * Returns a div element
 */
export declare const Container: FC<ViewComponent<HTMLAttributes<HTMLDivElement>>>;
type HeadingProps = ViewComponent<HTMLAttributes<HTMLHeadingElement>> & {
    type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
/**
 * Returns an h1, h2, h3 heading element with prop passed else returns a h1 tag.
 */
export declare const Heading: FC<HeadingProps>;
/**
 * Returns a main element
 */
export declare const Main: FC<BaseViewComponent>;
type TextNodeProps<T = string | Signal<string>> = {
    children?: T;
};
/**
 * Returns a textnode
 */
export declare const TextNode: FC<TextNodeProps>;
type ListProps = {
    type?: 'unordered' | 'ordered';
} & ViewComponent<HTMLAttributes<HTMLUListElement> | OlHTMLAttributes<HTMLOListElement>>;
export declare const List: FC<ListProps>;
export declare const ListItem: FC<LiHTMLAttributes<HTMLLIElement>>;
export { BaseViewComponent, ViewComponent };
