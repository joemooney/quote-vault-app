import type { SVGProps } from "react";

export function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v12c0 1.25.75 2 2 2z" />
      <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2.017-2-2h-4c-1.25 0-2 .75-2 2v12c0 1.25.75 2 2 2z" />
    </svg>
  );
}

export function AiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 5.5L13.75 9.25L18 10L15.25 13.25L15.5 17.5L12 15.75L8.5 17.5L8.75 13.25L6 10L10.25 9.25L12 5.5Z"
        fill="currentColor"
      />
      <path
        d="M4 3L5.5 8L1 9.5L5.5 11L4 16L9 14.5L14 16L12.5 11L17 9.5L12.5 8L14 3L9 4.5L4 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
