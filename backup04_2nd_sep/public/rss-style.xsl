<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            --bg-base: #081229;
            --bg-elevated: #0D1B3E;
            --accent-tech: #6958FF;
            --accent-signature: #FF8A3D;
            --text-primary: #F0F0F5;
            --text-secondary: #A0A8C0;
            --border-subtle: rgba(105, 88, 255, 0.2);
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-base);
            color: var(--text-primary);
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .header {
            background: var(--bg-elevated);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .header h1 {
            margin: 0 0 12px;
            font-size: 1.8rem;
            color: var(--text-primary);
          }
          .header p {
            margin: 0 0 20px;
            color: var(--text-secondary);
            font-size: 1rem;
          }
          .notice {
            background: rgba(105, 88, 255, 0.15);
            border-left: 4px solid var(--accent-tech);
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 0.9rem;
            color: var(--text-primary);
          }
          .notice code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
          }
          .feed-item {
            background: rgba(13, 27, 62, 0.6);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            transition: transform 0.2s, border-color 0.2s;
          }
          .feed-item:hover {
            transform: translateY(-2px);
            border-color: var(--accent-tech);
          }
          .feed-item h2 {
            margin: 0 0 8px;
            font-size: 1.25rem;
          }
          .feed-item h2 a {
            color: var(--text-primary);
            text-decoration: none;
          }
          .feed-item h2 a:hover {
            color: var(--accent-signature);
          }
          .date {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-bottom: 12px;
          }
          .desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p><xsl:value-of select="/rss/channel/description"/></p>
            <div class="notice">
              💡 <strong>RSS Feed Preview</strong> — Copy this URL (<code><xsl:value-of select="/rss/channel/atom:link/@href"/></code>) into your favorite RSS reader app (Feedly, Reeder, NetNewsWire, etc.) to subscribe.
            </div>
          </div>

          <div class="feed-list">
            <xsl:for-each select="/rss/channel/item">
              <div class="feed-item">
                <h2>
                  <a href="{link}" target="_blank">
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <div class="date"><xsl:value-of select="pubDate"/></div>
                <div class="desc"><xsl:value-of select="description"/></div>
              </div>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
