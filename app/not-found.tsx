import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C10] px-4 py-12 text-slate-100">
      <div className="w-full max-w-2xl">
        <Card className="border-violet-500/20 bg-[#111827]/90 shadow-2xl shadow-violet-950/30">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3">
                <Compass className="size-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-400">
                  404
                </p>
                <CardTitle className="text-3xl">
                  Lost in the cyber range
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base text-slate-300">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved. Head back to safety.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                className: "bg-violet-600 hover:bg-violet-500",
              })}
            >
              <Home className="mr-2 size-4" />
              Go to dashboard
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800",
              })}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
