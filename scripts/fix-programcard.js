const fs = require("fs");

const file = "app/page.tsx";
let s = fs.readFileSync(file, "utf8");

// Replace ANY ProgramCard function with the correct one (with imageSrc)
const programCardRE = /function ProgramCard\([\s\S]*?\n\}\n/m;

const newProgramCard = `function ProgramCard({
  title,
  desc,
  tag,
  imageSrc,
}: {
  title: string;
  desc: string;
  tag: string;
  imageSrc: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-7">
        <Badge>{tag}</Badge>
        <div className="mt-3 text-lg font-semibold tracking-tight">{title}</div>
        <p className="mt-2 text-sm text-mutedInk">{desc}</p>
        <div className="mt-5">
          <Link
            href="/programs"
            className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Learn more <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
`;

if (!s.includes("function ProgramCard(")) {
  console.error("❌ Could not find ProgramCard in app/page.tsx");
  process.exit(1);
}

s = s.replace(programCardRE, newProgramCard + "\n");

fs.writeFileSync(file, s, "utf8");
console.log("✅ ProgramCard fixed to accept imageSrc");
