import { CityConfig } from "./cities";

export interface Permit {
  id: string;
  type: string;
  date: string;
  status: string;
  value: string;
  description: string;
  address: string;
}

export async function fetchPermits(
  city: CityConfig,
  address: string
): Promise<Permit[]> {
  const {
    endpoint,
    addressField,
    streetField,
    typeField,
    dateField,
    statusField,
    valueField,
    descField,
  } = city;

  // Split address into number and street name
  const parts = address.trim().split(/\s+/);
  const houseNumber = parts[0];
  const streetName = parts.slice(1).join(" ").toUpperCase();

  // Escape single quotes for SoQL (they need to be doubled)
  const safeStreet = streetName.replace(/'/g, "''");
  const safeHouse = houseNumber.replace(/'/g, "''");
  const safeFull = address.toUpperCase().trim().replace(/'/g, "''");

  let where = "";
  if (streetField) {
    where = `upper(${streetField}) like '%${safeStreet}%' AND ${addressField}='${safeHouse}'`;
  } else {
    // For cities like Austin and Seattle where address is one field
    where = `upper(${addressField}) like '%${safeFull}%'`;
  }

  // Build URL with proper encoding
  const params = new URLSearchParams({
    $where: where,
    $limit: "50",
    $order: `${dateField} DESC`,
  });

  const url = `${endpoint}?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // 1 hour cache
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch permits: ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((item: Record<string, string>, index: number) => ({
    id: item.id || `permit-${index}`,
    type: item[typeField] || "Unknown",
    date: item[dateField] || "",
    status: item[statusField] || "Unknown",
    value: item[valueField] || "0",
    description: item[descField] || "No description provided",
    address: streetField 
      ? `${item[addressField]} ${item[streetField]}` 
      : item[addressField],
  }));
}
