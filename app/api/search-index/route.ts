import { NextResponse } from "next/server";
import { getAllListingsForIndex } from "@/lib/data";

export async function GET() {
  const listings = await getAllListingsForIndex();
  return NextResponse.json(listings);
}
