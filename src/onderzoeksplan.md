# Onderzoeksplan

Lees en volg de [workshop-prompt-engineering](https://minordevops.nl/week-5-slack-ops/workshop-onderzoeksplan-prompt-engineering.html).

Verzin o.a. een titel voor je blog, pas de folder naam hier op aan en gebruik [kebab-case](https://en.toolpage.org/tool/kebabcase).

Kijk of je basis Dev vaardigheden ook wel overeind houdt; zoals een 'test-driven' aanpak; of tenminste 'self testing code' ([Fowler, 2014](https://martinfowler.com/bliki/SelfTestingCode.html)):

<kroki type="graphviz">
digraph G {
   rankdir=LR;  // This sets the direction from left to right
   subgraph cluster_SelfTesting {
     label = "Self-Testing System";
     A [label="Test code"];
     B [label="Application code"];
     A -> B;
   }
}
</kroki>

## Bronnen

- Fowler, M. (1 mei 2014) *Self Testing Code* martinfowler.com Geraadpleegd september 2024 op <https://martinfowler.com/bliki/SelfTestingCode.html>
