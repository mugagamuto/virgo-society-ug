import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const users = [
  {
    email: "member1@vigosociety.org",
    password: "VirgoTest!001",
    org_name: "Kampala Youth Savings Group",
    contact_name: "Sarah Namusoke",
    phone: "+256701111111",
    location: "Kampala",
    district: "Central",
    status: "active",
  },
  {
    email: "member2@vigosociety.org",
    password: "VirgoTest!002",
    org_name: "Gulu Women in Business",
    contact_name: "Grace Akello",
    phone: "+256703222222",
    location: "Gulu",
    district: "Northern",
    status: "active",
  },
  {
    email: "member3@vigosociety.org",
    password: "VirgoTest!003",
    org_name: "Mbarara Community Farmers",
    contact_name: "John Tumusiime",
    phone: "+256704333333",
    location: "Mbarara",
    district: "Western",
    status: "suspended",
  },
  {
    email: "member4@vigosociety.org",
    password: "VirgoTest!004",
    org_name: "Jinja Youth Innovators",
    contact_name: "Derrick Kato",
    phone: "+256705444444",
    location: "Jinja",
    district: "Eastern",
    status: "active",
  },
  {
    email: "member5@vigosociety.org",
    password: "VirgoTest!005",
    org_name: "Lira Women Cooperative",
    contact_name: "Patricia Aciro",
    phone: "+256706555555",
    location: "Lira",
    district: "Northern",
    status: "active",
  },
  {
    email: "member6@vigosociety.org",
    password: "VirgoTest!006",
    org_name: "Mbale Savings Circle",
    contact_name: "Ismail Wekesa",
    phone: "+256707666666",
    location: "Mbale",
    district: "Eastern",
    status: "active",
  },
  {
    email: "member7@vigosociety.org",
    password: "VirgoTest!007",
    org_name: "Fort Portal Youth Group",
    contact_name: "Sharon Kabasomi",
    phone: "+256708777777",
    location: "Fort Portal",
    district: "Western",
    status: "active",
  },
  {
    email: "member8@vigosociety.org",
    password: "VirgoTest!008",
    org_name: "Masaka Community Initiative",
    contact_name: "Michael Ssemanda",
    phone: "+256709888888",
    location: "Masaka",
    district: "Central",
    status: "active",
  },
  {
    email: "member9@vigosociety.org",
    password: "VirgoTest!009",
    org_name: "Arua Small Traders",
    contact_name: "Hassan Draru",
    phone: "+256710999999",
    location: "Arua",
    district: "West Nile",
    status: "active",
  },
  {
    email: "member10@vigosociety.org",
    password: "VirgoTest!010",
    org_name: "Entebbe Women Entrepreneurs",
    contact_name: "Christine Nalubega",
    phone: "+256711000000",
    location: "Entebbe",
    district: "Central",
    status: "active",
  },
];

async function upsertMemberRow(u, userId) {
  // NOTE: Adjust column names here if your members table differs
  const payload = {
    user_id: userId,
    org_name: u.org_name,
    contact_name: u.contact_name,
    phone: u.phone,
    email: u.email,
    location: u.location,
    district: u.district,
    status: u.status,
  };

  const { error } = await admin
    .from("members")
    .upsert(payload, { onConflict: "user_id" });

  if (error) throw error;
}

async function main() {
  console.log("Seeding real Auth users + members rows…");

  for (const u of users) {
    // Create user (if exists, we fetch it and still ensure members row exists)
    let userId = null;

    const createRes = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        org_name: u.org_name,
        contact_name: u.contact_name,
        phone: u.phone,
        location: u.location,
        district: u.district,
      },
    });

    if (createRes.error) {
      const msg = createRes.error.message || "";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")) {
        // user already exists -> find by email
        const list = await admin.auth.admin.listUsers({ page: 1, perPage: 2000 });
        if (list.error) throw list.error;

        const found = (list.data?.users || []).find(x => (x.email || "").toLowerCase() === u.email.toLowerCase());
        if (!found) throw new Error(`User exists but could not be found by email: ${u.email}`);

        userId = found.id;
        console.log(`↪ Exists: ${u.email} (${userId})`);
      } else {
        throw createRes.error;
      }
    } else {
      userId = createRes.data.user?.id;
      console.log(`✅ Created: ${u.email} (${userId})`);
    }

    await upsertMemberRow(u, userId);

    console.log(`   Login: ${u.email} / ${u.password}`);
  }

  console.log("\nDONE ✅ You can now log in with those 10 accounts.");
  console.log("Tip: after testing, delete these users or change passwords.");
}

main().catch((e) => {
  console.error("Seed failed:", e?.message || e);
  process.exit(1);
});
