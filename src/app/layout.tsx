"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";

const interSans = Inter({
	variable: "--font-inter-sans",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${interSans.variable} antialiased`}><QueryClientProvider client = {queryClient}>{children}</QueryClientProvider></body>
		</html>
	);
}
