import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const { imageBase64, mimeType, brand, category, condition } = await req.json();

    if (!imageBase64 || !brand) {
      return Response.json({ error: "Missing image or brand" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are a top-rated UK Vinted reseller with 5+ years of experience. You know exactly what items actually SELL for on Vinted (not what people list them at).

ITEM TO PRICE:
- Brand: "${brand}"
- Category: ${category}
- Condition: ${condition}

CRITICAL PRICING RULES — Vinted prices are LOWER than people expect:

1. **Vinted sold prices are typically 25-40% of retail** for most clothing brands, sometimes lower. A £100 Zara coat sells for £20-30, not £50.

2. **Buyers on Vinted are bargain hunters.** Most listings sit unsold for weeks at "fair" prices. Items priced realistically sell within days.

3. **Brand tier dictates pricing floor:**
   - Fast fashion (H&M, Primark, Shein, F21): £3-12 typical, even new
   - High street (Zara, Uniqlo, Topshop, ASOS): £6-20 typical
   - Mid-tier (Nike, Adidas, Levi's, Carhartt, North Face): £12-40 typical
   - Premium (Stone Island, Arc'teryx, Patagonia): £30-100+
   - Designer (Gucci, Prada, Burberry): £50-300+ depending on item
   - Trendy/hyped (Jordan, Supreme, Yeezy, Jacquemus): can be £40-200 if desirable
   - Vintage/Y2K (genuine retro pieces): often more than expected, £20-80

4. **Condition multipliers from "Like new" baseline:**
   - New with tags: ×1.3
   - Like new: ×1.0
   - Good: ×0.7
   - Fair: ×0.5
   - Poor: ×0.3

5. **Category adjustments:**
   - Shoes/trainers: hold value better, especially branded
   - Bags: hold value if leather/designer, drop hard if fabric/fast fashion
   - Outerwear/jackets: hold value reasonably
   - Basic tees, fast fashion dresses: drop value hard
   - Kids clothes: very low (£2-8 typical) unless designer
   - Accessories: highly variable

6. **Suggest a price that will SELL, not the highest possible.** Aim for the price someone will actually buy at within 1-2 weeks. Better £15 sold than £25 unsold.

7. **Price range: priceMin = quick-sale price, suggestedPrice = realistic 1-2 week sale, priceMax = patient seller / pristine condition / premium buyer.** Range should be relatively tight, not wildly wide.

Now analyse this photo carefully. Look at the actual item — its quality, age, hype level, desirability, any visible flaws.

Respond with ONLY a raw JSON object — no markdown fences, no explanation, just valid JSON:
{"itemName":"short descriptive name e.g. Nike Air Jordan Windbreaker Beige","suggestedPrice":15,"priceMin":10,"priceMax":25,"title":"compelling Vinted title under 60 chars (use keywords buyers search for)","description":"3-4 paragraph Vinted description with line breaks. Lead with item type and standout features. Mention condition honestly. Include style tips or outfit ideas. Friendly, appealing tone. End with shipping/bundling note.","tags":["tag1","tag2","tag3","tag4","tag5","tag6"],"colour":"main colour","material":"likely material","style":"e.g. Streetwear, Y2K, Minimalist"}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType, data: imageBase64 },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) {
      return Response.json({ error: "Empty response from Claude" }, { status: 500 });
    }

    const cleaned = textBlock.text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json(
        { error: "Could not parse response as JSON", raw: cleaned.slice(0, 300) },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
