"use strict";

const { addError } = require("markdownlint-rule-helpers");

// Custom addWarning functie om gele waarschuwingen toe te voegen
function addWarning(onError, lineNumber, detail) {
  addError(
    onError,
    lineNumber,
    `\x1b[33m[WAARSCHUWING]\x1b[0m ${detail}`
  );
}

/** @type import("markdownlint").Rule */
const rules =
[
  {
    "names": ["DOMBLR-001", "First line heading check"],
    "description": "De eerste regel moet een Markdown heading 1 zijn",
    "information": new URL("https://minordevops.nl/week-6-onderzoek/opdracht-beschrijving.html"),
    "tags": ["headers"],
    "function": function rule(params, onError) {
      const firstLine = params.lines[0].trim();
      // Controleer of de eerste regel begint met een H1 (#)
      if (!firstLine.startsWith("# ")) {
        addError(onError, 1, "De eerste regel moet een Markdown heading 1 zijn: (dus '# Titel...')");
      }
    }
  },
  {
    names: ["DOMBLR-002", "max-word-count"],
    description: "Beperk het aantal woorden in een Markdown-document tot 1500 exclusief codeblokken",
    tags: ["length", "words"],
    function: function rule(params, onError) {
      let wordCount = 0;

      // Regex om woorden te vinden die geen markdown symbolen zijn.
      const wordRegex = /\b\w+(?:'\w+)?(?:-\w+)?\b/g;

      // Itereer door alle tokens.
      params.tokens.forEach(token => {
        // Negeer codeblokken en inline code
        if (token.type !== "fence" && token.type !== "code_block" && token.type !== "inline_code" && token.type !== "backtick") {
          // Splits de tekstinhoud van de token op woorden en tel ze
          const words = token.content.match(wordRegex);
          if (words) {
            wordCount += words.length;
          }
        }
      });
      // Controleer of het aantal woorden boven de limiet is
      const maxWordCount = 1500;
      if (wordCount > maxWordCount) {
        addError(
          onError,
          1,
          `Het document bevat ${wordCount} woorden, wat boven de limiet van ${maxWordCount} ligt.`
        );
      } else {
        // Simuleer een groene "check" in de console
        console.log(`\x1b[32m✔ Aantal woorden (${wordCount}) is onder de limiet van ${maxWordCount}.\x1b[0m`);
      }
    }
  },
  {
    names: ["DOMBLR-003", "Blockquotes van meer dan een regel"],
    description: "Een quote moet aanhalingstekens bevatten, op een enkele regel staan en een APA-stijl bronvermelding bevatten.",
    information: new URL("https://minordevops.nl/week-6-onderzoek/opdracht-beschrijving.html"),
    tags: ["blockquote", "APA", "citation"],
    parser: "markdownit",
    function: function rule(params, onError) {
      params.parsers.markdownit.tokens
        .filter(token => token.type === "blockquote_open")
        .forEach(blockquote => {
          // Bereken het aantal regels dat de blockquote beslaat
          const lines = blockquote.map[1] - blockquote.map[0];

          // Alleen doorgaan met controle als de blockquote maar één regel beslaat
          if (lines === 1) {
            // Zoek naar de bijbehorende inhoud van de blockquote
            const contentToken = params.parsers.markdownit.tokens.find(
              (t, index) => params.parsers.markdownit.tokens[index - 1] === blockquote && t.type === "inline"
            );

            // Controleer of de blockquote inhoud heeft
            if (contentToken) {
              const content = contentToken.content.trim();

              // Controleer op aanhalingstekens en APA-stijl referentie aan het einde
              const hasQuotes = content.startsWith('"') && content.endsWith('"');
              const hasAPAReference = / \(([^)]+),\s*(\d{4}|z\.d\.)\)$/.test(content);

              if (!hasQuotes || !hasAPAReference) {
                // Samenstellen van de foutmelding
                const detailMessage = !hasQuotes
                  ? "De blockquote moet tussen dubbele aanhalingstekens staan."
                  : "De blockquote moet eindigen met een APA-bronvermelding in het formaat (Auteur, jaartal) of (Auteur, z.d.).";

                addError(onError, blockquote.lineNumber, detailMessage);
              }
            }
          } else {
            // Foutmelding als de blockquote over meerdere regels verspreid is
            addError(
              onError,
              blockquote.lineNumber,
              "De blockquote moet op één regel staan en aanhalingstekens en een APA-bronvermelding bevatten."
            );
          }
        });
    }
  },
  {
    names: ["DOMBLR-004", "Illustratie-check"],
    description: "Controleer op voldoende illustraties en correcte alt-tekst in het verplichte startplaatje.",
    information: new URL("https://minordevops.nl/week-6-onderzoek/opdracht-beschrijving.html"),
    tags: ["images", "illustraties"],
    function: function rule(params, onError) {
      let imgCount = 0;
      let hasStartImage = false;
      
      // Regex om de verplichte alt-tekst te controleren
      const defaultAltText = "mdbook logo om weg te halen";

      params.tokens.forEach(token => {
        if (token.type === "html_inline" && token.content.includes("<img")) {
          imgCount++;

          // Controleer op verplichte startplaatje na <hr>
          if (!hasStartImage && token.lineNumber > 1) {
            hasStartImage = true;
            const altMatch = token.content.match(/alt="([^"]*)"/);
            if (altMatch && altMatch[1] !== defaultAltText) {
            } else {
              addError(
                onError,
                token.lineNumber,
                `De verplichte startplaatje moet een aangepaste alt-tekst hebben, niet '${defaultAltText}'.`
              );
            }
          }
        }
      });

      // Controle op aanwezigheid van verplichte startplaatje
      if (!hasStartImage) {
        addError(
          onError,
          1,
          "Verplichte startplaatje onder de <hr> ontbreekt."
        );
      }

      // Controle op minimaal één extra plaatje naast het startplaatje
      if (imgCount < 2) {
        addError(
          onError,
          1,
          "Document moet minimaal één extra illustratie bevatten naast het verplichte startplaatje."
        );
      }

      // Waarschuwing als er minder dan 4 plaatjes zijn
      if (imgCount < 4) {
        addWarning(
          onError,
          1,
          `Waarschuwing: Het document bevat slechts ${imgCount} illustraties. Minimaal 4 illustraties worden aanbevolen.`
        );
      }
    }
  },
  {
    names: ["DOMBLR-005", "HR-tag na studentnaam"],
    description: "Controleer of er een <hr> aanwezig is direct onder de studentnaam.",
    tags: ["structure", "hr"],
    function: function rule(params, onError) {
      let hasHr = false;

      params.tokens.forEach(token => {
        if (token.type === "hr") {
          hasHr = true;
        }
      });

      if (!hasHr) {
        addError(
          onError,
          params.tokens[0].lineNumber,
          "Het verplichte <hr> ontbreekt direct onder de studentnaam."
        );
      }
    }
  },
  {
    names: ["DOMBLR-006", "Verplicht startplaatje aanwezig"],
    description: "Controleer of het verplichte startplaatje aanwezig is direct onder de <hr>.",
    tags: ["images", "required"],
    function: function rule(params, onError) {
      let hasStartImage = false;

      params.tokens.forEach(token => {
        if (token.type === "html_inline" && token.content.includes("<img") && token.lineNumber > 1) {
          hasStartImage = true;
        }
      });

      if (!hasStartImage) {
        addError(
          onError,
          params.tokens[0].lineNumber,
          "Het verplichte startplaatje ontbreekt onder de <hr>."
        );
      }
    }
  },
  {
    names: ["DOMBLR-007", "Alt- en title-tekst controle voor startplaatje"],
    description: "Controleer of het verplichte startplaatje een aangepaste alt- en title-tekst heeft.",
    tags: ["images", "attributes"],
    function: function rule(params, onError) {
      const defaultAltText = "mdbook logo om weg te halen";
      const defaultTitleText = "maar vergeet de alt tekst niet";
      let hasStartImageWithCustomText = false;

      params.tokens.forEach(token => {
        if (token.type === "html_inline" && token.content.includes("<img")) {
          const altMatch = token.content.match(/alt="([^"]*)"/);
          const titleMatch = token.content.match(/title="([^"]*)"/);
          if (
            altMatch && titleMatch &&
            altMatch[1] !== defaultAltText &&
            titleMatch[1] !== defaultTitleText
          ) {
            hasStartImageWithCustomText = true;
          }
        }
      });

      if (!hasStartImageWithCustomText) {
        addError(
          onError,
          params.tokens[0].lineNumber,
          "Het verplichte startplaatje moet een aangepaste alt- en title-tekst bevatten."
        );
      }
    }
  },
  {
    names: ["DOMBLR-008", "Minimaal twee afbeeldingen"],
    description: "Controleer of het document minimaal twee afbeeldingen bevat.",
    tags: ["images", "minimum"],
    function: function rule(params, onError) {
      let imgCount = 0;

      params.tokens.forEach(token => {
        if (token.type === "html_inline" && token.content.includes("<img")) {
          imgCount++;
        }
      });

      if (imgCount < 2) {
        addError(
          onError,
          params.tokens[0].lineNumber,
          "Het document moet minimaal twee afbeeldingen bevatten, inclusief het verplichte startplaatje."
        );
      }
    }
  },
  {
    names: ["DOMBLR-009", "Aanbevolen aantal afbeeldingen"],
    description: "Geef een waarschuwing als het document minder dan vier afbeeldingen bevat.",
    tags: ["images", "recommendation"],
    function: function rule(params, onError) {
      let imgCount = 0;

      params.tokens.forEach(token => {
        if (token.type === "html_inline" && token.content.includes("<img")) {
          imgCount++;
        }
      });

      if (imgCount < 4) {
        addWarning(
          onError,
          params.tokens[0].lineNumber,
          `Het document bevat slechts ${imgCount} afbeeldingen. Minimaal 4 afbeeldingen worden aanbevolen.`
        );
      }
    }
  }
]

// URL-basis voor alle regels
const baseUrl = "https://minordevops.nl/week-6-onderzoek/opdracht-beschrijving.html#";

// Voeg de dynamische URL toe aan elke regel
rules.forEach(rule => {
  rule.information = new URL(`${baseUrl}${rule.names[0]}`);
});

module.exports = rules;