import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-mono text-sm text-fg-subtle">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found · Pagina niet gevonden</h1>
      <Link href="/" className="mt-6 inline-block text-accent underline">ECG Mastery</Link>
    </div>
  );
}
