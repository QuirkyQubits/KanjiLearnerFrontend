export function splitIntoMora(reading: string): string[] {
  const smallKana = "ゃゅょぁぃぅぇぉャュョァィゥェォヮヵヶ";
  const morae: string[] = [];
  const chars = [...reading];

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];

    // handle small kana with preceding base
    if (i > 0 && smallKana.includes(c)) {
      morae[morae.length - 1] += c;
      continue;
    }

    // sokuon っ counts as its own mora
    if (c === "っ" || c === "ッ") {
      morae.push(c);
      continue;
    }

    // long vowel mark ー: attach to previous mora
    if (c === "ー" && morae.length > 0) {
      morae[morae.length - 1] += c;
      continue;
    }

    // default: new mora
    morae.push(c);
  }

  return morae;
}
