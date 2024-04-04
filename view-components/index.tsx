import { createFragment } from "../dom/helpers";
import { Signal } from "../primitives/types";
import type {
  ButtonHTMLAttributes,
  FC,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  TextareaHTMLAttributes,
} from "../types/index";
import type { BaseViewComponent, ViewComponent } from "./types/index";

/**
 * Returns a section that is a flexible box when NixixJS is used with TailwindCSS
 */
export const HStack: FC<BaseViewComponent> = ({ children, className, ...rest }): someView => {
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
export const VStack: FC<BaseViewComponent> = ({children, ...rest}): someView => {
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
export const Article: FC<BaseViewComponent> = ({ children, ...rest }): someView => {
  return <article {...rest}>{children}</article>;
};

/**
 * Returns an aside element
 */
export const Aside: FC<BaseViewComponent> = ({children, ...rest}): someView => {
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
export const FormField: FC<ViewComponent<FormHTMLAttributes<HTMLFormElement>>> = (
  {children, ...rest}
): someView => {
  return <form {...rest}>{children}</form>;
};

/**
 * Returns an input element
 */
export const TextField: FC<Omit<ViewComponent<InputHTMLAttributes<HTMLInputElement>>, 'children'>> = (
  props
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
export const TextArea: FC<ViewComponent<TextareaHTMLAttributes<HTMLTextAreaElement>>> = (
  {children, ...rest}
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
export const Button: FC<ViewComponent<ButtonHTMLAttributes<HTMLButtonElement>>> = (
  {children, ...rest}
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
export const Paragragh: FC<ViewComponent<HTMLAttributes<HTMLParagraphElement>>> = (
  {children, ...rest}
): someView => {
  return <p {...rest}>{children}</p>;
};

/**
 * Returns a div element
 */
export const Container: FC<ViewComponent<HTMLAttributes<HTMLDivElement>>> = (
  {children, ...rest}
): someView => {
  return <div {...rest}>{children}</div>;
};

type HeadingProps = ViewComponent<HTMLAttributes<HTMLHeadingElement>> & {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
/**
 * Returns an h1, h2, h3 heading element with prop passed else returns a h1 tag.
 */
export const Heading: FC<HeadingProps> = ({children, type: Type = 'h1', ...rest}): someView => {
  return (<Type {...rest}>{children}</Type>);
};

/**
 * Returns a main element
 */
export const Main: FC<BaseViewComponent> = ({children, ...rest}): someView => {
  return <main {...rest}>{children}</main>;
};

type TextNodeProps<T = string | Signal<string>> = {
  children?: T;
};
/**
 * Returns a textnode
 */
export const TextNode: FC<TextNodeProps> = ({children}): someView => {
  return children ? createFragment(children) : [];
};

type ListProps = {
  type?: 'unordered' | 'ordered'
} & ViewComponent<HTMLAttributes<HTMLUListElement> | OlHTMLAttributes<HTMLOListElement>>;

export const List: FC<ListProps> = ({children, type, ...rest}): someView => {
  const Listtype = ((type || 'unordered') === 'unordered') ? 'ul' : 'ol'
  return <Listtype {...rest as any} >{children}</Listtype> 
}

export const ListItem: FC<LiHTMLAttributes<HTMLLIElement>> = ({children, ...rest}): someView => {
  return <li {...rest} >{children}</li> 
}

export { BaseViewComponent, ViewComponent };
