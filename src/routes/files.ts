import Elysia from "elysia";
import { s3 } from "../server/s3";

export const filesRoutes = new Elysia({
  prefix: "/files",
}).get("/:id", async ({ params, status }) => {
  const meta = s3.file(params.id);
  if (!(await meta.exists())) {
    return status(404, "File not found!");
  }

  const data = await meta.stat();

  return new Response(meta.stream(), {
    headers: {
      "Content-Type": data.type,
      "Content-Length": data.size.toString(),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(params.id)}"`,
    },
  });
});
