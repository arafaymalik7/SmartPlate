import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function IconFrame({ title, children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="none"
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function PlateIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4.25" />
      <path d="M5.7 4.5v3.25M7.5 4.5v3.25M5.7 6.2h1.8M18.3 4.5v3.2M18.3 6.1h-1.4" />
    </IconFrame>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M19.5 4.5C13.1 4.5 7 7.1 5.2 13.7c-.5 1.9.4 4 2.2 5.1 1.7 1.1 4 .9 5.4-.5C17.3 13.7 18.8 8.8 19.5 4.5Z" />
      <path d="M5.4 18.5c2.5-3.8 5.6-6.7 9.5-8.8" />
    </IconFrame>
  );
}

export function ListCheckIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m4 7 1.5 1.5L8.2 5.7M11 7h9M4 17l1.5 1.5 2.7-2.8M11 17h9" />
    </IconFrame>
  );
}

export function BalanceIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 3v18M6 6h12M5 6 2.8 11h4.4L5 6Zm14 0-2.2 5h4.4L19 6ZM8 21h8" />
    </IconFrame>
  );
}
