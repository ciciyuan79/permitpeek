import { NextRequest, NextResponse } from "next/server";
import { CITIES } from "@/lib/cities";
import { fetchPermits } from "@/lib/socrata";
import { analyzePermits } from "@/lib/analyze";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const citySlug = searchParams.get("city");
  const address = searchParams.get("address");

  if (!citySlug || !address) {
    return NextResponse.json(
      { error: "Missing city or address parameter" },
      { status: 400 }
    );
  }

  const city = CITIES[citySlug];
  if (!city) {
    return NextResponse.json(
      { error: "Unsupported city" },
      { status: 404 }
    );
  }

  try {
    const permits = await fetchPermits(city, address);
    const analysis = analyzePermits(permits);

    return NextResponse.json({
      city: city.name,
      address,
      permits,
      analysis,
    });
  } catch (error) {
    console.error("Permit fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch permit data" },
      { status: 500 }
    );
  }
}
