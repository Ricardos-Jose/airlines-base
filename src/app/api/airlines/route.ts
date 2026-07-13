import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name");
  const iata = searchParams.get("iata");
  const icao = searchParams.get("icao");

  try {
    const response = await axios.get(
      "https://airlines-api.omkar.cloud/airlines",
      {
        params: {
          name,
          iata,
          icao,
        },
        headers: {
          "API-Key": process.env.AIRLINES_API_KEY!,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(error.response?.data);

    return NextResponse.json(
      {
        error: error.response?.data || "Erro interno",
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}