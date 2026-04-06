import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="ko">
        <body>
        <header>
            <h1>My Todo</h1>
            <nav>
                <Link href="/">홈</Link>
                <Link href="/todos">할 일</Link>
                <Link href="/settings">설정</Link>
            </nav>
        </header>

        <main>{children}</main>
        </body>
        </html>
    );
}