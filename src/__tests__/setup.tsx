import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Mock Element.prototype.scrollIntoView for jsdom environment
if (typeof window !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/chat",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      return ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
        const { initial, animate, transition, whileHover, whileTap, ...rest } = props;
        const Tag = String(prop);
        return <div data-testid={`motion-${Tag}`} {...rest}>{children}</div>;
      };
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock @lottiefiles/dotlottie-react
vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div data-testid="lottie-animation" />,
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
  ToastContainer: () => null,
}));
