import fs from "fs/promises";

export const s3 = new Bun.S3Client({
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT,
});

async function main() {
  const file = await fs.readFile("./test.txt");

  const fileId = "test123.txt";

  const meta = s3.file(fileId);
  console.log(meta);

  console.log("Существует: ", await meta.exists());

  await meta.write(file);
  console.log("Существует: ", await meta.exists());

  const m = await meta.stat();
  console.log(m);

  const fileData = Buffer.from(await meta.arrayBuffer()).toString();
  console.log(fileData);
}

if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
