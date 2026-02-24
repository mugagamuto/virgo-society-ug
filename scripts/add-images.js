const fs = require("fs");

const file = "app/page.tsx";
let s = fs.readFileSync(file, "utf8");

// 1) ensure next/image import
if (!s.includes('import Image from "next/image";')) {
  s = s.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport Image from "next/image";'
  );
}

// 2) add hero background image
if (!s.includes('src="/images/hero.jpg"')) {
  s = s.replace(
    '<div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-sun-200/40 blur-3xl" />',
    '<div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-sun-200/40 blur-3xl" />\n\n        <div className="absolute inset-0 -z-10">\n          <Image\n            src="/images/hero.jpg"\n            alt="Virgo Building Society Uganda community empowerment"\n            fill\n            priority\n            className="object-cover"\n          />\n          <div className="absolute inset-0 bg-white/80" />\n        </div>'
  );
}

// 3) replace ProgramCard component to include imageSrc
const oldProgramCardRE =
  /function ProgramCard\\(\\{ title, desc, tag \\}: \\{ title: string; desc: string; tag: string \\} \\) \\{[\\s\\S]*?\\n\\}/m;

if (oldProgramCardRE.test(s) && !s.includes("imageSrc: string")) {
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
}`;
  s = s.replace(oldProgramCardRE, newProgramCard);
}

// 4) add imageSrc to the three cards
s = s.replace(
  '<ProgramCard title="Financial Skills Bootcamps" tag="Training" desc="Budgeting, saving, record-keeping, pricing and basic tax awareness." />',
  '<ProgramCard title="Financial Skills Bootcamps" tag="Training" desc="Budgeting, saving, record-keeping, pricing and basic tax awareness." imageSrc="/images/training.jpg" />'
);
s = s.replace(
  '<ProgramCard title="Youth & Women Enterprise Support" tag="Enterprise" desc="Mentorship, market access, and tools to grow micro-businesses." />',
  '<ProgramCard title="Youth & Women Enterprise Support" tag="Enterprise" desc="Mentorship, market access, and tools to grow micro-businesses." imageSrc="/images/loans.jpg" />'
);
s = s.replace(
  '<ProgramCard title="Child Support & Welfare" tag="Children" desc="School support and essential needs linked to household resilience." />',
  '<ProgramCard title="Child Support & Welfare" tag="Children" desc="School support and essential needs linked to household resilience." imageSrc="/images/children.jpg" />'
);

fs.writeFileSync(file, s, "utf8");
console.log("✅ Updated app/page.tsx with hero + program images");
