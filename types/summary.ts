// types/summary.ts

// Tämä tiedosto sisältää tyypit, jotka liittyvät päivä- ja viikkoyhteenvetotietoihin.

// Päivä- ja viikkoyhteenveto
export interface WorkSummary {
  hours: number;
  minutes: number;
  targetMinutes?: number; // Tavoite minuuteissa, jos määritetty

  //Keskiarvot
  avgLoad?: number;       // Kuormitus
  avgStress1?: number; // Palautuminen
  avgStress2?: number; // Merkityksellisyys

  goalDiff: number;
}

//toinen versio, joka käyttää minuutteja ja laskee keskiarvot erikseen. Mietitään käytetäänkö
/*export interface WorkSummary {
    totalMinutes: number;

    averageStress: number;

    averageWorkload: number;

    targetMinutes?: number;

    goalDiff?: number;
}*/