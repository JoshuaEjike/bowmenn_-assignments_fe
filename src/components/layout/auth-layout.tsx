import { Outlet, Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { ROUTES } from "@/app/constants/routes";

/**
 * Split layout for the auth flow: form on the left, a route-motif panel
 * on the right that carries the brand without competing with the form.
 */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
        <Link to={ROUTES.root} className="flex items-center gap-2 font-display text-lg font-semibold text-primary-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-800 text-primary-foreground">
            <Truck className="h-4 w-4" />
          </span>
          Bowmenn
        </Link>

        <div className="mx-auto w-full max-w-sm py-12">
          <Outlet />
        </div>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Bowmenn Freight, Inc.</p>
      </div>

      <div className="relative hidden overflow-hidden bg-primary-800 lg:block">
        <svg viewBox="0 0 600 800" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(216 45% 16%)" />
              <stop offset="100%" stopColor="hsl(216 45% 10%)" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#fade)" />
          <path
            d="M -20 650 C 150 600, 220 500, 180 380 S 60 220, 200 120 S 480 60, 620 -20"
            fill="none"
            stroke="hsl(37 100% 56% / 0.55)"
            strokeWidth="3"
            strokeDasharray="10 10"
            className="animate-route-dash"
          />
          {[
            [180, 380],
            [200, 120],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill="hsl(37 100% 56%)" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <p className="font-display text-3xl font-semibold leading-tight text-primary-foreground">
            Every shipment,
            <br />
            tracked door to door.
          </p>
          <p className="mt-3 max-w-sm text-sm text-primary-100/80">
            From pickup to proof of delivery, Bowmenn keeps customers, drivers, and dispatch on the same page.
          </p>
        </div>
      </div>
    </div>
  );
}
