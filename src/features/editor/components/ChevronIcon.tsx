import type { SVGProps } from 'react';

export const ChevronIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path
      d="M7 4l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
