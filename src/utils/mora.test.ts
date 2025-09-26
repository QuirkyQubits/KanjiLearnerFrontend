import { describe, it, expect } from "vitest";
import { splitIntoMora } from "./mora";

describe("splitIntoMora", () => {
  it("splits simple kana", () => {
    expect(splitIntoMora("かな")).toEqual(["か", "な"]);
  });

  it("groups small kana", () => {
    expect(splitIntoMora("きゃ")).toEqual(["きゃ"]);
    expect(splitIntoMora("しゃ")).toEqual(["しゃ"]);
  });

  it("handles sokuon っ as separate mora", () => {
    expect(splitIntoMora("かった")).toEqual(["か", "っ", "た"]);
  });

  it("handles long vowel mark ー", () => {
    expect(splitIntoMora("カー")).toEqual(["カー"]);
    expect(splitIntoMora("おーい")).toEqual(["おー", "い"]);
  });

  it("handles combos with small kana + long mark", () => {
    expect(splitIntoMora("きゅー")).toEqual(["きゅー"]);
  });

  it("handles katakana small kana too", () => {
    expect(splitIntoMora("ファミリー")).toEqual(["ファ", "ミ", "リー"]);
  });
});
