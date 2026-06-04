# PDP Translations — Tone Adapting Foundation (PL / CS / SL)

Source: live product `color-changing-foundation` + template `product.foundation.json`
(sections: lumen-pdp-hero, lumen-grid-benefits, lumen-before-after, lumen-image-slider,
vl-review-cards, lumen-benefits, lumen-faq, vl-upsell-modal).

## How to use this
Most of this is **Theme** content, not Product content. In **Apps → Translate & Adapt**:
- **Products → Tone Adapting Foundation** → fill *Title, Description, SEO, Skin tone option*.
- **Theme → product.foundation template** (or the individual sections) → fill the section
  strings below. Search the English string in Translate & Adapt and paste the matching language.

## What I adapted (not literal-translated) for the EU market
- Shipping/returns copy → **€50 free-shipping threshold, €4.99 flat, 3–5 business days** (matches your EU rate).
- Removed hardcoded `$` / "across the US"; kept `[threshold]` placeholders where dynamic.
- **Reviewer/persona names localized** to plausible local names (ages kept) so the page reads native.
- **INCI ingredient list left untranslated** — INCI names are an international Latin standard; do not translate them.
- ⚠️ **Amazon promo strings** ("50% discount on Amazon") are translated for completeness, but you almost
  certainly want to **hide these blocks for the EU market** — you're not running Amazon there.

---

# 1) PRODUCT (Translate & Adapt → Products → Tone Adapting Foundation)

### Title
- **EN:** Tone Adapting Foundation
- **PL:** Podkład Dopasowujący Się do Tonu Skóry
- **CS:** Make-up Přizpůsobující se Tónu Pleti
- **SL:** Podlaga, ki se Prilagaja Tonu Kože

### Description (body)
- **EN:** Tone adapting foundation
- **PL:** <p>Podkład dopasowujący się do tonu skóry — biały krem, który przy aplikacji zmienia się w Twój dokładny odcień. Nawilżająca formuła daje budowalne krycie, maskuje zaczerwienienia i niedoskonałości, pozostając lekka i oddychająca przez cały dzień.</p>
- **CS:** <p>Make-up přizpůsobující se tónu pleti — bílý krém, který se při nanesení promění ve váš přesný odstín. Hydratační formule poskytuje budovatelné krytí, maskuje zarudnutí a nedokonalosti a zůstává lehká a prodyšná po celý den.</p>
- **SL:** <p>Podlaga, ki se prilagaja tonu kože — bela krema, ki se ob nanosu spremeni v vaš točen odtenek. Vlažilna formula daje nadgradljivo prekrivnost, prikrije rdečico in nepravilnosti ter ostane lahka in zračna ves dan.</p>

### SEO title
- **PL:** Podkład Dopasowujący Się do Tonu Skóry | Vera Lane
- **CS:** Make-up Přizpůsobující se Tónu Pleti | Vera Lane
- **SL:** Podlaga, ki se Prilagaja Tonu Kože | Vera Lane

### SEO meta description
- **PL:** Jeden odcień, który dopasowuje się do Twojej skóry. Lekki, nawilżający podkład, który maskuje zaczerwienienia i niedoskonałości i wygląda jak skóra, nie makijaż. 30 dni gwarancji.
- **CS:** Jeden odstín, který se přizpůsobí vaší pleti. Lehký, hydratační make-up, který maskuje zarudnutí a nedokonalosti a vypadá jako pleť, ne make-up. 30denní záruka.
- **SL:** En odtenek, ki se prilagodi vaši koži. Lahka, vlažilna podlaga, ki prikrije rdečico in nepravilnosti ter izgleda kot koža, ne ličila. 30-dnevna garancija.

### Option name: "Skin tone"
- **PL:** Odcień skóry
- **CS:** Odstín pleti
- **SL:** Odtenek kože

### Option values: Fair / Medium / Medium-Dark
- **PL:** Jasny / Średni / Średnio-ciemny
- **CS:** Světlý / Střední / Středně tmavý
- **SL:** Svetel / Srednji / Srednje temen

---

# 2) lumen-pdp-hero (main buy box)

### add_to_cart_label — "ADD TO CART"
- **PL:** DODAJ DO KOSZYKA · **CS:** PŘIDAT DO KOŠÍKU · **SL:** DODAJ V KOŠARICO

### adding_to_cart_label — "ADDING..."
- **PL:** DODAWANIE... · **CS:** PŘIDÁVÁNÍ... · **SL:** DODAJANJE...

### upsell_button_label — "ADD TO BAG"
- **PL:** DODAJ DO KOSZYKA · **CS:** PŘIDAT DO KOŠÍKU · **SL:** DODAJ V KOŠARICO

### delivery_text — "SHIPS IN 2 DAYS · DELIVERS IN 4-5" (adapted to EU)
- **PL:** WYSYŁKA W 1 DZIEŃ · DOSTAWA W 3–5 DNI
- **CS:** ODESÍLÁME DO 1 DNE · DORUČENÍ ZA 3–5 DNÍ
- **SL:** ODPOŠLJEMO V 1 DNEVU · DOSTAVA V 3–5 DNEH

### free_delivery_text — "FREE DELIVERY"
- **PL:** DARMOWA DOSTAWA · **CS:** DOPRAVA ZDARMA · **SL:** BREZPLAČNA DOSTAVA

### ugc_heading — "SEE HOW IT WORKS ON DIFFERENT PEOPLE"
- **PL:** ZOBACZ, JAK DZIAŁA NA RÓŻNYCH OSOBACH
- **CS:** PODÍVEJTE SE, JAK FUNGUJE NA RŮZNÝCH LIDECH
- **SL:** POGLEJTE, KAKO DELUJE NA RAZLIČNIH LJUDEH

### upsell_heading — "Choose what works best for you"
- **PL:** Wybierz to, co najlepiej Ci pasuje
- **CS:** Vyberte si, co vám nejlépe vyhovuje
- **SL:** Izberite, kar vam najbolj ustreza

### description_item 1 — title / content
- **EN title:** Instantly Adapts to Your Exact Shade
- **PL:** Natychmiast Dopasowuje Się do Twojego Dokładnego Odcienia
- **CS:** Okamžitě se Přizpůsobí Vašemu Přesnému Odstínu
- **SL:** Takoj se Prilagodi Vašemu Točnemu Odtenku
- **EN content:** The white cream transforms upon application to match your unique skin tone perfectly.
- **PL:** <p>Biały krem przy aplikacji zmienia się tak, by idealnie dopasować się do Twojego unikalnego tonu skóry.</p>
- **CS:** <p>Bílý krém se při nanesení promění tak, aby se dokonale přizpůsobil vašemu jedinečnému tónu pleti.</p>
- **SL:** <p>Bela krema se ob nanosu spremeni tako, da se popolnoma prilagodi vašemu edinstvenemu tonu kože.</p>

### description_item 2 — title / content
- **EN title:** Ideal for Mature Skin (Floats Over Fine Lines):
- **PL:** Idealny dla Dojrzałej Skóry (Unosi Się nad Drobnymi Zmarszczkami):
- **CS:** Ideální pro Zralou Pleť (Nezateče do Jemných Vrásek):
- **SL:** Idealna za Zrelo Kožo (Lebdi čez Drobne Gubice):
- **EN content:** The hydrating formula doesn't cake or crease into wrinkles, creating a smooth finish that looks like skin, not makeup.
- **PL:** <p>Nawilżająca formuła nie zbija się ani nie zbiera w zmarszczkach, tworząc gładkie wykończenie, które wygląda jak skóra, a nie makijaż.</p>
- **CS:** <p>Hydratační formule se neusazuje ani nezatéká do vrásek a vytváří hladký výsledek, který vypadá jako pleť, ne make-up.</p>
- **SL:** <p>Vlažilna formula se ne nabira in ne zateče v gube ter ustvari gladek videz, ki izgleda kot koža, ne ličila.</p>

### description_item 3 — title / content
- **EN title:** Weightless, "Second-Skin" Feel
- **PL:** Nieważkie Uczucie "Drugiej Skóry"
- **CS:** Beztížný Pocit "Druhé Kůže"
- **SL:** Breztežen Občutek "Druge Kože"
- **EN content:** Say goodbye to that heavy, "mask-like" sensation. Neutralizes redness and age spots while letting your skin breathe, giving you a healthy, lit-from-within glow.
- **PL:** <p>Pożegnaj ciężkie uczucie "maski". Neutralizuje zaczerwienienia i przebarwienia, pozwalając skórze oddychać i dając zdrowy blask od wewnątrz.</p>
- **CS:** <p>Rozlučte se s těžkým pocitem "masky". Neutralizuje zarudnutí a pigmentové skvrny, nechá pleť dýchat a dodá zdravý zář zevnitř.</p>
- **SL:** <p>Poslovite se od težkega občutka "maske". Nevtralizira rdečico in starostne pege, pušča kožo dihati in daje zdrav sij od znotraj.</p>

### trust_badge 1 — "30 Day Money Back Guarantee"
- **PL:** <p>30-dniowa gwarancja zwrotu pieniędzy</p>
- **CS:** <p>30denní záruka vrácení peněz</p>
- **SL:** <p>30-dnevna garancija vračila denarja</p>

### trust_badge 2 — "Free Shipping from $[threshold]" (adapted, currency-neutral)
- **PL:** <p>Darmowa dostawa od [threshold]</p>
- **CS:** <p>Doprava zdarma od [threshold]</p>
- **SL:** <p>Brezplačna dostava od [threshold]</p>

### trust_badge 3 — "Free Return"
- **PL:** <p>Darmowy zwrot</p> · **CS:** <p>Vrácení zdarma</p> · **SL:** <p>Brezplačno vračilo</p>

### bundle corner/badge text — "MOST POPULAR" / "BUNDLE" / "GREAT DEAL" / "BEST" / "POPULAR" / "BEST VALUE"
- **MOST POPULAR** — PL: NAJPOPULARNIEJSZY · CS: NEJOBLÍBENĚJŠÍ · SL: NAJBOLJ PRILJUBLJENO
- **BUNDLE** — PL: ZESTAW · CS: SADA · SL: KOMPLET
- **GREAT DEAL** — PL: ŚWIETNA OKAZJA · CS: SKVĚLÁ NABÍDKA · SL: ODLIČNA PONUDBA
- **BEST** — PL: NAJLEPSZY · CS: NEJLEPŠÍ · SL: NAJBOLJŠE
- **POPULAR** — PL: POPULARNY · CS: OBLÍBENÉ · SL: PRILJUBLJENO
- **BEST VALUE** — PL: NAJLEPSZA CENA · CS: NEJVÝHODNĚJŠÍ · SL: NAJUGODNEJE

### bundle titles
- **"Starter Kit: Foundation, Makeup Brush & Makeup Bag"**
  - PL: Zestaw startowy: podkład, pędzel do makijażu i kosmetyczka
  - CS: Startovací sada: make-up, kosmetický štětec a kosmetická taštička
  - SL: Začetni komplet: podlaga, čopič za ličenje in kozmetična torbica
- **"1 Piece" / "2 Pieces" / "3 Pieces"**
  - PL: 1 sztuka / 2 sztuki / 3 sztuki
  - CS: 1 kus / 2 kusy / 3 kusy
  - SL: 1 kos / 2 kosa / 3 kosi

### amazon_promo_text — "Get a 50% Discount When You Buy On Amazon - 3 Days Only" ⚠️ hide for EU
- **PL:** Zgarnij 50% zniżki przy zakupie na Amazon – tylko przez 3 dni
- **CS:** Získejte 50% slevu při nákupu na Amazonu – pouze 3 dny
- **SL:** Pridobite 50 % popusta ob nakupu na Amazonu – samo 3 dni

---

# 3) lumen-grid-benefits — "Beautiful Benefits"

### main_title — "Beautiful Benefits"
- **PL:** Piękne Korzyści · **CS:** Krásné Výhody · **SL:** Čudovite Prednosti

### benefit_1 — Adaptive Color Technology
- **PL title:** Technologia Adaptacyjnego Koloru
- **CS title:** Technologie Adaptivní Barvy
- **SL title:** Tehnologija Prilagodljive Barve
- **PL:** Nasza inteligentna technologia kapsułek rozpoznaje Twoje unikalne podtony przy kontakcie. Biały krem rozkłada się podczas rozcierania, uwalniając pigmenty, które odzwierciedlają Twój dokładny ton skóry — dopasowanie, które należy tylko do Ciebie.
- **CS:** Naše inteligentní kapslová technologie rozpozná vaše jedinečné podtóny při kontaktu. Bílý krém se při roztírání rozkládá a uvolňuje pigmenty, které zrcadlí váš přesný tón pleti — shoda, která patří jen vám.
- **SL:** Naša inteligentna kapsulna tehnologija prepozna vaše edinstvene podtone ob stiku. Bela krema se med nanašanjem razgradi in sprosti pigmente, ki zrcalijo vaš točen ton kože — ujemanje, ki je samo vaše.

### benefit_2 — Engineered for Mature Texture
- **PL title:** Stworzony dla Dojrzałej Skóry
- **CS title:** Vyvinuto pro Zralou Pleť
- **SL title:** Zasnovano za Zrelo Teksturo
- **PL:** Tradycyjny makijaż często podkreśla to, co chcesz ukryć. Nasza formuła jest specjalnie zaprojektowana, by unosić się nad drobnymi zmarszczkami i rozszerzonymi porami, zamiast w nie wnikać, tworząc efekt liftingu i miękkiego rozmycia na cały dzień.
- **CS:** Tradiční make-up často zvýrazňuje to, co chcete skrýt. Naše formule je speciálně navržena tak, aby přecházela přes jemné vrásky a rozšířené póry, místo aby do nich zatékala, a vytvářela tak vyhlazený, soft-focus efekt na celý den.
- **SL:** Tradicionalna ličila pogosto poudarijo tisto, kar želite skriti. Naša formula je posebej zasnovana tako, da lebdi čez drobne gubice in razširjene pore, namesto da bi se vanje posedla, ter ustvari dvignjen, mehko zabrisan učinek čez ves dan.

### benefit_3 — The "Second Skin" Glow
- **PL title:** Blask "Drugiej Skóry"
- **CS title:** Zář "Druhé Kůže"
- **SL title:** Sij "Druge Kože"
- **PL:** Maskuj zaczerwienienia, przebarwienia i nierówności bez ciężkiego uczucia "maski" typowego dla podkładów o pełnym kryciu. To oddychające, lekkie wykończenie pozwala Twojej naturalnej promienności prześwitywać, zapewniając jednolitą, wyrównaną cerę.
- **CS:** Zakryjte zarudnutí, pigmentové skvrny a nerovnosti bez těžkého pocitu "masky" typického pro plně krycí make-up. Tento prodyšný, lehký výsledek nechá vaši přirozenou zář prosvítat a zajistí vyrovnanou, jednotnou pleť.
- **SL:** Prikrijte rdečico, starostne pege in neenakomernosti brez težkega občutka "maske", značilnega za polno prekrivne podlage. Ta zračen, lahek videz pušča vaš naravni sij, da zasije, in zagotavlja uravnotežen, enakomeren ten.

### benefit_4 — 16-Hour Hydration Lock
- **PL title:** 16-Godzinne Nawilżenie
- **CS title:** 16hodinové Zamčení Hydratace
- **SL title:** 16-Urna Zaklenjena Vlaga
- **PL:** Stworzony, by zwalczać "popołudniowe przesuszenie" typowe dla dojrzałej skóry. Ta trwała formuła pozostaje elastyczna i świetlista przez nawet 16 godzin, dzięki czemu Twoja skóra wieczorem wygląda tak świeżo jak rano.
- **CS:** Vytvořeno pro boj s "polední vysušením" běžným u zralé pleti. Tato dlouhotrvající formule zůstává pružná a zářivá až 16 hodin, takže vaše pleť vypadá večer stejně svěže jako ráno.
- **SL:** Zasnovano za boj proti "opoldanski izsušitvi", pogosti pri zreli koži. Ta dolgoobstojna formula ostane prožna in sijoča do 16 ur, tako da vaša koža zvečer izgleda tako sveža kot zjutraj.

### benefit_5 — Clean & Breathable Pore Care
- **PL title:** Czysta i Oddychająca Pielęgnacja Porów
- **CS title:** Čistá a Prodyšná Péče o Póry
- **SL title:** Čista in Zračna Nega Por
- **PL:** Podejście stawiające skórę na pierwszym miejscu, które nie powoduje wyprysków ani podrażnień. Nasze niekomedogenne składniki odżywiają barierę skóry, pozwalając porom oddychać, co czyni go bezpiecznym i komfortowym do codziennego noszenia.
- **CS:** Přístup s pletí na prvním místě, který nezpůsobuje vyrážky ani podráždění. Naše nekomedogenní složky vyživují kožní bariéru a nechávají póry dýchat, takže je bezpečný a pohodlný pro každodenní nošení.
- **SL:** Pristop, ki postavlja kožo na prvo mesto in ne povzroča mozoljev ali draženja. Naše nekomedogene sestavine negujejo kožno bariero in puščajo pore dihati, zato je varna in udobna za vsakodnevno nošenje.

### benefit_6 — Cruelty-Free
- **PL title:** Nietestowany na Zwierzętach
- **CS title:** Netestováno na Zvířatech
- **SL title:** Brez Testiranja na Živalih
- **PL:** Życzliwość jest piękna. Z dumą jesteśmy w 100% cruelty-free — nigdy nie testujemy naszych produktów ani składników na zwierzętach na żadnym etapie produkcji.
- **CS:** Laskavost je krásná. Jsme hrdě 100% netestováno na zvířatech — naše produkty ani složky nikdy netestujeme na zvířatech v žádné fázi výroby.
- **SL:** Prijaznost je lepa. Ponosno smo 100 % brez testiranja na živalih — naših izdelkov ali sestavin nikoli ne testiramo na živalih v nobeni fazi proizvodnje.

---

# 4) lumen-before-after — "Before & After"

### section_title — "Before & After"
- **PL:** Przed i Po · **CS:** Před a Po · **SL:** Pred in Po

### Card 1 — Linda, 62
- **Name** — PL: Krystyna, 62 · CS: Marie, 62 · SL: Marija, 62
- **PL:** Przestałam nosić podkład, bo zawsze wnikał w moje zmarszczki albo miał zły kolor — zwykle zbyt pomarańczowy. Ta formuła od razu dopasowała się do tonu mojej skóry i jest tak lekka. Nie wygląda jak makijaż — wygląda, jakbym znów miała piękną skórę.
- **CS:** Přestala jsem nosit make-up, protože vždycky zatekl do mých vrásek nebo měl špatnou barvu — obvykle moc oranžovou. Tahle formule okamžitě sedla k mému tónu pleti a je tak lehká. Nevypadá to jako make-up; prostě to vypadá, že mám zase krásnou pleť.
- **SL:** Nehala sem nositi podlago, ker se mi je vedno posedla v gubice ali pa je imela napačno barvo — običajno preveč oranžno. Ta formula se je takoj ujela z mojim tonom kože in je tako lahka. Ne izgleda kot ličila; izgleda, kot da imam spet lepo kožo.

### Card 2 — Michelle, 57
- **Name** — PL: Halina, 57 · CS: Jana, 57 · SL: Irena, 57
- **PL:** Mam trudne podtony i walczę z zaczerwienieniem, więc kupowanie makijażu online mnie przerażało. Zaryzykowałam i jestem w szoku. Od razu zneutralizował zaczerwienienie i wtopił się w szyję. Koniec z efektem "pływającej głowy"!
- **CS:** Mám problematické podtóny a bojuji se zarudnutím, takže nakupování make-upu online mě děsilo. Zariskovala jsem a jsem v šoku. Okamžitě neutralizoval moje zarudnutí a splynul s krkem. Žádný efekt "plovoucí hlavy"!
- **SL:** Imam zahtevne podtone in se borim z rdečico, zato me je nakupovanje ličil prek spleta strašilo. Tvegala sem in sem osupla. Takoj je nevtraliziral mojo rdečico in se zlil z vratom. Konec z učinkom "lebdeče glave"!

### Card 3 — Diane, 54
- **Name** — PL: Teresa, 54 · CS: Eva, 54 · SL: Mojca, 54
- **PL:** Mając bardzo jasną cerę, "uniwersalne" odcienie zwykle robią się na mnie ciemne lub pomarańczowe w ciągu godziny. Ten naprawdę pozostał wierny mojej bladej karnacji. Daje zdrowy, ciepły blask bez sztucznego wyglądu. Wreszcie idealne dopasowanie dla jasnej skóry.
- **CS:** S velmi světlou pletí mi "univerzální" odstíny obvykle do hodiny ztmavnou nebo zoranžoví. Tenhle skutečně zůstal věrný mé bledé pleti. Dodává zdravou, teplou zář bez umělého vzhledu. Konečně dokonalá shoda pro světlou pleť.
- **SL:** Z zelo svetlo poltjo "univerzalni" odtenki na meni običajno v eni uri potemnijo ali postanejo oranžni. Ta je res ostal zvest moji bledi polti. Daje zdrav, topel sij brez umetnega videza. Končno popolno ujemanje za svetlo kožo.

### Card 4 — Amanda, 47
- **Name** — PL: Beata, 47 · CS: Lenka, 47 · SL: Andreja, 47
- **PL:** Mam jasną skórę z dużą ilością naturalnego zaczerwienienia, więc znalezienie odcienia, który kryje bez efektu grubej maski, jest niemożliwe. Ten od razu zneutralizował moją cerę! Dopasował się idealnie do mojego bladego tonu — żadnej pomarańczowej linii, tylko spokojna, równa skóra.
- **CS:** Mám světlou pleť se spoustou přirozeného zarudnutí, takže najít odstín, který kryje, aniž by vypadal jako tlustá maska, je nemožné. Tenhle moji pleť okamžitě sjednotil! Přizpůsobil se mému bledému tónu dokonale — žádná oranžová linka, jen klidná, vyrovnaná pleť.
- **SL:** Imam svetlo kožo z veliko naravne rdečice, zato je nemogoče najti odtenek, ki prekrije, ne da bi izgledal kot debela maska. Ta je mojo polt takoj nevtraliziral! Popolnoma se je prilagodil mojemu blademu tonu — brez oranžne črte, le pomirjena, enakomerna koža.

---

# 5) lumen-image-slider — "Trusted by 1000s of Women"

### section_label / main_title — "Trusted by 1000s of Women"
- **PL:** Zaufały nam tysiące kobiet
- **CS:** Důvěřují nám tisíce žen
- **SL:** Zaupa nam na tisoče žensk

### Slider cards — name · subtitle (localized)
| EN | PL | CS | SL |
|---|---|---|---|
| Ivana · Copywriter | Iwona · Copywriterka | Ivana · Copywriterka | Ivana · Copywriterka |
| Sarah · Art Teacher | Sara · Nauczycielka plastyki | Sára · Učitelka výtvarné výchovy | Sara · Učiteljica likovne vzgoje |
| Dr Stephanie · Dermatologist | Dr Stefania · Dermatolożka | Dr. Stefanie · Dermatoložka | Dr. Štefanija · Dermatologinja |
| Monica · Grandmother | Monika · Babcia | Monika · Babička | Monika · Babica |
| Anastasia · Marketing Manager | Anastazja · Menedżerka marketingu | Anastázie · Marketingová manažerka | Anastazija · Vodja marketinga |
| Jessica · Grandmother | Jolanta · Babcia | Jana · Babička | Jasna · Babica |
| Jessica · Makeup Artist | Jolanta · Wizażystka | Jana · Vizážistka | Jasna · Vizažistka |

---

# 6) vl-review-cards

### load_more_text — "Load More Reviews"
- **PL:** Załaduj więcej recenzji · **CS:** Načíst další recenze · **SL:** Naloži več ocen

### Review 1 — Margaret S. → PL: Małgorzata S. · CS: Markéta S. · SL: Marjeta S.
- **Title** — PL: Wreszcie znalazłam idealne dopasowanie · CS: Konečně jsem našla svou ideální shodu · SL: Končno sem našla svoje popolno ujemanje
- **PL:** Mam 58 lat i próbowałam wszystkiego. Ten naprawdę wtapia się w moją skórę bez wnikania w zmarszczki. Córka zapytała, co robię inaczej!
- **CS:** Je mi 58 a zkusila jsem všechno. Tenhle se opravdu vpíjí do pleti, aniž by zatékal do vrásek. Dcera se ptala, co dělám jinak!
- **SL:** Stara sem 58 let in preizkusila sem vse. Ta se res zlije z mojo kožo, ne da bi zatekel v gube. Hči me je vprašala, kaj počnem drugače!

### Review 2 — Patricia L. → PL: Patrycja L. · CS: Pavla L. · SL: Patricija L.
- **Title** — PL: Koniec z pomarańczową twarzą! · CS: Konec s oranžovým obličejem! · SL: Konec z oranžnim obrazom!
- **PL:** W wieku 52 lat wypróbowałam każdy podkład, który obiecuje dopasowanie. W tym dopasowanie koloru jest prawdziwe. Dostosowuje się do mojej skóry przez cały dzień. Koniec ze sprawdzaniem w lustrze, czy o lunchu nie wyglądam na pomarańczową.
- **CS:** V 52 letech jsem vyzkoušela každý make-up, který slibuje, že sedne. U tohohle je sladění barvy skutečné. Přizpůsobuje se mé pleti během dne. Konec s kontrolováním v zrcadle, jestli v poledne nevypadám oranžově.
- **SL:** Pri 52 letih sem preizkusila vsako podlago, ki obljublja ujemanje. Pri tej je ujemanje barve resnično. Čez dan se prilagaja moji koži. Konec s preverjanjem v ogledalu, ali do kosila izgledam oranžno.

### Review 3 — Linda K. → PL: Lidia K. · CS: Lída K. · SL: Linda K.
- **Title** — PL: Warty każdej złotówki · CS: Stojí za každou korunu · SL: Vreden vsakega centa
- **PL:** W wieku 50 lat zmarnowałam tyle pieniędzy na podkłady, które się zbijają lub zbierają w zmarszczkach. Ten nie. Po prostu działa. Wreszcie coś, co sprawia, że moja skóra wygląda naturalnie.
- **CS:** V 50 letech jsem utratila spoustu peněz za make-upy, které se usazují nebo zatékají do vrásek. Tenhle ne. Prostě funguje. Konečně něco, díky čemu moje pleť vypadá přirozeně.
- **SL:** Pri 50 letih sem zapravila toliko denarja za podlage, ki se naberejo ali zatečejo v gube. Ta ne. Preprosto deluje. Končno nekaj, kar mojo kožo naredi videti naravno.

### Review 4 — Susan M. → PL: Zuzanna M. · CS: Zuzana M. · SL: Suzana M.
- **Title** — PL: Dobry, ale przydałoby się więcej odcieni · CS: Dobré, ale chtělo by to víc odstínů · SL: Dober, a želela bi si več odtenkov
- **PL:** W wieku 60 lat zrezygnowałam z podkładu. To się zmieniło. Lekki i naturalny. Chciałabym zobaczyć więcej odcieni dla ciemniejszej skóry.
- **CS:** V 60 letech jsem make-up vzdala. Tohle to změnilo. Lehký a přirozený. Uvítala bych více odstínů pro tmavší pleť.
- **SL:** Pri 60 letih sem podlago opustila. To se je spremenilo. Lahka in naravna. Želela bi si več odtenkov za temnejšo kožo.

### Review 5 — Carol B. → PL: Karolina B. · CS: Karolína B. · SL: Karolina B.
- **Title** — PL: Wreszcie coś na trądzik różowaty · CS: Konečně něco na růžovku · SL: Končno nekaj za rozacejo
- **PL:** W wieku 52 lat mój trądzik różowaty zawsze utrudniał makijaż. Ten neutralizuje zaczerwienienie bez wyglądu maski. Przełom dla dojrzałej skóry.
- **CS:** V 52 letech mi růžovka vždycky komplikovala make-up. Tenhle neutralizuje zarudnutí, aniž by vypadal jako maska. Zlom pro zralou pleť.
- **SL:** Pri 52 letih mi je rozaceja vedno oteževala ličenje. Ta nevtralizira rdečico, ne da bi izgledal kot maska. Prelom za zrelo kožo.

### Review 6 — Barbara R. → PL: Barbara R. · CS: Barbora R. · SL: Barbara R.
- **Title** — PL: Sceptyczka, która uwierzyła · CS: Skeptik, ze kterého se stal věřící · SL: Skeptičarka, ki je postala vernica
- **PL:** W wieku 55 lat przewracałam oczami na "dopasowuje się do tonu skóry", ale on naprawdę to robi. Idealne dopasowanie za każdym razem. Kupiłam jeszcze 3 na zapas.
- **CS:** V 55 letech jsem nad "přizpůsobí se vašemu tónu pleti" obracela oči, ale ono to opravdu dělá. Dokonalá shoda pokaždé. Koupila jsem si další 3 do zásoby.
- **SL:** Pri 55 letih sem ob "prilagodi se vašemu tonu kože" zavijala z očmi, a res to počne. Popolno ujemanje vsakič. Kupila sem še 3 za zalogo.

### Review 7 — Nancy W. → PL: Nadia W. · CS: Naďa W. · SL: Nataša W.
- **Title** — PL: Idealny na uderzenia gorąca · CS: Ideální na návaly horka · SL: Idealen za vročinske oblive
- **PL:** W wieku 55 lat uderzenia gorąca rozpuszczały mój makijaż do południa. Ten się trzyma, nawet gdy mam swój moment. Prawdziwy ratunek.
- **CS:** V 55 letech mi návaly horka rozpouštěly make-up do poledne. Tenhle drží, i když mám svůj moment. Naprostá záchrana.
- **SL:** Pri 55 letih so mi vročinski oblivi do poldneva stopili ličila. Ta zdrži, tudi ko imam svoj trenutek. Prava rešitev.

### Review 8 — Dorothy H. → PL: Dorota H. · CS: Dorota H. · SL: Doroteja H.
- **Title** — PL: Teraz mój ulubiony · CS: Teď můj favorit · SL: Zdaj moj najljubši
- **PL:** Wyrzuciłam pozostałe podkłady. To jedyny, jakiego potrzebuję. Dopasowuje się idealnie, nie zbija się, a moja skóra może oddychać.
- **CS:** Vyhodila jsem ostatní make-upy. Tenhle je jediný, který potřebuju. Sedne dokonale, neusazuje se a moje pleť může dýchat.
- **SL:** Vrgla sem stran druge podlage. Ta je edina, ki jo potrebujem. Ujame se popolnoma, se ne nabira in moja koža lahko diha.

### Review 9 — Helen J. → PL: Helena J. · CS: Helena J. · SL: Helena J.
- **Title** — PL: Wreszcie wygląda naturalnie · CS: Konečně to vypadá přirozeně · SL: Končno izgleda naravno
- **PL:** Zawsze wyglądałam "umalowana" z podkładem. Ten naprawdę wygląda jak moja skóra, tylko lepsza. Mąż zauważył od razu!
- **CS:** S make-upem jsem vždycky vypadala "nalíčeně". Tenhle opravdu vypadá jako moje pleť, jen lepší. Manžel si toho hned všiml!
- **SL:** S podlago sem vedno izgledala "naličena". Ta res izgleda kot moja koža, le boljša. Mož je takoj opazil!

### Review 10 — Ruth T. → PL: Róża T. · CS: Růžena T. · SL: Rut T.
- **Title** — PL: Świetne krycie · CS: Skvělé krytí · SL: Odlična prekrivnost
- **PL:** Maskuje moje przebarwienia bez ciężkiego wyglądu. Rozcieranie zajmuje chwilę, ale gdy się utrwali, jest piękny. Chciałabym dodanego SPF.
- **CS:** Zakrývá mé pigmentové skvrny, aniž by vypadal těžce. Roztírání chvíli trvá, ale jakmile zaschne, je nádherný. Uvítala bych přidané SPF.
- **SL:** Prikrije moje starostne pege, ne da bi izgledal težko. Nanašanje traja trenutek, a ko se ustali, je čudovit. Želela bi si dodan SPF.

### Review 11 — Mary E. → PL: Maria E. · CS: Marie E. · SL: Marija E.
- **Title** — PL: Córka kupiła mi go · CS: Dcera mi ho koupila · SL: Hči mi ga je kupila
- **PL:** Córka zaskoczyła mnie tym produktem. Najlepszy prezent! W wieku 67 lat zrezygnowałam z podkładu. Teraz noszę go codziennie.
- **CS:** Dcera mě tím překvapila. Nejlepší dárek! V 67 letech jsem make-up vzdala. Teď ho nosím každý den.
- **SL:** Hči me je presenetila s tem izdelkom. Najlepše darilo! Pri 67 letih sem podlago opustila. Zdaj jo nosim vsak dan.

### Review 12 — Jean M. → PL: Janina M. · CS: Jana M. · SL: Jana M.
- **Title** — PL: Zamawiam więcej dla przyjaciółek · CS: Objednávám další pro kamarádky · SL: Naročam še za prijateljice
- **PL:** To jest to, czego potrzebuje dojrzała skóra. Lekki, oddychający i jakimś cudem sprawia, że zmarszczki są mniej widoczne. Już zamówiłam prezenty dla mojego klubu książki!
- **CS:** Tohle je to, co zralá pleť potřebuje. Lehký, prodyšný a nějak dělá vrásky méně viditelné. Už jsem objednala dárky pro svůj knižní klub!
- **SL:** To je tisto, kar zrela koža potrebuje. Lahek, zračen in nekako naredi gube manj vidne. Že sem naročila darila za svoj bralni klub!

---

# 7) lumen-benefits — "Key benefits of Vera Lane"

### section_label — "Key benefits of Vera Lane"
- **PL:** Kluczowe zalety Vera Lane · **CS:** Klíčové výhody Vera Lane · **SL:** Ključne prednosti Vera Lane

### benefit_1 — Custom-Fit Color Technology
- **PL title:** Technologia Koloru Idealnie Dopasowanego
- **CS title:** Technologie Barvy na Míru
- **SL title:** Tehnologija Barve po Meri
- **PL:** Pożegnaj zgadywanie przy dobieraniu odcienia. Nasza innowacyjna formuła uwalnia mikrokapsułkowane pigmenty przy aplikacji, płynnie zmieniając się z bieli w Twój dokładny ton skóry — dopasowanie, które jest tylko Twoje.
- **CS:** Rozlučte se s hádáním při výběru odstínu. Naše inovativní formule uvolňuje mikrokapslové pigmenty při nanesení a plynule se mění z bílé na váš přesný tón pleti — shoda, která je jen vaše.
- **SL:** Poslovite se od ugibanja pri iskanju odtenka. Naša inovativna formula ob nanosu sprosti mikrokapsulirane pigmente in se gladko spremeni iz bele v vaš točen ton kože — ujemanje, ki je samo vaše.

### benefit_2 — Flawless, Ageless Finish
- **PL title:** Nieskazitelne, Ponadczasowe Wykończenie
- **CS title:** Bezchybný Výsledek Bez Věku
- **SL title:** Brezhiben Videz Brez Starosti
- **PL:** Zaprojektowany specjalnie dla dojrzałej skóry, ten lekki podkład prześlizguje się po drobnych zmarszczkach, zamiast w nie wnikać. Natychmiast neutralizuje zaczerwienienia i rozmywa niedoskonałości, pozostawiając gładką, promienną i młodszą cerę.
- **CS:** Navrženo speciálně pro zralou pleť, tento lehký make-up klouže přes jemné vrásky, místo aby do nich zatékal. Okamžitě neutralizuje zarudnutí a rozostřuje nedokonalosti a zanechává hladkou, zářivou a mladší pleť.
- **SL:** Zasnovana posebej za zrelo kožo, ta lahka podlaga drsi čez drobne gubice, namesto da bi vanje zatekla. Takoj nevtralizira rdečico in zabriše nepravilnosti ter pusti gladko, sijočo in mlajšo polt.

### benefit_3 — Hydrating Skincare Hybrid
- **PL title:** Nawilżający Hybryd Pielęgnacyjny
- **CS title:** Hydratační Pečující Hybrid
- **SL title:** Vlažilni Negovalni Hibrid
- **PL:** Coś więcej niż makijaż. Wzbogacony o glicerynę, bisabolol i witaminę E, zatrzymuje wilgoć i łagodzi zaczerwienienia podczas noszenia, dzięki czemu Twoja skóra czuje się komfortowo i odżywiona od rana do wieczora.
- **CS:** Víc než jen make-up. Obohacený o glycerin, bisabolol a vitamin E, uzamyká vlhkost a zklidňuje zarudnutí během nošení, takže vaše pleť je pohodlná a vyživená od rána do večera.
- **SL:** Več kot le ličila. Obogatena z glicerinom, bisabololom in vitaminom E zaklene vlago in pomirja rdečico med nošenjem, tako da je vaša koža udobna in negovana od jutra do večera.

### benefit_4 — 16-Hour Weightless Wear
- **PL title:** 16-Godzinne Nieważkie Noszenie
- **CS title:** 16hodinové Beztížné Nošení
- **SL title:** 16-Urno Breztežno Nošenje
- **PL:** Ciesz się pewnością siebie, która trwa od rana do nocy. Nasza oddychająca, niekomedogenna formuła jest odporna na ciepło i wilgoć przez nawet 16 godzin, zapewniając trwałe krycie, które nigdy nie jest ciężkie, zbite ani przypominające maskę.
- **CS:** Užijte si sebevědomí, které vydrží od rána do noci. Naše prodyšná, nekomedogenní formule odolává teplu a vlhkosti až 16 hodin a poskytuje trvanlivé krytí, které nikdy není těžké, usazené ani připomínající masku.
- **SL:** Uživajte v samozavesti, ki traja od jutra do noči. Naša zračna, nekomedogena formula kljubuje vročini in vlagi do 16 ur ter zagotavlja obstojno prekrivnost, ki nikoli ni težka, nabrana ali podobna maski.

---

# 8) lumen-faq — "Frequently Asked Questions" (shipping/returns ADAPTED to EU)

### main_heading — "Frequently Asked Questions"
- **PL:** Często Zadawane Pytania · **CS:** Často Kladené Otázky · **SL:** Pogosto Zastavljena Vprašanja

### popup_trigger_text — "View full list" / "See full ingredient list"
- View full list — PL: Zobacz pełną listę · CS: Zobrazit celý seznam · SL: Poglej cel seznam
- See full ingredient list — PL: Zobacz pełną listę składników · CS: Zobrazit celý seznam složek · SL: Poglej cel seznam sestavin

### FAQ 1 — What is your return policy?
- **Q** — PL: Jaka jest polityka zwrotów? · CS: Jaké jsou vaše podmínky vrácení? · SL: Kakšna je vaša politika vračil?
- **PL:** Oferujemy 30-dniową gwarancję zwrotu pieniędzy na wszystkie produkty. Jeśli nie jesteś w pełni zadowolona z zakupu, skontaktuj się z nami w celu pełnego zwrotu.
- **CS:** Na všechny produkty nabízíme 30denní záruku vrácení peněz. Pokud nejste se svým nákupem zcela spokojeni, kontaktujte nás pro plné vrácení peněz.
- **SL:** Na vse izdelke nudimo 30-dnevno garancijo vračila denarja. Če z nakupom niste povsem zadovoljni, nas kontaktirajte za polno vračilo.

### FAQ 2 — How long does shipping take? (adapted: 3–5 days)
- **Q** — PL: Jak długo trwa dostawa? · CS: Jak dlouho trvá doručení? · SL: Kako dolgo traja dostava?
- **PL:** Standardowa dostawa trwa 3–5 dni roboczych.
- **CS:** Standardní doručení trvá 3–5 pracovních dní.
- **SL:** Standardna dostava traja 3–5 delovnih dni.

### FAQ 3 — Suitable for sensitive skin?
- **Q** — PL: Czy produkt jest odpowiedni dla wrażliwej skóry? · CS: Je tento produkt vhodný pro citlivou pleť? · SL: Je izdelek primeren za občutljivo kožo?
- **PL:** Tak, nasze produkty są testowane dermatologicznie i opracowane dla większości typów skóry, w tym wrażliwej. Jeśli Twoja skóra jest szczególnie wrażliwa, zalecamy test płatkowy.
- **CS:** Ano, naše produkty jsou dermatologicky testované a vyvinuté pro většinu typů pleti, včetně citlivé. Pokud je vaše pleť obzvláště citlivá, doporučujeme provést test na malé ploše.
- **SL:** Da, naši izdelki so dermatološko testirani in zasnovani za večino tipov kože, vključno z občutljivo. Če je vaša koža posebej občutljiva, priporočamo test na majhnem delu kože.

### FAQ 4 — How do I know which shade?
- **Q** — PL: Skąd mam wiedzieć, który odcień wybrać? · CS: Jak poznám, který odstín zvolit? · SL: Kako vem, kateri odtenek izbrati?
- **PL:** Nasz podkład dopasowuje się do tonu Twojej skóry w kilka sekund. Działa na jasne i średnie odcienie skóry.
- **CS:** Náš make-up se přizpůsobí vašemu tónu pleti během několika sekund. Funguje pro světlé až střední tóny pleti.
- **SL:** Naša podlaga se v nekaj sekundah prilagodi vašemu tonu kože. Deluje za svetle do srednje odtenke kože.

### FAQ 5 — What ingredients?
- **Q** — PL: Jakie składniki zawiera produkt? · CS: Jaké složky produkt obsahuje? · SL: Katere sestavine vsebuje izdelek?
- **PL:** Nasz podkład zawiera odżywcze składniki, takie jak gliceryna, bisabolol i witamina E, dla zdrowej, komfortowo wyglądającej skóry.
- **CS:** Náš make-up obsahuje vyživující složky jako glycerin, bisabolol a vitamin E pro zdravou, pohodlně vypadající pleť.
- **SL:** Naša podlaga vsebuje hranljive sestavine, kot so glicerin, bisabolol in vitamin E, za zdravo, udobno videti kožo.

### FAQ 6 — Do you offer free shipping? (adapted to EU rate)
- **Q** — PL: Czy oferujecie darmową dostawę? · CS: Nabízíte dopravu zdarma? · SL: Ali ponujate brezplačno dostavo?
- **PL:** Tak, oferujemy darmową dostawę przy zamówieniach powyżej 50 €. Zamówienia poniżej 50 € objęte są stałą opłatą 4,99 €.
- **CS:** Ano, nabízíme dopravu zdarma u objednávek nad 50 €. U objednávek pod 50 € účtujeme jednotnou sazbu 4,99 €.
- **SL:** Da, ponujamo brezplačno dostavo pri naročilih nad 50 €. Pri naročilih pod 50 € velja enotna cena 4,99 €.

### FAQ (moved) — How does the guarantee work?
- **Q** — PL: Jak działa gwarancja? · CS: Jak funguje záruka? · SL: Kako deluje garancija?
- **PL:** <p><strong>Nasza gwarancja 100% dopasowania odcienia:</strong> Chcemy, abyś przetestowała swój nowy podkład bez żadnego ryzyka. Jeśli formuła nie dopasuje się idealnie do tonu Twojej skóry, otrzymasz 100% zwrotu pieniędzy — bez żadnych pytań.</p>
- **CS:** <p><strong>Naše záruka 100% shody odstínu:</strong> Chceme, abyste svůj nový make-up vyzkoušeli zcela bez rizika. Pokud se formule dokonale nepřizpůsobí vašemu tónu pleti, dostanete zpět 100 % peněz — bez otázek.</p>
- **SL:** <p><strong>Naša garancija 100-% ujemanja odtenka:</strong> Želimo, da svojo novo podlago preizkusite povsem brez tveganja. Če se formula popolnoma ne prilagodi vašemu tonu kože, prejmete 100 % vračila denarja — brez vprašanj.</p>

### FAQ (moved) — Description
- **Q** — PL: Opis · CS: Popis · SL: Opis
- **PL:** <p>Doświadcz podkładu, który wykonuje pracę za Ciebie. Ten biały krem przy aplikacji zmienia się, by idealnie dopasować się do Twojego unikalnego tonu skóry. Nawilżająca formuła zapewnia budowalne krycie, które maskuje zaczerwienienia i niedoskonałości, pozostając lekka i oddychająca przez cały dzień.</p>
- **CS:** <p>Zažijte make-up, který za vás odvede práci. Tento bílý krém se při nanesení promění tak, aby se dokonale přizpůsobil vašemu jedinečnému tónu pleti. Hydratační formule poskytuje budovatelné krytí, které skryje zarudnutí a nedokonalosti, a přitom zůstává lehká a prodyšná po celý den.</p>
- **SL:** <p>Doživite podlago, ki delo opravi namesto vas. Ta bela krema se ob nanosu spremeni tako, da se popolnoma prilagodi vašemu edinstvenemu tonu kože. Vlažilna formula daje nadgradljivo prekrivnost, ki prikrije rdečico in nepravilnosti, ter ostane lahka in zračna ves dan.</p>

### FAQ (moved) — Does this work for my skin?
- **Q** — PL: Czy zadziała na mojej skórze? · CS: Bude to fungovat na mé pleti? · SL: Ali bo delovalo na moji koži?
- **PL:** <p>Tak. Nasza adaptacyjna formuła jest odpowiednia dla wszystkich jasnych i średnich odcieni skóry i została specjalnie opracowana dla dojrzałych typów skóry. Zaprojektowana, by unosić się nad drobnymi zmarszczkami, zamiast w nie wnikać — idealna dla skóry z teksturą, trądzikiem różowatym lub przebarwieniami.</p>
- **CS:** <p>Ano. Naše adaptivní formule je vhodná pro všechny světlé až střední tóny pleti a je speciálně vyvinuta pro zralé typy pleti. Je navržena tak, aby přecházela přes jemné vrásky, místo aby do nich zatékala — ideální pro pleť s texturou, růžovkou nebo pigmentovými skvrnami.</p>
- **SL:** <p>Da. Naša prilagodljiva formula je primerna za vse svetle do srednje tone kože in je posebej zasnovana za zrele tipe kože. Zasnovana je tako, da lebdi čez drobne gubice, namesto da bi vanje zatekla — idealna za kožo s teksturo, rozacejo ali starostnimi pegami.</p>

### FAQ (moved) — Ingredients (intro only; INCI list untranslated)
- **Q** — PL: Składniki · CS: Složení · SL: Sestavine
- **PL:** Formuła stawiająca skórę na pierwszym miejscu, zbudowana wokół trzech kluczowych składników: gliceryna dla nawilżenia, bisabolol z pigmentami wyrównującymi koloryt, by łagodzić zaczerwienienia, oraz witamina E, by odżywiać.
- **CS:** Formule s pletí na prvním místě, postavená na třech klíčových složkách: glycerin pro hydrataci, bisabolol s pigmenty sjednocujícími tón pro zklidnění zarudnutí a vitamin E pro výživu.
- **SL:** Formula, ki postavlja kožo na prvo mesto, zgrajena okoli treh ključnih sestavin: glicerin za vlago, bisabolol s pigmenti za poenotenje tona, ki pomirjajo rdečico, in vitamin E za nego.
- **popup_title — "Full ingredient list"** — PL: Pełna lista składników · CS: Úplný seznam složek · SL: Celoten seznam sestavin
- **popup_content intro — "Listed in INCI order…":** (keep INCI list `<ul>…</ul>` exactly as-is, do NOT translate the INCI names)
  - PL: <p>Wymienione w kolejności INCI (międzynarodowe nazewnictwo składników kosmetycznych). Ostatnia aktualizacja: 2026-05-22.</p>
  - CS: <p>Uvedeno v pořadí INCI (mezinárodní nomenklatura kosmetických složek). Naposledy aktualizováno: 2026-05-22.</p>
  - SL: <p>Navedeno po vrstnem redu INCI (mednarodno poimenovanje kozmetičnih sestavin). Nazadnje posodobljeno: 2026-05-22.</p>

### FAQ (moved) — Shipping & Returns (ADAPTED to EU)
- **Q** — PL: Dostawa i zwroty · CS: Doprava a vrácení · SL: Dostava in vračila
- **PL:** <p><strong>Pokochaj to albo zwrot.</strong> Wypróbuj przez 30 dni. Jeśli nie unosi się nad zmarszczkami ani nie dopasowuje się do Twojego odcienia tak, jak obiecano, daj nam znać, aby otrzymać pełny zwrot.</p><p><strong>Szybka i bezpieczna dostawa.</strong> Wysyłamy Twoje zamówienie w ciągu 1 dnia roboczego. Darmowa dostawa przy zamówieniach powyżej 50 €; poniżej tej kwoty stała opłata 4,99 €. Dostawa w 3–5 dni roboczych.</p>
- **CS:** <p><strong>Zamilujte si to, nebo máte peníze zpět.</strong> Vyzkoušejte 30 dní. Pokud nepřechází přes vaše vrásky nebo nesedne k vašemu odstínu, jak slibujeme, dejte nám vědět pro plné vrácení peněz.</p><p><strong>Rychlé a bezpečné doručení.</strong> Vaši objednávku odesíláme do 1 pracovního dne. Doprava zdarma u objednávek nad 50 €; pod tuto částku jednotná sazba 4,99 €. Doručení za 3–5 pracovních dní.</p>
- **SL:** <p><strong>Vzljubi ali pa dobiš denar nazaj.</strong> Preizkusi 30 dni. Če ne lebdi čez tvoje gube ali se ne ujema s tvojim odtenkom, kot obljubljamo, nam sporoči za polno vračilo.</p><p><strong>Hitra in varna dostava.</strong> Tvoje naročilo odpošljemo v 1 delovnem dnevu. Brezplačna dostava pri naročilih nad 50 €; pod tem zneskom enotna cena 4,99 €. Dostava v 3–5 delovnih dneh.</p>

---

# 9) vl-upsell-modal

### badge_text — "WAIT! SPECIAL OFFER"
- **PL:** ZACZEKAJ! SPECJALNA OFERTA · **CS:** POČKEJTE! SPECIÁLNÍ NABÍDKA · **SL:** POČAKAJTE! POSEBNA PONUDBA

### heading — "Complete Your Look"
- **PL:** Dopełnij Swój Look · **CS:** Dokončete Svůj Look · **SL:** Dopolnite Svoj Videz

### subheading — "Add our professional makeup brush to your order"
- **PL:** Dodaj do zamówienia nasz profesjonalny pędzel do makijażu
- **CS:** Přidejte si k objednávce náš profesionální kosmetický štětec
- **SL:** Naročilu dodajte naš profesionalni čopič za ličenje

### cta_text — "YES, ADD FOR 30% OFF"
- **PL:** TAK, DODAJ Z 30% ZNIŻKĄ · **CS:** ANO, PŘIDAT SE SLEVOU 30 % · **SL:** DA, DODAJ S 30 % POPUSTA

### skip_text — "No thanks"
- **PL:** Nie, dziękuję · **CS:** Ne, děkuji · **SL:** Ne, hvala

---

# 10) Generic theme strings to also check (likely in locales/*.json or other sections)
These commonly appear on the PDP via theme defaults — verify they're translated under
Translate & Adapt → Theme → "Default" / locale, or add `locales/pl.json`, `cs.json`, `sl.json`:
- "Add to cart" / "Sold out" / "Cart" / "Checkout" / "Quantity"
- "Shop all" (hero button), "Browse our latest products" (hero text) — only if that hero shows to customers.

| EN | PL | CS | SL |
|---|---|---|---|
| Shop all | Zobacz wszystko | Zobrazit vše | Poglej vse |
| Browse our latest products | Przeglądaj nasze najnowsze produkty | Prohlédněte si naše nejnovější produkty | Prebrskajte naše najnovejše izdelke |
| Sold out | Wyprzedane | Vyprodáno | Razprodano |
| Cart | Koszyk | Košík | Košarica |
| Checkout | Do kasy | Pokladna | Na blagajno |
| Quantity | Ilość | Množství | Količina |
