"use client";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { useState, useEffect, useMemo } from "react";

type Airline = {
  ICAO: string;
  NAME: string;
};

function normalize(queries: string | null | undefined): string {
  if (!queries) return "";
  return queries
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function searchAirline(userQuery: string, airline: Airline): boolean {
  const query = normalize(userQuery);
  if (query === "") return true;
  return (
    normalize(airline?.NAME).includes(query) ||
    normalize(airline?.ICAO).includes(query)
  );
}


function dedupeByIcao(list: Airline[]): Airline[] {
  const seen = new Set<string>();
  return list.filter((a) => {
    if (!a.ICAO || seen.has(a.ICAO)) return false;
    seen.add(a.ICAO);
    return true;
  });
}

export const NewsletterIPhoneMockup01 = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [airlines, setAirlines] = useState<Airline[]>([]);

  useEffect(() => {
    fetch("/casa.json")
      .then((res) => res.json())
      .then((data: Airline[]) => setAirlines(dedupeByIcao(data)))
      .catch((err) => console.error("Erro ao carregar airlines:", err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const query = debouncedValue.trim();

  const results = useMemo(() => {
    if (query === "") return []; 
    return airlines.filter((airlines) => searchAirline(query, airlines));
  }, [query, airlines]);

  return (
    <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4">
      <div className="relative w-full max-w-md">
        <Input
          isRequired
          size="lg"
          name="query"
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e)}
          placeholder="Buscar companhia aérea..."
        />

        {query !== "" && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-md border bg-white shadow-lg">
            {results.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                Nenhum resultado encontrado
              </li>
            ) : (
              results.map((airlines, item) => (
                <li key={`${airlines.ICAO}-${item}`} className="px-3 py-2 hover:bg-gray-100">
                  {airlines.NAME} | ICAO: {airlines.ICAO}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </section>
  );
};