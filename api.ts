import { treaty } from "@elysiajs/eden";
import { app } from "./src/app";



export const { api } = treaty<typeof app>("http://localhost:3000", {
	fetch: { credentials: "include" },
});
