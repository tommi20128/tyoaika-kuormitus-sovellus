// types/profile.ts

// Sisältää tyypit käyttäjätiedoille, joita käytetään profiilisivulla

// Käyttäjätiedot, joita käytetään profiilisivulla
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  manager: string;
}