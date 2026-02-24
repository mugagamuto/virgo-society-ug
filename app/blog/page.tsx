import Link from "next/link";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/content/blog/posts";

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Updates, stories, and practical tips."
        subtitle="Share progress with donors and give members practical learning content. These posts are sample data stored in content/blog/posts.ts."
      />

      <Container className="py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}>
              <Card className="hover:shadow-soft transition">
                <CardContent className="p-7">
                  <Badge>{p.category}</Badge>
                  <CardTitle className="mt-3">{p.title}</CardTitle>
                  <CardDescription className="mt-2">{p.excerpt}</CardDescription>
                  <div className="mt-4 text-xs text-mutedInk">{new Date(p.date).toLocaleDateString()}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}


