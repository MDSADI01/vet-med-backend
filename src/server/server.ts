import "dotenv/config";

import { prisma } from "../lib/prisma";
import app from "../app/app";

const PORT = 8000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database Successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("An error occurred", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

