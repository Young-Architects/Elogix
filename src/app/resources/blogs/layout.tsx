/**
 * Layout for all /resources/blogs routes.
 *
 * The site body is dark (#050816, see globals.css) while the blog is designed
 * light for long-form reading, so this layout paints a white canvas behind
 * every blog page (listing, post, loading, not-found) and pushes content
 * below the fixed pill Navbar.
 */

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white pt-14">{children}</div>;
}
