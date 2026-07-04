// Creates the same demo accounts the app used to ship with as MOCK_USERS,
// so the "Quick demo" login hint on the frontend keeps working.
// Run with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("./models/User");

const DEMO_USERS = [
  { name: "Vasu Rathore", email: "vasu@bitrush.com", password: "1234", phone: "9174152634" },
  { name: "Demo User", email: "demo@bitrush.com", password: "demo", phone: "9999999999" },
];

(async () => {
  await connectDB();
  for (const u of DEMO_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`↷ ${u.email} already exists, skipping`);
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, 10);
    const avatar = u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    await User.create({ ...u, passwordHash, avatar });
    console.log(`✓ Created ${u.email} (password: ${u.password})`);
  }
  console.log("Done seeding.");
  process.exit(0);
})().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
