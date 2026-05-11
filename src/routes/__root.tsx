import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-7">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              Page not found
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-xl">
              We couldn't find that page on Fileforge. Try one of the popular tools below or return to the homepage.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Link
                to="/merge-pdf"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Merge PDFs
              </Link>
              <Link
                to="/compress-pdf"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Compress PDF
              </Link>
              <Link
                to="/ocr-pdf"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                OCR PDF
              </Link>
              <Link
                to="/pdf-to-word"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                PDF → Word
              </Link>
            </div>
          </div>

          <div className="col-span-5 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <div className="mb-2" aria-hidden>
                <svg
                  fill="none"
                  height="45"
                  viewBox="0 0 137 45"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-11 w-28 text-foreground"
                >
                  <path
                    d="M9.27532 43.9941C12.2006 43.9941 14.0559 43.348 16.5885 41.0677C31.215 27.8987 48.7667 20.5827 67.7811 20.5827C86.7955 20.5827 105.81 27.8987 118.974 41.0677C123.362 45.4573 129.212 45.4573 133.6 41.0677C137.988 36.678 137.988 30.8252 133.6 26.4355C116.048 10.3402 92.6461 0.0976562 67.7811 0.0976562C42.9161 0.0976562 19.5138 10.3402 3.42474 27.8987C-0.963194 32.2884 -0.963194 38.1413 3.42474 42.5309C4.88738 43.9941 7.81267 43.9941 9.27532 43.9941Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div
                className="absolute -rotate-[66deg]"
                style={{ width: 160, height: 160 }}
                aria-hidden
              >
                <div
                  className="rounded-full border-4 border-foreground opacity-20"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fileforge — Free private PDF & document tools" },
      {
        name: "description",
        content:
          "Merge, compress, convert, and OCR PDFs in your browser. No sign-up, no uploads, no ads in your face. 100% private.",
      },
      { property: "og:title", content: "Fileforge — Free private PDF & document tools" },
      {
        property: "og:description",
        content:
          "Merge, compress, convert, and OCR PDFs in your browser. No sign-up, no uploads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
