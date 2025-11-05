import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    if (!query)
      return NextResponse.json({ items: [] });

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ items: [], error: "Missing YOUTUBE_API_KEY" }, { status: 500 });
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
      query
    )}&key=${YOUTUBE_API_KEY}`;

    const r = await fetch(apiUrl);
    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json(
        { items: [], error: `YouTube API error: ${r.status}`, details: txt },
        { status: 502 }
      );
    }

    const json = await r.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (json.items || []).map((it: any) => ({
      id: it.id.videoId,
      title: it.snippet.title,
      thumbnail: it.snippet.thumbnails?.medium?.url || "",
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error("youtube api route error", err);
    return NextResponse.json({ items: [], error: "Server error" }, { status: 500 });
  }
}
