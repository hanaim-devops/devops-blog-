[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/KIFSD5kr)

# Devops blog

Schrijf je devops blog in het bestand `src/dev-blog-name-in-kebab-case/README.md`. Schrijf je onderzoeksplan in `src/onderzoeksplan.md`

Installeer mdlint en zorg dat je markdown voldoet aan de standaard regels en ook aan de custom regels voor de blog. Zie verder sectie ['custom lint regels'](#custom-lint-regels) onderaan hoe je de lint tests kunt uitvoeren.

Om te testen hoe je blog eruit ziet op de minordevops.nl website, en dus binnen [mdbook](https://rust-lang.github.io/mdBook/) zonder zelf mdbook te installeren kun je bijgevoegde `Dockerfile` gebruiken.

Zorg dus dat je Docker hebt geinstalleerd, bijvoorbeeld via [Docker Desktop voor Windows](https://docs.docker.com/desktop/install/windows-install/) of macOS. Voor het gemak is er ook een bash script `build`. Deze moet je wellicht eenmalig `chmod +x mdbook-build`. En run je daarna met:

```console
./build
```

Of als je zelf Docker wilt gebruiken dan run je:

```console
docker build -t devops-blog-image .
docker run --name devops-blog-container -d -p 8081:80 devops-blog-image

```

We hebben de image en container hierboven `devops-blog-image` respectievelijk `devops-blog-container` genoemd, omdat dit het makkelijker maakt om de app opnieuw te starten na het veranderen/repareren van iets. Om de app opnieuw te starten moet je de container eerst stoppen en verwijderen. Een naam gebruiken is duidelijker dan het gebruiken/opzoeken van willekeurige namen of hashes die Docker aanmaakt:

```console
docker stop devops-blog-container
docker rm devops-blog-container
```

## Beoordelingsmodel

Zie [beoordelingsmodel.md](beoordelingsmodel.md) voor het eh... beoordelingsmodel. Hiermee kun je het best een self assessment voordat je het inlevert, om te voorkomen dat je direct een knock-put hebt.

## Custom lint regels

De custom markdown lint regels zijn een mooie start en toepassing van het 'Automate all the things' principe van DevOps. Realiseer je echter wel dat uiteindelijk, toch een mens er naar kijken en het beoordelen, en deze kan zich richten op belangrijkere dingen, die een computer nog niet kan beoordelen. Omdat het een misvatting te denken zowel dat de blog goed is als er geen linting issue meer uitkomen. En zelfs dat de blog NIET goed is als er nog wel linting issues zijn.

Maar je kunt deze expliciet handmatig testen met het volgende commando:

```console
npx markdownlint-cli2 "src/*/README.md" "#.markdownlint.yaml" "#custom-rules.js"
```

Als je VS code gebruikt en de mdlint extensie hebt zou deze editor de custom lint regels automatisch toepassen als je het README.md bestand opent. En weergeven in de `/. Deze linting regels zijn nog in ontwikkeling, dus als je zelf meent dat je toch wel 'in de geest van een warning' hebt gehandeld. Neem dan even een copy-paste op van de resterende regels en geef per regel aan wat er volgens jou misgaat. Dan kunnen minor docenten/begeleiders deze voor een volgende editie weer bijwerken/verbeteren (Continuous Improvement).

> "Lint is the computer science term for a static code analysis tool used to flag programming errors, bugs, stylistic errors and suspicious constructs." - 

## Bronnen

- https://en.wikipedia.org/w/index.php?title=Lint_(software)&oldid=1233458138)