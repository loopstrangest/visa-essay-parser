const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
};

const highlightTerm = (text, term) => {
  const exactPhrase = term.startsWith('"') && term.endsWith('"');
  const escapedTerm = escapeRegExp(term.replace(/"/g, ""));
  const regex = exactPhrase
    ? new RegExp(`(^|\\W)(${escapedTerm})(\\W|$)`, "gi")
    : new RegExp(`\\b(${escapedTerm})\\b`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
};

const parseSearchTerm = (searchTerm) => {
  const cleanedSearchTerm = searchTerm.trim();

  if (!cleanedSearchTerm) {
    return { terms: [], operator: null };
  }

  const operatorRegex =
    /\(?\s*(?<terms>(?:\w+\s*)+|(?:"[^"]+"))\s+(?<operator>and|or)\s+(?<lastTerm>(?:\w+\s*)+|(?:"[^"]+"))\s*\)?/i;
  const matches = cleanedSearchTerm.match(operatorRegex);
  let terms = [];
  let operator = "and";
  let exactPhrase = false;

  if (matches) {
    operator = matches.groups.operator.toLowerCase();
    terms = [
      matches.groups.terms.trim(),
      matches.groups.lastTerm && matches.groups.lastTerm.trim(),
    ].filter(Boolean);
  } else {
    const regexWords = /"[^"]+"|\b\w+\b/g;
    terms = cleanedSearchTerm.match(regexWords) || [];

    if (terms.length === 2 && ["and", "or"].includes(terms[0].toLowerCase())) {
      operator = terms.shift().toLowerCase();
    }
  }

  exactPhrase = terms.some(
    (term) => term.startsWith('"') && term.endsWith('"')
  );
  terms = terms.map((term) =>
    term.startsWith('"') && term.endsWith('"') ? term.replace(/"/g, "") : term
  );

  console.log("searchTerm:", searchTerm);
  console.log("cleanedSearchTerm:", cleanedSearchTerm);
  console.log("matches:", matches);
  console.log("terms:", terms);
  console.log("operator:", operator);
  console.log("exactPhrase:", exactPhrase);

  return { terms, operator, exactPhrase };
};

const findWholeWord = (str, term, exactPhrase = false) => {
  const escapedTerm = escapeRegExp(term);
  const regex = exactPhrase
    ? new RegExp(`(^|\\W)${escapedTerm}(\\W|$)`, "gi")
    : new RegExp(`\\b${escapedTerm}\\b`, "gi");
  const match = regex.exec(str);
  return match ? match.index : -1;
};

const getTermIndices = (
  terms,
  lowerCaseEssayText,
  lowerCaseTitle,
  exactPhrase
) => {
  return terms.map((term) =>
    term
      ? [lowerCaseEssayText, lowerCaseTitle].map((str) =>
          findWholeWord(str, term, exactPhrase)
        )
      : [-1, -1]
  );
};

const checkCondition = (condition, termIndices) =>
  termIndices.some((indices) => indices.some(condition));

const isMatch = (operator, termIndices) => {
  if (operator === "and") {
    return termIndices.every((indices) =>
      indices.some((index) => index !== -1)
    );
  } else if (operator === "or") {
    return termIndices.some((indices) => indices.some((index) => index !== -1));
  } else {
    return checkCondition((index) => index !== -1, termIndices);
  }
};

const getExcerpt = (
  operator,
  essay,
  searchTermIndexInText,
  searchTerm,
  terms
) => {
  let excerpt;

  // Find the first term that appears in the essay
  const firstTermIndex = terms
    .map((term) =>
      findWholeWord(essay.essayText.toLowerCase(), term.toLowerCase())
    )
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0];

  const startIndex = firstTermIndex;

  const excerptStart = Math.max(
    0,
    essay.essayText.lastIndexOf(" ", startIndex - 75)
  );

  const remainingText = essay.essayText.length - startIndex;
  const endIndex =
    remainingText > 75
      ? startIndex + terms[0].length + 75
      : essay.essayText.length;

  const excerptEnd = Math.max(
    endIndex,
    essay.essayText.lastIndexOf(" ", endIndex)
  );

  excerpt = essay.essayText.substring(excerptStart, excerptEnd);

  terms.forEach((term) => {
    excerpt = highlightTerm(excerpt, term);
  });

  return excerpt;
};

export const searchVisaEssays = (searchTerm, essayData) => {
  const { terms, operator, exactPhrase } = parseSearchTerm(searchTerm);

  if (terms.length === 0) {
    return [];
  }

  const searchResults = Object.values(essayData)
    .map((essay) => {
      const lowerCaseEssayText = essay.essayText.toLowerCase();
      const lowerCaseTitle = essay.title.toLowerCase();

      const termIndices = getTermIndices(
        terms,
        lowerCaseEssayText,
        lowerCaseTitle,
        exactPhrase
      );

      if (isMatch(operator, termIndices)) {
        const searchTermIndexInText = termIndices
          .flat()
          .find((index) => index !== -1);

        const excerpt = getExcerpt(
          operator,
          essay,
          searchTermIndexInText,
          searchTerm,
          terms
        );

        let highlightedTitle = essay.title;
        terms.forEach((term) => {
          highlightedTitle = highlightTerm(highlightedTitle, term);
        });
        const firstFewWords = essay.essayText.split(" ").slice(0, 5).join(" ");
        const lastFewWords = essay.essayText.split(" ").slice(-5).join(" ");

        const removeHTMLTags = (text) => {
          return text.replace(/<[^>]+>/g, "");
        };

        const cleanText = (text) => {
          const withoutTags = removeHTMLTags(text);
          const withoutNewLines = withoutTags.replace(/\n/g, " ");
          const trimmed = withoutNewLines.trim();
          return trimmed;
        };

        const shouldShowBeginningEllipsis =
          !cleanText(excerpt.toLowerCase()).startsWith(
            cleanText(firstFewWords.toLowerCase())
          ) && operator !== "not";

        const shouldShowEndingEllipsis =
          !cleanText(lastFewWords.toLowerCase()).endsWith(
            cleanText(excerpt.toLowerCase()).slice(-lastFewWords.length)
          ) && operator !== "not";

        return {
          ...essay,
          title: highlightedTitle,
          excerpt:
            (shouldShowBeginningEllipsis ? "..." : "") +
            (shouldShowBeginningEllipsis
              ? excerpt.substring(1, excerpt.length)
              : excerpt) +
            (shouldShowEndingEllipsis ? "..." : ""),
        };
      }
      return null;
    })
    .filter((result) => result !== null);

  console.log(searchResults);
  return searchResults;
};
