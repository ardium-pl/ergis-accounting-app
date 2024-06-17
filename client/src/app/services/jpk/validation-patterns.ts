export const RejZValidationPatterns: RegExp[] = [
  /Lp\s+Referencja\s+Paczka\s+Typ Numer\s+VAT\s+Dostawca\s+Kw opodatk\s+VAT\s+%VAT\s+Kwota VAT\s+Razem/,
  /Faktura\s+Data fak\s+Data pod\s+PLP_DUTY_\s+Na dzie.\s+Kod/,
  /Wyj.cie: RejZ\d{4}/,
];

export const PZNValidationPatterns: RegExp[] = [
  /Zlec\.\s+Dostawca\s+Projekt/,
  /Dok PZ\s+Nr indeksu\s+Data wys.\s+Przyj.to\s+Koszt KG\s+Zewn koszt ZZ/,
  /Nr spec wys\s+Lp Opcja ERS\s+przyj\.\s+Dok dost\s+Ty\s+Koszt ZZ\s+Wa\s+Wyl koszt KG\s+zewn podatek ZZ\s+Odch KG-ZZ\s+Partia dostawcy/,
  /Wyj.cie: PZ\d{4}N/
];

export const WNPZValidationPatterns: RegExp[] = [
  /Lp\s+Referencja\s+Paczka\s+Typ Numer\s+VAT\s+Dostawca\s+Kw opodatk\s+VAT\s+%VAT\s+Kwota VAT\s+Razem/,
  /Faktura\s+Data fak\s+Data pod\s+Na dzie.\s+Data wp.ywu\s+Kod/,
  /PZ\s+.{2,}\s+\d\d\/\d\d\/\d\d\s+\d{1,3}(,\d{3})*\.\d+[a-z]+\s+[a-z]+\s+\d{1,3}(,\d{3})*\.\d+/i,
  /Wyj.cie: WN\d{4}PZ/,
];

export const MAPZValidationPatterns: RegExp[] = [
  /Lp\s+Referencja\s+Paczka\s+Typ Numer\s+VAT\s+Dostawca\s+Kw opodatk\s+VAT\s+%VAT\s+Kwota VAT\s+Razem/,
  /Faktura\s+Data fak\s+Data pod\s+Na dzie.\s+Data wp.ywu\s+Kod/,
  /PZ\s+.{2,}\s+\d\d\/\d\d\/\d\d\s+\d{1,3}(,\d{3})*\.\d+[a-z]+\s+[a-z]+\s+\d{1,3}(,\d{3})*\.\d+/i,
  /Wyj.cie: MA\d{4}PZ/,
];
