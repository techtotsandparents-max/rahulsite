import { NextResponse } from 'next/server';
import { blogFixtures } from '@/lib/fixtures';

export async function GET() {
  const baseUrl = 'https://rahul.tripathis.com';

  const itemsXml = blogFixtures
    .map((post) => {
      const postUrl = post.externalUrl || `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <dc:creator><![CDATA[Rahul Tripathi]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss-style.xsl"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[ Rahul Tripathi's Blog ]]></title>
    <description><![CDATA[ Cloud Architecture, AI Lessons, Travel Stories, and Software Engineering. ]]></description>
    <link>${baseUrl}</link>
    <generator>RahulTripathi.dev Engine</generator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
