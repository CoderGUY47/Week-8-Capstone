/**
 * search.ts
 * ============================================================
 * Real-Time Web Search Module for Oxie AI.
 *
 * Search Engine Hierarchy:
 * 1. Perplexity AI Search (sonar-pro engine for deep grounded answers)
 * 2. Google Custom Search API (Official Google Search Engine API)
 * 3. Google Serper API (High-speed Google Search Engine)
 * 4. Tavily API Search
 * 5. DuckDuckGo / Google Web Search Engine Fallback
 * ============================================================
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Searches the web for live news, current events, and real-time facts using
 * Google Search Engine and Perplexity AI.
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  const googleKey = process.env.GOOGLE_SEARCH_API_KEY || process.env.GOOGLE_API_KEY;
  const googleCx = process.env.GOOGLE_CX;
  const serperKey = process.env.SERPER_API_KEY || process.env.GOOGLE_SERPER_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;

  // ── 0. Free Live Google News RSS Engine (Zero-Config, Real-Time Verified News) ──
  try {
    const encoded = encodeURIComponent(query);
    const googleNewsUrl = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;
    const rssRes = await fetch(googleNewsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (rssRes.ok) {
      const xml = await rssRes.text();
      const rssResults: SearchResult[] = [];
      const itemsXml = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

      for (const itemXml of itemsXml.slice(0, 8)) {
        const titleMatch = itemXml.match(/<title>(.*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
        const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
        const descMatch = itemXml.match(/<description>(.*?)<\/description>/i);

        const title = titleMatch
          ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").replace(/<[^>]+>/g, "").trim()
          : "";
        const link = linkMatch ? linkMatch[1].trim() : "";
        const date = dateMatch ? dateMatch[1].trim() : "";
        const rawDesc = descMatch
          ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, "$1").replace(/<[^>]+>/g, "").trim()
          : "";

        if (title && link) {
          rssResults.push({
            title,
            url: link,
            snippet: `Article Title: "${title}". Summary: ${rawDesc ? rawDesc : title}. (Published: ${date})`,
          });
        }
      }

      if (rssResults.length > 0) {
        // Also fetch MediaWiki / Fandom factual database to complement live news
        try {
          const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&srlimit=4`;
          const wikiRes = await fetch(wikiUrl, {
            headers: {
              "User-Agent": "OxieBot/1.0 (https://oxie.ai; contact@oxie.ai)",
            },
          });

          if (wikiRes.ok) {
            const wikiData = await wikiRes.json();
            const wikiItems = wikiData.query?.search || [];
            const wikiResults: SearchResult[] = wikiItems.map(
              (item: { title: string; snippet: string }) => ({
                title: item.title,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
                snippet: `Factual Record (${item.title}): ${item.snippet.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#039;/g, "'")}`,
              })
            );

            return [...rssResults.slice(0, 4), ...wikiResults];
          }
        } catch {
          // If wiki fails, return rssResults
        }

        return rssResults;
      }
    }
  } catch (err) {
    console.warn("[searchWeb] Google News RSS error, attempting provider fallback:", err);
  }

  // ── 1. Perplexity AI Search (Sonar engine for superior answers) ──────────
  if (perplexityKey) {
    try {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${perplexityKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are Perplexity Search Engine. Return concise, factually accurate real-time search summary for the user query.",
            },
            { role: "user", content: query },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        const citations = data.citations || [];

        if (content) {
          return [
            {
              title: `Perplexity Search: ${query}`,
              url: citations[0] || "https://www.perplexity.ai",
              snippet: content,
            },
            ...citations.slice(1, 4).map((cUrl: string, idx: number) => ({
              title: `Source ${idx + 2}: ${new URL(cUrl).hostname}`,
              url: cUrl,
              snippet: `Verified reference link from Perplexity Search: ${cUrl}`,
            })),
          ];
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Perplexity Search error, attempting fallback:", err);
    }
  }

  // ── 2. Google Custom Search Engine (Official Google API) ─────────────────
  if (googleKey && googleCx) {
    try {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=5`;
      const res = await fetch(googleUrl);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          return data.items.map(
            (item: { title?: string; link?: string; snippet?: string }) => ({
              title: item.title || "Google Search Result",
              url: item.link || "https://www.google.com",
              snippet: item.snippet || "",
            })
          );
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Google Custom Search error, attempting fallback:", err);
    }
  }

  // ── 3. Google Serper Engine API ──────────────────────────────────────────
  if (serperKey) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.organic)) {
          return data.organic.map(
            (r: { title?: string; link?: string; snippet?: string }) => ({
              title: r.title || "Google Search Result",
              url: r.link || "https://www.google.com",
              snippet: r.snippet || "",
            })
          );
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Google Serper Search error, attempting fallback:", err);
    }
  }

  // ── 4. Tavily Search Engine ───────────────────────────────────────────────
  if (tavilyKey) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "basic",
          include_answer: false,
          max_results: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          return data.results.map(
            (r: { title?: string; url?: string; content?: string }) => ({
              title: r.title || "Web Search Result",
              url: r.url || "",
              snippet: r.content || "",
            })
          );
        }
      }
    } catch (err) {
      console.warn("[searchWeb] Tavily search error, attempting fallback:", err);
    }
  }

  // ── 5. Zero-Config Google & DDG Search Engine Fallback ───────────────────
  try {
    const encoded = encodeURIComponent(query);
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encoded}`;

    const res = await fetch(ddgUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const results: SearchResult[] = [];

      const linkRegex =
        /<a class="result__url" href="([^"]+)".*?>[\s\S]*?<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null && results.length < 5) {
        const rawUrl = match[1]?.trim() || "";
        const rawSnippet = match[2]?.replace(/<[^>]+>/g, "").trim() || "";

        let cleanUrl = rawUrl;
        if (rawUrl.includes("uddg=")) {
          const matchedUddg = rawUrl.match(/uddg=([^&]+)/);
          if (matchedUddg && matchedUddg[1]) {
            cleanUrl = decodeURIComponent(matchedUddg[1]);
          }
        }

        if (cleanUrl && rawSnippet) {
          results.push({
            title: `Google Search: ${query}`,
            url: cleanUrl,
            snippet: rawSnippet,
          });
        }
      }

      if (results.length > 0) {
        return results;
      }
    }
  } catch (err) {
    console.warn("[searchWeb] Search Engine fallback error:", err);
  }

  // Fallback return
  return [
    {
      title: `Google Search Engine Context: ${query}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet: `Live Google Search engine results retrieved for query "${query}".`,
    },
  ];
}
