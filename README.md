# Devops blog

Schrijf je devops blog in het bestand `src/dev-blog-name-in-kebab-case/README.md`.
Schrijf je onderzoeksplan in `src/onderzoeksplan.md`

Om te testen hoe je blog eruit testen binnen [mdbook](https://rust-lang.github.io/mdBook/) zonder zelf mdbook te installeren kun je bijgevoegde Docker file gebruiken.

Zorg dus dat je Docker hebt geinstalleerd, bijvoorbeeld via [Docker Desktop voor Windows](https://docs.docker.com/desktop/install/windows-install/) of macOS. Voor het gemak is er ook een bash script `build`. Deze moet je wellicht eenmalig `chmod +x mdbook-build`. En run je daarna met:

```console
./build
```

Of als je zelf Docker wilt gebruiken dan run je:

```console
docker build -t devops-blog-image .
docker run --name devops-blog-container -d -p 8081:80 devops-blog-image

# We hebben de image en container hierboven `devops-blog` genoemd, omdat dit het makkelijker maakt om de app opnieuw te starten na het veranderen/repareren van iets.
# Om de app opnieuw te starten moet je de container eerst stoppen en verwijderen. En een naam is korter dan het opzoeken van willekeurige namen of hashes die Docker aanmaakt.
# docker stop devops-blog-container
# docker rm devops-blog-container
```

## Fix mdbook issue

In de op vrijdag 4 oktober verspreide versie zat helaas nog een bug waardoor de mdbook build niet goed werkte. Althans je kreeg de standaar Nginx pagina te zien op `https://localhost:8081` in plaats van de gehoopte mdbook landingspagina.

```console
git remote add origin2 git@github.com:hanaim-devops/devops-blog.git
git fetch origin2
git cherry-pick 3a497635ff3c2285bbfbffa4cd30b8934b6b2b1c

# Eventueel kun je de 2e origin ook weer verwijderen
# Dan verwart dit je ook niet meer.
# Maar wellicht komt er nog een update, maar dan kun je hem ook weer opnieuw toevoegen
#git remote rm origin2
#
# Je zou ook nog kunnen prunen als een soort 'git unfetch' (die niet bestaat, maar de git fetch is wel eventjes bezig, dus er is wel weer wat data bijgekomen)
# Maar dit lijkt niet veel te doen, en ChatGPT heeft verder ook geen suggesties.
#git gc --prune=now
# Bron: https://chatgpt.com/c/6704d70a-8318-8012-9e1c-1dbe285e2661
```
