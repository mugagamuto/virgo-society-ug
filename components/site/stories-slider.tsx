import { Container } from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stories = [
  {
    tag: "Women group",
    title: "From savings group to stable income",
    body: "After training and mentorship, the group improved record keeping and grew weekly savings—unlocking low-interest capital for inventory.",
    meta: "Kampala • 2025",
  },
  {
    tag: "Youth",
    title: "A small startup that learned cashflow discipline",
    body: "A youth-led business adopted budgeting and basic bookkeeping. With a small loan, they expanded and maintained repayment consistency.",
    meta: "Wakiso • 2025",
  },
  {
    tag: "Children",
    title: "Keeping children in school",
    body: "Targeted support for learning needs and school essentials helped children stay in class while families stabilized their income.",
    meta: "Mukono • 2025",
  },
];

export function StoriesSlider() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <Badge>Stories</Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              Real people. Real progress.
            </h2>
            <p className="mt-2 text-sm md:text-base text-mutedInk max-w-2xl">
              A few short stories to show how training + mentorship + affordable loans change outcomes.
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-x-auto">
          <div className="flex gap-4 snap-x snap-mandatory pb-2">
            {stories.map((s) => (
              <Card
                key={s.title}
                className="min-w-[85%] sm:min-w-[420px] snap-start border-black/10"
              >
                <CardContent className="p-6">
                  <div className="text-xs text-mutedInk">{s.tag}</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">{s.title}</div>
                  <p className="mt-3 text-sm text-mutedInk leading-relaxed">{s.body}</p>
                  <div className="mt-4 text-xs text-mutedInk">{s.meta}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
