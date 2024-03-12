import { Primitive } from "../primitives/types";
import { createFragment } from "../dom/helpers";
import type {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "../types/index";
import type { BaseViewComponent, ViewComponent } from "./types/index";

/**
 * Returns a section that is a flexible box when NixixJS is used with TailwindCSS
 */
export const HStack = ({ children, className, ...rest }: BaseViewComponent = {}): someView => {
  return (
    <section
      {...rest}
      className={`flex ${className || ''} `}
      >
      {children}
    </section>
  );
};

/**
 * Returns a stack that has its children aligned vertically - column
 */
export const VStack = ({children, ...rest}: BaseViewComponent = {}): someView => {
  return (
    <section
      {...rest}>
      {children}
    </section>
  );
};

/**
 * Returns an article element
 */
export const Article = ({ children, ...rest }: BaseViewComponent = {}): someView => {
  return <article {...rest}>{children}</article>;
};

/**
 * Returns an aside element
 */
export const Aside = ({children, ...rest}: BaseViewComponent = {}): someView => {
  return (
    <aside
      {...rest}>
      {children}
    </aside>
  );
};

/**
 * Returns a form element
 */
export const FormField = (
  {children, ...rest}: ViewComponent<FormHTMLAttributes<HTMLFormElement>> = {}
): someView => {
  return <form {...rest}>{children}</form>;
};

/**
 * Returns an input element
 */
export const TextField = (
  props: Omit<ViewComponent<InputHTMLAttributes<HTMLInputElement>>, 'children'> = {}
): someView => {
  return (
    <input
      spellcheck
      autocapitalize={"sentences"}
      type={"text"}
      {...props}
    />
  );
};

/**
 * Returns a textarea element
 */
export const TextArea = (
  {children, ...rest}: ViewComponent<TextareaHTMLAttributes<HTMLTextAreaElement>> = {}
): someView => {
  return (
    <textarea
      spellcheck
      autocapitalize={"sentences"}
      {...rest}>
      {children}
    </textarea>
  );
};

/**
 * Returns a button element
 */
export const Button = (
  {children, ...rest}: ViewComponent<ButtonHTMLAttributes<HTMLButtonElement>> = {}
): someView => {
  return (
    <button
      style={{ cursor: "pointer" }}
      {...rest}>
      {children}
    </button>
  );
};

/**
 * Returns a paragragh
 */
export const Paragragh = (
  {children, ...rest}: ViewComponent<HTMLAttributes<HTMLParagraphElement>> = {}
): someView => {

  return <p {...rest}>{children}</p>;
};

/**
 * Returns a div element
 */
export const Container = (
  {children, ...rest}: ViewComponent<HTMLAttributes<HTMLDivElement>> = {}
): someView => {
  return <div {...rest}>{children}</div>;
};

type HeadingProps = ViewComponent<HTMLAttributes<HTMLHeadingElement>> & {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
/**
 * Returns an h1, h2, h3 heading element with prop passed else returns a h1 tag.
 */
export const Heading = ({children, type: Type = 'h1', ...rest}: HeadingProps): someView => {
  return (<Type {...rest}>{children}</Type>);
};

/**
 * Returns a main element
 */
export const Main = ({children, ...rest}: BaseViewComponent = {}): someView => {
  return <main {...rest}>{children}</main>;
};

type TextNodeProps<T = Primitive> = {
  children?: T[];
};
/**
 * Returns a textnode
 */
export const TextNode = ({children}: TextNodeProps = {}): someView => {
  return children ? createFragment(children) : [];
};

export { BaseViewComponent, ViewComponent };
