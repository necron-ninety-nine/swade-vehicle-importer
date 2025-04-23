/**
 * Takes the raw statblock text and returns
 * a simple object with all SWADE vehicle fields.
 */
export function parseVehicleStatblock(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // 1) Name & class
  const titleMatch = lines[0].match(/^(.+?)\s*\((Class\s*.+)\)$/i);
  const name  = titleMatch?.[1] || lines[0];
  const vclass= titleMatch?.[2] || "";

  // 2) Description paragraph(s)
  let i = 1;
  const descLines = [];
  while (i < lines.length && !/^Size\s+Scale/i.test(lines[i])) {
    descLines.push(lines[i]);
    i++;
  }
  const description = descLines.join(" ");

  // 3) The “table” row
  const tableCols = lines[i].split(/\s{2,}/).map(c => c.trim());
  const [ size, scaleMod, wounds, toughnessRaw, handling, speed, crew, energy, modsRaw, costRaw ] = tableCols;

  // 4) post-table fields
  const rest = lines.slice(i+1).join("\n");
  const notesMatch = rest.match(/Notes:\s*(.+?)(?=Passengers:|Weapons:|$)/is);
  const notes = notesMatch ? notesMatch[1].trim() : "";

  const passengersMatch = rest.match(/Passengers:\s*([0-9]+)/i);
  const passengers = passengersMatch ? parseInt(passengersMatch[1]) : 0;

  // 5) weapons list
  const weapons = [];
  const wepLines = rest.split(/Weapons?:/i)[1]?.split(/•/).map(l=>l.trim()).filter(Boolean) || [];
  for (let w of wepLines) weapons.push(w);

  return {
    name,
    class: vclass,
    description,
    size: parseInt(size),
    scale: parseInt(scaleMod.replace(/[^\d]/g,"")),
    wounds: parseInt(wounds),
    toughness: parseInt(toughnessRaw),
    handling: handling === "-" ? null : parseInt(handling),
    speed: parseInt(speed),
    crew: parseInt(crew),
    energy: parseInt(energy),
    mods: modsRaw,
    cost: costRaw,
    notes,
    passengers,
    weapons
  };
}
