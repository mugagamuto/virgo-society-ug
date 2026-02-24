import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { posts } from "@/content/blog/posts";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <>
      <PageHero eyebrow={"Blog - " + post.category} title={post.title} subtitle={post.excerpt} />

      <Container className="py-12 md:py-16">
        <article className="prose max-w-none">
          <div className="text-sm text-mutedInk">
            Published: {new Date(post.date).toLocaleDateString()}
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-black/[0.02] p-7">
            <h2 className="text-xl font-semibold tracking-tight">Sample article content</h2>
            <p className="mt-3 text-sm text-mutedInk">
              Replace this with real stories, training notes, or donor updates. You can later connect this to a CMS
              (Sanity, Contentful) or Markdown/MDX.
            </p>

            <ul className="mt-4 list-disc pl-5 text-sm text-mutedInk space-y-2">
              <li>What problem we are solving</li>
              <li>What we did (training, mentoring, loans, follow-ups)</li>
              <li>What changed (results, lessons learned)</li>
              <li>How donors/partners can help</li>
            </ul>
          </div>
        </article>
      </Container>
    </>
  );
}
