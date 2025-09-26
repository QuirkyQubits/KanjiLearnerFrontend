import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HighlightedText } from "./HighlightedText";
import { entryTypeColors, readingColor } from "../models/EntryTypeColors";
import { EntryType } from "../models/EntryType";

describe("HighlightedText", () => {
  it("renders plain text without tags", () => {
    render(<HighlightedText text="hello world" />);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("wraps radical text with radical highlight class", () => {
    render(<HighlightedText text="The <radical>sprout</radical> grows" />);
    expect(screen.getByText("sprout")).toHaveClass(entryTypeColors[EntryType.RADICAL]);
  });

  it("wraps kanji text with kanji highlight class", () => {
    render(<HighlightedText text="A <kanji>tree</kanji> in the forest" />);
    expect(screen.getByText("tree")).toHaveClass(entryTypeColors[EntryType.KANJI]);
  });

  it("wraps vocab text with vocab highlight class", () => {
    render(<HighlightedText text="Learning <vocab>forest</vocab> is useful" />);
    expect(screen.getByText("forest")).toHaveClass(entryTypeColors[EntryType.VOCAB]);
  });

  it("wraps reading text with reading highlight class", () => {
    render(<HighlightedText text="Its <reading>reading</reading> matters" />);
    const highlighted = screen.getByText("reading");
    readingColor.split(" ").forEach((cls) => {
      expect(highlighted).toHaveClass(cls);
    });
  });

  it("handles multiple highlights in one string", () => {
    render(<HighlightedText text="A <radical>sprout</radical> and a <kanji>tree</kanji>" />);
    expect(screen.getByText("sprout")).toHaveClass(entryTypeColors[EntryType.RADICAL]);
    expect(screen.getByText("tree")).toHaveClass(entryTypeColors[EntryType.KANJI]);
  });

  it("renders gracefully if there are mismatched tags", () => {
    render(<HighlightedText text="<radical>sprout</kanji>" />);
    expect(screen.getByText("sprout")).toBeInTheDocument();
  });
});
