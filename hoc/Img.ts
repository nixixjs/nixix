import Nixix from "../dom";
import { type ImgHTMLAttributes } from "../types";

export function Img(props: ImgHTMLAttributes<HTMLImageElement>) {
  return Nixix.create("img", { src: "./" + props.src, ...props });
}
