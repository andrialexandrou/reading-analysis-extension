// @ts-nocheck

// export default function () {
//   return 5;
// }

import { syllable } from "syllable";
import Tokenizer from "sentence-tokenizer";

export default function (text: string, full: string) {
  const tokenizer = new Tokenizer("Efpalinou");
  tokenizer.setEntry(text);

  const tokenSentences = tokenizer.getSentences();

  const tracker = {
    syllables: 0,
    words: 0,
  };

  const counts = tokenSentences.reduce(
    (obj: { syllables: string; words: string }, sentence: string) => {
      // strip all punctuation and numbers from the sentence
      const words = sentence
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .replace(/[0-9]/g, "")
        .split(" ")
        .filter((letter) => letter);

      obj.syllables += words.reduce(
        (total, word) => (total += syllable(word)),
        0
      );
      obj.words += words.length;

      return obj;
    },
    tracker
  );

  const { words, syllables } = counts;
  const sentences = tokenSentences.length;
  const unrounded =
    0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  const rounded = Math.round(isNaN(unrounded) ? NaN : unrounded);

  const result: {
    sentences: number;
    words: number;
    syllables: number;
    unrounded: number;
    rounded: number;
    error?: string;
  } = {
    sentences,
    words,
    syllables,
    unrounded,
    rounded,
  };

  const err = "Either no sentences or words, please enter valid text";
  const nan = isNaN(result.rounded);

  if (nan) {
    result.error = err;
  }

  if (full == "full") {
    return result;
  }

  if (nan) {
    return err;
  }

  return result.rounded;
}
