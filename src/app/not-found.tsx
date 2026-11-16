import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 40 }}>
        <h1>Page not found</h1>
        <Link href="/en">ECG Mastery</Link>
      </body>
    </html>
  );
}
