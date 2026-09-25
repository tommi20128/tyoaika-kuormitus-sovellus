# Työajan ja kuormituksen seurantasovellus

Tämä projekti on OAMK:n opinnäytetyönä toteutettu mobiilisovellus työajan ja työkuormituksen seurantaan, joka tehtiin parityönä.

Sovelluksen tavoitteena on tarjota työntekijälle helppo tapa kirjata päivittäinen työaika sekä arvioida omaa työkuormitusta ja palautumista. Esihenkilö voi tarkastella työntekijöiden tekemiä merkintöjä ja seurata työkuormituksen kehittymistä.

## Teknologiat

* React Native
* Expo
* TypeScript
* Firebase Authentication
* Cloud Firestore

Sovellus koostuu mobiilikäyttöliittymästä ja Firebase-taustapalveluista. Käyttäjien tunnistamiseen käytetään Firebase Authenticationia ja sovelluksen tiedot tallennetaan Cloud Firestoreen.

## Tietokanta

Firestore-tietokannassa käyttäjät tallennetaan `users`-kokoelmaan. Jokaisella käyttäjällä on oma `workEntries`-alikokoelmansa, johon työaikamerkinnät tallennetaan.

Työaikamerkinnän päivämäärää käytetään dokumentin tunnisteena, joten jokaiselle päivälle muodostuu oma merkintänsä.

## Projektin käynnistäminen

Asenna projektin riippuvuudet:

```bash
npm install
```

Käynnistä Expo-kehityspalvelin:

```bash
npx expo start
```

Sovellusta voidaan testata esimerkiksi Android-emulaattorilla tai fyysisellä mobiililaitteella Expo Go -sovelluksen avulla.

## Opinnäytetyö (parityö)

Projekti on toteutettu osana OAMK:n tieto- ja viestintätekniikan insinöörin opinnäytetyötä.

Vastuualueisiini kuuluivat muun muassa navigoinnin, työntekijäpuolen, komponenttien, hookkien, utilsien sekä tyyppien suunnittelu ja toteutus. Lisäksi ratkoin esihenkilöpuolen ongelmia.
