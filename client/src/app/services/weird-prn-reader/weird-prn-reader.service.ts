import { Injectable } from '@angular/core';
import { RejZItem } from './rejz';
import { MAPZItem } from './mapz';
import { WNPZItem } from './wnpz';
import { PZNItem } from './pzn';

@Injectable({
  providedIn: 'root',
})
export class WeirdPrnReaderService {
  constructor() {
    const ret = this
      .readPZN(`ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  1                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56877 10020773 FLEXIPAL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400661               1 Z901A00100         24/04/02           700.0           36.00           25200.00        24500.00      -700.00
                          1                 24/04/02             0.0           35.00                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  25200.00        24500.00      -700.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56926 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400243               1 Z906A01000         24/04/03         2,016.0            4.52            9112.32         8527.68      -584.64
                          1                 24/04/03             0.0            4.23                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   9112.32         8527.68      -584.64
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56929 10007472 Mona
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400688               1 z905h00900         24/04/08         4,765.0            2.45           11674.25        11674.25         0.00
                          1                 24/04/08             0.0            2.45                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  11674.25        11674.25         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56930 10007472 Mona
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400253               1 Z902B00100         24/04/08         6,120.0            0.52            3182.40         3182.40         0.00
                          1                 24/04/08             0.0            0.52                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   3182.40         3182.40         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56931 10003285 AGRA WOOD Polska Sp. z o.o.
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  2                                                    ERGIS S.A.                                              Czas: 02:51:45
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400250               1 Z901B00500         24/04/04           351.0           57.50           20182.50        20182.50         0.00
                          1                 24/04/04             0.0           57.50                               0.00
J2400250               2 Z901B04600         24/04/04            75.0           29.30            2197.50         2197.50         0.00
                          1                 24/04/04             0.0           29.30                               0.00
J2400250               3 Z901A00700         24/04/04            81.0           64.00            5184.00         5184.00         0.00
                          1                 24/04/04             0.0           64.00                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  27564.00        27564.00         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56934 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400256               1 Z906A01050         24/04/08         2,184.0            4.33            9456.72         9458.47         1.75
                          1                 24/04/08             0.0          4.3308                               0.00
J2400260               1 Z906A01050         24/04/09         2,184.0            4.33            9456.72         9458.47         1.75
                          1                 24/04/09             0.0          4.3308                               0.00
J2400274               1 Z906A01050         24/04/15         2,182.0            4.33            9448.06         9449.81         1.75
                          1                 24/04/15             0.0          4.3308                               0.00
J2400282               1 Z906A01050         24/04/17         2,182.0            4.33            9448.06         9449.81         1.75
                          1                 24/04/17             0.0          4.3308                               0.00
J2400291               1 Z906A01050         24/04/22         2,184.0            4.33            9456.72         9458.47         1.75
                          1                 24/04/22             0.0          4.3308                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  47266.28        47275.03         8.75
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56935 10E00024 GRASO
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400659               1 Z907O00300         24/04/02         6,000.0            1.05            6300.00         6780.00       480.00
                          1                 24/04/02             0.0            1.13                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   6300.00         6780.00       480.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56945 10003285 AGRA WOOD Polska Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400671               1 Z901B03800         24/04/04           540.0           36.60           19764.00        19764.00         0.00
                          1                 24/04/04             0.0           36.60                               0.00
F2400671               2 Z901B04000         24/04/04           232.0           43.70           10138.40        10138.40         0.00
                          1                 24/04/04             0.0           43.70                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  3                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56945 10003285 AGRA WOOD Polska Sp. z o.o.                                                                           * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  29902.40        29902.40         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56968 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400262               1 Z906A01000         24/04/10         1,920.0            4.23            8121.60         8121.60         0.00
                          1                 24/04/10             0.0            4.23                               0.00
J2400269               1 Z906A01000         24/04/12         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/12             0.0            4.23                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  18679.68        18679.68         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56988 10003285 AGRA WOOD Polska Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400249               1 Z901B04700         24/04/04            75.0           32.50            2437.50         2475.00        37.50
                          1                 24/04/04             0.0           33.00                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   2437.50         2475.00        37.50
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56991 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400244               1 Z906A03000         24/04/03           360.0            7.75            2790.00         2764.80       -25.20
                          1                 24/04/03             0.0            7.68                               0.00
J2400244               2 Z906A05550         24/04/03           260.0            7.25            1885.00         1866.80       -18.20
                          1                 24/04/03             0.0            7.18                               0.00
J2400263               1 Z906A03000         24/04/10           216.0            7.68            1658.88         1658.88         0.00
                          1                 24/04/10             0.0            7.68                               0.00
J2400263               2 Z906A05550         24/04/10           312.0            7.18            2240.16         2240.16         0.00
                          1                 24/04/10             0.0            7.18                               0.00
J2400263               3 Z906A06300         24/04/10           144.0           13.15            1893.60         1893.60         0.00
                          1                 24/04/10             0.0           13.15                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  4                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56991 10000293 Tarnopak Jas�o                                                                                        * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  10467.64        10424.24       -43.40
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56993 10020773 FLEXIPAL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400769               1 Z901A00100         24/04/18           700.0           36.00           25200.00        24500.00      -700.00
                          1                 24/04/18             0.0           35.00                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  25200.00        24500.00      -700.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako56994 10024452 TPD Frankowski
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400704               1 Z901B04000         24/04/10           324.0           43.70           14158.80        12895.20     -1263.60
                          1                 24/04/10             0.0           39.80                               0.00
F2400704               2 Z901B03800         24/04/10           630.0           36.60           23058.00        21861.00     -1197.00
                          1                 24/04/10             0.0           34.70                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  37216.80        34756.20     -2460.60
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57002 10022526 Basell Sales&Marketing Co.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400242               1 Z410A00100         24/04/02            25.0           16.87 T           421.75          417.19        -4.56
                          1                 24/04/02             0.0        16.68749                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3009                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                    421.75          417.19        -4.56
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57008 10E00024 GRASO
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  5                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57008 10E00024 GRASO
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400867               1 Z907O00100         24/04/29           898.0            6.45            5792.10         7588.10      1796.00
                          1                 24/04/29             0.0            8.45                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   5792.10         7588.10      1796.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57009 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400287               1 Z906A01000         24/04/19         2,304.0            4.23            9745.92         9745.92         0.00
                          1                 24/04/19             0.0            4.23                               0.00
J2400287               2 Z906A03000         24/04/19           288.0            7.68            2211.84         2211.84         0.00
                          1                 24/04/19             0.0            7.68                               0.00
J2400287               4 Z906A05550         24/04/19           156.0            7.18            1120.08         1120.08         0.00
                          1                 24/04/19             0.0            7.18                               0.00
J2400297               1 Z906A01000         24/04/24         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/24             0.0            4.23                               0.00
J2400307               1 Z906A01000         24/04/26         2,112.0            4.23            8933.76         8933.76         0.00
                          1                 24/04/26             0.0            4.23                               0.00
J2400307               3 Z906A06300         24/04/26            96.0           13.15            1262.40         1262.40         0.00
                          1                 24/04/26             0.0           13.15                               0.00
J2400307               4 Z906A05550         24/04/26           104.0            7.18             746.72          746.72         0.00
                          1                 24/04/26             0.0            7.18                               0.00
J2400316               1 Z906A01000         24/04/30         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/30             0.0            4.23                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  45136.88        45136.88         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57010 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400320               1 Z906A01050         24/04/30         2,184.0            4.33            9456.72         9458.47         1.75
                          1                 24/04/30             0.0          4.3308                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   9456.72         9458.47         1.75
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57011 10021824 Sanex Sp.z.o.o w �owcach
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  6                                                    ERGIS S.A.                                              Czas: 02:51:45
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400742               1 z905d01800         24/04/15         1,080.0            8.52            9201.60         8283.60      -918.00
                          1                 24/04/15             0.0            7.67                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   9201.60         8283.60      -918.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57014 10e01207 Markus Sajewicz Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400806               1 Z901A01200         24/04/23           100.0           56.50            5650.00         5650.00         0.00
                          1                 24/04/23             0.0           56.50                               0.00
F2400806               2 Z901B04000         24/04/23           330.0           43.70           14421.00        14190.00      -231.00
                          1                 24/04/23             0.0           43.00                               0.00
F2400806               3 Z901B03800         24/04/23           495.0           36.60           18117.00        18760.50       643.50
                          1                 24/04/23             0.0           37.90                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  38188.00        38600.50       412.50
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57021 10020671 Grabex Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400826               1 Z901A00100         24/04/25           754.0           36.00           27144.00        27521.00       377.00
                          1                 24/04/25             0.0           36.50                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  27144.00        27521.00       377.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57022 10024452 TPD Frankowski
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400852               1 Z901B04000         24/04/29           324.0           43.70           14158.80        12895.20     -1263.60
                          1                 24/04/29             0.0           39.80                               0.00
F2400852               2 Z901B03800         24/04/29           630.0           36.60           23058.00        21861.00     -1197.00
                          1                 24/04/29             0.0           34.70                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  37216.80        34756.20     -2460.60
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57033 10022862 Best Meble
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  7                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57033 10022862 Best Meble
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400280               1 Z903A01100         24/04/16           200.0           27.50            5500.00         5500.00         0.00
                          1                 24/04/16             0.0           27.50                               0.00
J2400280               2 Z903A01200         24/04/16           150.0           19.80            2970.00         2970.00         0.00
                          1                 24/04/16             0.0           19.80                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   8470.00         8470.00         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57034 10022862 Best Meble
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400750               1 Z903A01300         24/04/16           100.0           27.50            2750.00         2750.00         0.00
                          1                 24/04/16             0.0           27.50                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   2750.00         2750.00         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57048 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400308               1 Z905A00600         24/04/26         2,040.0           2.781            5673.24         6283.20       609.96
                          1                 24/04/26             0.0            3.08                               0.00
J2400308               2 Z905A02900         24/04/26         1,060.0            4.08            4324.80         3657.00      -667.80
                          1                 24/04/26             0.0            3.45                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   9998.04         9940.20       -57.84
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57052 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400284               1 Z906A01000         24/04/18         1,824.0            4.23            7715.52         7715.52         0.00
                          1                 24/04/18             0.0            4.23                               0.00
J2400284               2 Z906A06300         24/04/18           288.0           13.15            3787.20         3787.20         0.00
                          1                 24/04/18             0.0           13.15                               0.00
J2400284               3 Z906A05550         24/04/18           312.0            7.18            2240.16         2240.16         0.00
                          1                 24/04/18             0.0            7.18                               0.00
J2400284               4 Z903A00550         24/04/18           150.0           24.60            3690.00         3690.00         0.00
                          1                 24/04/18             0.0           24.60                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  8                                                    ERGIS S.A.                                              Czas: 02:51:45

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57052 10000293 Tarnopak Jas�o                                                                                        * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  17432.88        17432.88         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57059 10003285 AGRA WOOD Polska Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400318               1 Z901B04600         24/04/30            75.0           29.30            2197.50         2197.50         0.00
                          1                 24/04/30             0.0           29.30                               0.00
J2400318               2 Z901B00500         24/04/30           486.0           57.50           27945.00        27945.00         0.00
                          1                 24/04/30             0.0           57.50                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  30142.50        30142.50         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57060 10017429 Hitmark Sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400283               1 Z313A00100         24/04/17            12.0          668.26            8019.12         4009.56     -4009.56
                          1                 24/04/17             0.0          334.13                               0.00
J2400283               2 Z313A00200         24/04/17             4.8          217.54            1044.19         1044.24         0.05
                          1                 24/04/17             0.0          217.55                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   9063.31         5053.80     -4009.51
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57069 10003106 PWK S.C. A.Mamrot
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400848               1 Z907N00200         24/04/26             1.0           45.00              45.00           45.00         0.00
                          1                 24/04/26             0.0           45.00                               0.00
F2400848               2 Z907N00300         24/04/26           120.0            8.49            1018.80         1018.80         0.00
                          1                 24/04/26             0.0            8.49                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   1063.80         1063.80         0.00
                                                                                                                 0.00


ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  9                                                    ERGIS S.A.                                              Czas: 02:51:45
Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
ako57078 10000293 Tarnopak Jas�o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400292               1 Z906A01000         24/04/23         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/23             0.0            4.23                               0.00
J2400305               1 Z906A01000         24/04/25         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/25             0.0            4.23                               0.00
J2400311               1 Z906A01000         24/04/29         2,496.0            4.23           10558.08        10558.08         0.00
                          1                 24/04/29             0.0            4.23                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  31674.24        31674.24         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56304 12000648 2pack GmbH Verpackungen
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400261               1 Z907E01400         24/04/10       -32,500.0            0.24 T         -7800.00        -6408.43      1391.57
                          1                 24/04/10             0.0         0.19718                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  -7800.00        -6408.43      1391.57
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56308 12000648 2pack GmbH Verpackungen
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400702               1 Z907E01400         24/04/09       348,000.0            0.24 T         83520.00        69043.61    -14476.39
                          1                 24/04/09             0.0          0.1984                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400717               1 Z907E01400         24/04/11      -348,000.0            0.24 T        -83520.00       -68779.08     14740.92
                          1                 24/04/11             0.0         0.19764                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                      0.00          264.53       264.53
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56372 10005926 GM COLOR Sp.z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400668               1 Z211A00900         24/04/03         1,250.0           20.56 T         25700.00        25223.73      -476.27
                          1                 24/04/03             0.0        20.17898                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  10                                                   ERGIS S.A.                                              Czas: 02:52:11
         Kurs wym:EUR 1.0 = PLN 4.2934                                                            
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400783               1 Z211A00900         24/04/19         1,250.0           20.22 T         25275.00        25444.04       169.04
                          1                 24/04/19             0.0        20.35523                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400865               1 Z211A00900         24/04/29         1,250.0           20.22 T         25275.00        25394.69       119.69
                          1                 24/04/29             0.0        20.31575                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  76250.00        76062.46      -187.54
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56808 12000648 2pack GmbH Verpackungen
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400267               1 Z907E01400         24/04/11       348,000.0            0.24 T         83520.00        82297.47     -1222.53
                          1                 24/04/11             0.0         0.23649                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  83520.00        82297.47     -1222.53
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56846 10025008 EXXONMOBIL PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400665               1 Z201A00100         24/04/03        24,760.0          5.1137 T        126615.21       140322.05     13706.84
cmr                       1                 24/04/03             0.0         5.66729                               0.00
         Kurs wym:eur 1.0 = PLN 4.2934                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 126615.21       140322.05     13706.84
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56847 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400662               1 Z203A00100         24/04/02        24,440.0          5.3896 T        131721.82       149261.87     17540.05
cmr                       1                 24/04/02             0.0         6.10728                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3009                                                            
                                                                                                   ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  11                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56847 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 131721.82       149261.87     17540.05
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56849 12E00537 EXXONMOBIL BE
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400714               1 Z203A00200         24/04/11       -23,300.0            5.50 T       -128150.00      -116353.90     11796.10
                          1                 24/04/11             0.0         4.99373                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400715               1 Z203A00200         24/04/11       -24,750.0            5.50 T       -136125.00      -123594.81     12530.19
                          1                 24/04/11             0.0         4.99373                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400716               1 Z203A00200         24/04/11       -23,375.0            5.50 T       -128562.50      -116728.46     11834.04
                          1                 24/04/11             0.0         4.99373                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                -392837.50      -356677.17     36160.33
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56851 10009251 DOW EUROPE ES
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400660               1 Z206B00100         24/04/02        23,375.0            7.54 T        176247.50       164061.70    -12185.80
                          1                 24/04/02             0.0         7.01868                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3009                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 176247.50       164061.70    -12185.80
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56862 10023217 Vanden Recycling Ltd
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400248               1 Z304C00100         24/04/04        21,872.0            2.54 T         55554.88        58206.34      2651.46
                          1                 24/04/04             0.0         2.66123                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  12                                                   ERGIS S.A.                                              Czas: 02:52:12
         Kurs wym:EUR 1.0 = PLN 4.2923                                                            
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400255               1 Z304C00100         24/04/08        20,458.0            2.54 T         51963.32        54392.63      2429.31
                          1                 24/04/08             0.0         2.65875                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
J2400272               1 Z304C00100         24/04/15        20,403.0            2.54 T         51823.62        53971.89      2148.27
                          1                 24/04/15             0.0         2.64529                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
J2400286               1 Z304C00100         24/04/18        20,160.0            2.54 T         51206.40        54187.78      2981.38
                          1                 24/04/18             0.0         2.68789                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
J2400300               1 Z304C00100         24/04/24        20,080.0            2.54 T         51003.20        53950.34      2947.14
                          1                 24/04/24             0.0         2.68677                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3335                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 261551.42       274708.98     13157.56
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56888 10025154 Eco-Ergis sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400239               1 Z305A00100         24/04/02        18,612.0          2.6873           50016.03        50252.40       236.37
                          1                 24/04/02             0.0            2.70                               0.00
J2400240               1 Z305A00100         24/04/02        19,591.0          2.6873           52646.89        52895.70       248.81
                          1                 24/04/02             0.0            2.70                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 102662.92       103148.10       485.18
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56906 10005926 GM COLOR Sp.z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400268               1 Z310A00500         24/04/11         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/11             0.0           15.20                               0.00
J2400275               1 Z310A00500         24/04/15         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/15             0.0           15.20                               0.00
J2400288               1 Z310A00500         24/04/19         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/19             0.0           15.20                               0.00
J2400301               1 Z310A00500         24/04/24         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/24             0.0           15.20                               0.00
J2400306               1 Z310A00500         24/04/25         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/25             0.0           15.20                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  13                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56906 10005926 GM COLOR Sp.z o.o.                                                                                    * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  95000.00        95000.00         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56955 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400295               1 Z905D00300         24/04/23         8,180.0            1.82           14887.60        14887.60         0.00
                          1                 24/04/23             0.0            1.82                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  14887.60        14887.60         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56956 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400685               2 Z905H00500         24/04/05         2,536.0            1.29            3271.44         3271.44         0.00
                          1                 24/04/05             0.0            1.29                               0.00
F2400685               4 Z905D00700         24/04/05         6,290.0            1.62           10189.80        10189.80         0.00
                          1                 24/04/05             0.0            1.62                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  13461.24        13461.24         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56957 10022973 EUROBOX Polska Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400877               1 z905d00600         24/04/30         5,045.0            1.47            7416.15         7259.76      -156.39
                          1                 24/04/30             0.0           1.439                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   7416.15         7259.76      -156.39
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56965 10025008 EXXONMOBIL PL
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  14                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400666               1 Z201A00100         24/04/03        24,440.0          5.1137 T        124978.83       138508.52     13529.69
cmr                       1                 24/04/03             0.0         5.66729                               0.00
         Kurs wym:eur 1.0 = PLN 4.2934                                                            
                                                                                                   
F2400667               1 Z201A00100         24/04/03        24,420.0          5.1137 T        124876.55       138395.17     13518.62
cmr                       1                 24/04/03             0.0         5.66729                               0.00
         Kurs wym:eur 1.0 = PLN 4.2934                                                            
                                                                                                   
F2400670               1 Z201A00100         24/04/04        24,620.0          5.1137 T        125899.29       139492.88     13593.59
cmr                       1                 24/04/04             0.0         5.66584                               0.00
         Kurs wym:eur 1.0 = PLN 4.2923                                                            
                                                                                                   
F2400678               1 Z201A00100         24/04/05        24,900.0          5.1137 T        127331.13       141072.74     13741.61
cmr                       1                 24/04/05             0.0         5.66557                               0.00
         Kurs wym:eur 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400680               1 Z201A00100         24/04/05        24,760.0          5.1137 T        126615.21       140279.56     13664.35
cmr                       1                 24/04/05             0.0         5.66557                               0.00
         Kurs wym:eur 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400690               1 Z201A00100         24/04/08        24,520.0          5.1137 T        125387.92       138796.83     13408.91
CMR                       1                 24/04/08             0.0         5.66056                               0.00
         Kurs wym:eur 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400693               1 Z201A00100         24/04/08        24,680.0          5.1137 T        126206.12       139702.52     13496.40
CMR                       1                 24/04/08             0.0         5.66056                               0.00
         Kurs wym:eur 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400694               1 Z201A00100         24/04/08        24,680.0          5.1137 T        126206.12       139702.52     13496.40
cmr                       1                 24/04/08             0.0         5.66056                               0.00
         Kurs wym:eur 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400700               1 Z201A00100         24/04/09        24,800.0          4.9355 T        122400.40       140126.45     17726.05
cmr                       1                 24/04/09             0.0         5.65026                               0.00
         Kurs wym:eur 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400705               1 Z201A00100         24/04/10        24,940.0          4.9355 T        123091.37       140203.10     17111.73
cmr                       1                 24/04/10             0.0         5.62162                               0.00
         Kurs wym:eur 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400706               1 Z201A00100         24/04/10        24,900.0          4.9355 T        122893.95       139978.24     17084.29
cmr                       1                 24/04/10             0.0         5.62162                               0.00
         Kurs wym:eur 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400713               1 Z201A00100         24/04/11        24,360.0          4.9355 T        120228.78       137112.99     16884.21
cmr                       1                 24/04/11             0.0         5.62861                               0.00
         Kurs wym:eur 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400719               1 Z201A00100         24/04/11        24,740.0          4.9355 T        122104.27       139251.86     17147.59
cmr                       1                 24/04/11             0.0         5.62861                               0.00
         Kurs wym:eur 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400726               1 Z201A00100         24/04/12        24,880.0          4.9355 T        122795.24       140066.14     17270.90
cmr                       1                 24/04/12             0.0         5.62967                               0.00
         Kurs wym:eur 1.0 = PLN 4.2649                                                            
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  15                                                   ERGIS S.A.                                              Czas: 02:52:12
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400727               1 Z201A00100         24/04/12        24,780.0          4.9355 T        122301.69       139503.17     17201.48
cmr                       1                 24/04/12             0.0         5.62967                               0.00
         Kurs wym:eur 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400730               1 Z201A00100         24/04/12        25,260.0          4.9355 T        124670.73       142205.41     17534.68
cmr                       1                 24/04/12             0.0         5.62967                               0.00
         Kurs wym:eur 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400739               1 Z201A00100         24/04/15        25,320.0          4.9355 T        124966.86       142600.01     17633.15
cmr                       1                 24/04/15             0.0         5.63191                               0.00
         Kurs wym:eur 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400751               1 Z201A00100         24/04/16        24,980.0          4.9355 T        123288.79       141295.17     18006.38
cmr                       1                 24/04/16             0.0         5.65633                               0.00
         Kurs wym:eur 1.0 = PLN 4.2851                                                            
                                                                                                   
F2400753               1 Z201A00100         24/04/16        24,720.0          4.9355 T        122005.56       139824.53     17818.97
cmr                       1                 24/04/16             0.0         5.65633                               0.00
         Kurs wym:eur 1.0 = PLN 4.2851                                                            
                                                                                                   
F2400757               1 Z201A00100         24/04/17        24,760.0          4.9355 T        122202.98       141181.62     18978.64
cmr                       1                 24/04/17             0.0           5.702                               0.00
         Kurs wym:eur 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400760               1 Z201A00100         24/04/17        24,540.0          4.9355 T        121117.17       139927.18     18810.01
cmr                       1                 24/04/17             0.0           5.702                               0.00
         Kurs wym:eur 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400766               1 Z201A00100         24/04/18        24,300.0          4.9355 T        119932.65       139059.08     19126.43
CMR                       1                 24/04/18             0.0          5.7226                               0.00
         Kurs wym:eur 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400767               1 Z201A00100         24/04/18        24,580.0          4.9355 T        121314.59       140661.41     19346.82
CMR                       1                 24/04/18             0.0          5.7226                               0.00
         Kurs wym:eur 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400770               1 Z201A00100         24/04/18        24,640.0          4.9355 T        121610.72       141004.77     19394.05
CMR                       1                 24/04/18             0.0          5.7226                               0.00
         Kurs wym:eur 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400775               1 Z201A00100         24/04/18       -24,640.0          4.9355 T       -121610.72      -141004.77    -19394.05
cmr                       1                 24/04/18             0.0          5.7226                               0.00
         Kurs wym:eur 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400776               1 Z201A00100         24/04/18        24,640.0          4.9355 T        121610.72       141004.77     19394.05
cmr                       1                 24/04/18             0.0          5.7226                               0.00
         Kurs wym:eur 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400778               1 Z201A00100         24/04/19        24,840.0          4.9355 T        122597.82       142005.01     19407.19
cmr                       1                 24/04/19             0.0         5.71679                               0.00
         Kurs wym:eur 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400782               1 Z201A00100         24/04/19        24,560.0          4.9355 T        121215.88       140404.31     19188.43
cmr                       1                 24/04/19             0.0         5.71679                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  16                                                   ERGIS S.A.                                              Czas: 02:52:12
         Kurs wym:eur 1.0 = PLN 4.3309                                                            
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400791               1 Z201A00100         24/04/22        24,460.0          4.9355 T        120722.33       139855.24     19132.91
cmr                       1                 24/04/22             0.0         5.71771                               0.00
         Kurs wym:eur 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400792               1 Z201A00100         24/04/22        24,620.0          4.9355 T        121512.01       140770.07     19258.06
cmr                       1                 24/04/22             0.0         5.71771                               0.00
         Kurs wym:eur 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400794               1 Z201A00100         24/04/22        24,380.0          4.9355 T        120327.49       139397.82     19070.33
cmr                       1                 24/04/22             0.0         5.71771                               0.00
         Kurs wym:eur 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400797               1 Z201A00100         24/04/22        24,880.0          4.9355 T        122795.24       142256.67     19461.43
cmr                       1                 24/04/22             0.0         5.71771                               0.00
         Kurs wym:eur 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400804               1 Z201A00100         24/04/23        24,700.0          4.9355 T        121906.85       140859.06     18952.21
cmr                       1                 24/04/23             0.0          5.7028                               0.00
         Kurs wym:eur 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400810               1 Z201A00100         24/04/23        25,020.0          4.9355 T        123486.21       142683.96     19197.75
CMR                       1                 24/04/23             0.0          5.7028                               0.00
         Kurs wym:eur 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400811               1 Z201A00100         24/04/23       -25,020.0          4.9355 T       -123486.21      -142683.96    -19197.75
CMR                       1                 24/04/24             0.0          5.7028                               0.00
         Kurs wym:eur 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400812               1 Z201A00100         24/04/23        25,020.0          4.9355 T        123486.21       142683.96     19197.75
CMR                       1                 24/04/24             0.0          5.7028                               0.00
         Kurs wym:eur 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400814               1 Z201A00100         24/04/24        24,900.0          4.9355 T        122893.95       142433.48     19539.53
cmr                       1                 24/04/24             0.0         5.72022                               0.00
         Kurs wym:eur 1.0 = PLN 4.3335                                                            
                                                                                                   
F2400815               1 Z201A00100         24/04/24        24,580.0          4.9355 T        121314.59       140603.01     19288.42
cmr                       1                 24/04/24             0.0         5.72022                               0.00
         Kurs wym:eur 1.0 = PLN 4.3335                                                            
                                                                                                   
F2400816               1 Z201A00100         24/04/24        24,920.0          4.9355 T        122992.66       142547.88     19555.22
cmr                       1                 24/04/24             0.0         5.72022                               0.00
         Kurs wym:eur 1.0 = PLN 4.3335                                                            
                                                                                                   
F2400823               1 Z201A00100         24/04/25        25,340.0          4.9355 T        125065.57       144421.88     19356.31
cmr                       1                 24/04/25             0.0         5.69936                               0.00
         Kurs wym:eur 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400824               1 Z201A00100         24/04/25        24,900.0          4.9355 T        122893.95       141914.16     19020.21
cmr                       1                 24/04/25             0.0         5.69936                               0.00
         Kurs wym:eur 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400828               1 Z201A00100         24/04/25        25,300.0          4.9355 T        124868.15       144193.91     19325.76
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  17                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
cmr                       1                 24/04/25             0.0         5.69936                               0.00
         Kurs wym:eur 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400832               1 Z201A00100         24/04/25        24,620.0          4.9355 T        121512.01       140318.34     18806.33
cmr                       1                 24/04/25             0.0         5.69936                               0.00
         Kurs wym:eur 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400839               1 Z201A00100         24/04/26        24,620.0          4.9355 T        121512.01       140386.59     18874.58
CMR                       1                 24/04/26             0.0         5.70214                               0.00
         Kurs wym:eur 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400841               1 Z201A00100         24/04/26        24,940.0          4.9355 T        123091.37       142211.27     19119.90
cmr                       1                 24/04/26             0.0         5.70214                               0.00
         Kurs wym:eur 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400842               1 Z201A00100         24/04/26        24,820.0          4.9355 T        122499.11       141527.02     19027.91
cmr                       1                 24/04/26             0.0         5.70214                               0.00
         Kurs wym:eur 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400856               1 Z201A00100         24/04/29        24,680.0          4.9355 T        121808.14       140816.68     19008.54
cmr                       1                 24/04/29             0.0          5.7057                               0.00
         Kurs wym:eur 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400864               1 Z201A00100         24/04/29        24,820.0          4.9355 T        122499.11       141615.47     19116.36
cmr                       1                 24/04/29             0.0          5.7057                               0.00
         Kurs wym:eur 1.0 = PLN 4.3225                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                5411941.37      6191173.70    779232.33
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56967 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400672               1 Z203A00100         24/04/04        24,120.0          5.3896 T        129997.15       147012.99     17015.84
cmr                       1                 24/04/04             0.0         6.09507                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2923                                                            
                                                                                                   
F2400674               1 Z203A00100         24/04/04        24,980.0          5.3896 T        134632.21       152254.75     17622.54
CMR                       1                 24/04/04             0.0         6.09507                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2923                                                            
                                                                                                   
F2400676               1 Z203A00100         24/04/05        24,760.0          5.3896 T        133446.50       150906.80     17460.30
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400677               1 Z203A00100         24/04/05        24,720.0          5.3896 T        133230.91       150663.01     17432.10
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400679               1 Z203A00100         24/04/05        24,360.0          5.3896 T        131290.66       148468.89     17178.23
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  18                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400681               1 Z203A00100         24/04/05        24,960.0          5.3896 T        134524.42       152125.76     17601.34
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400683               1 Z203A00100         24/04/05        24,480.0          5.3896 T        131937.41       149200.26     17262.85
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400684               1 Z203A00100         24/04/05        24,440.0          5.3896 T        131721.82       148956.47     17234.65
cmr                       1                 24/04/05             0.0         6.09478                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400691               1 Z203A00100         24/04/08        24,120.0          5.3896 T        129997.15       146875.99     16878.84
CMR                       1                 24/04/08             0.0         6.08939                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400692               1 Z203A00100         24/04/08        24,760.0          5.3896 T        133446.50       150773.20     17326.70
CMR                       1                 24/04/08             0.0         6.08939                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400695               1 Z203A00100         24/04/08        25,040.0          5.3896 T        134955.58       152478.23     17522.65
CMR                       1                 24/04/08             0.0         6.08939                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400698               1 Z203A00100         24/04/09        24,040.0          5.3588 T        128825.55       146122.57     17297.02
cmr                       1                 24/04/09             0.0         6.07831                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400699               1 Z203A00100         24/04/09        24,780.0          5.3588 T        132791.06       150620.52     17829.46
cmr                       1                 24/04/09             0.0         6.07831                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400701               1 Z203A00100         24/04/09        24,240.0          5.3588 T        129897.31       147338.23     17440.92
cmr                       1                 24/04/09             0.0         6.07831                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400703               1 Z203A00100         24/04/10        23,980.0          5.3588 T        128504.02       145018.95     16514.93
cmr                       1                 24/04/10             0.0          6.0475                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400707               1 Z203A00100         24/04/10        23,880.0          5.3588 T        127968.14       144414.20     16446.06
cmr                       1                 24/04/10             0.0          6.0475                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400711               1 Z203A00100         24/04/10        24,440.0          5.3588 T        130969.07       147800.80     16831.73
CMR                       1                 24/04/10             0.0          6.0475                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400720               1 Z203A00100         24/04/11        24,220.0          5.3588 T        129790.14       146652.63     16862.49
cmr                       1                 24/04/11             0.0         6.05502                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  19                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400732               1 Z203A00100         24/04/12        24,320.0          5.3588 T        130326.02       147285.76     16959.74
cmr                       1                 24/04/12             0.0         6.05616                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400738               1 Z203A00100         24/04/15        24,720.0          5.3588 T        132469.54       149767.90     17298.36
cmr                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400740               1 Z203A00100         24/04/15        24,340.0          5.3588 T        130433.19       147465.64     17032.45
cmr                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400741               1 Z203A00100         24/04/15        24,000.0          5.3588 T        128611.20       145405.73     16794.53
cmr                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400743               1 Z203A00100         24/04/15        24,240.0          5.3588 T        129897.31       146859.79     16962.48
cmr                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400745               1 Z203A00100         24/04/15        24,160.0          5.3588 T        129468.61       146375.10     16906.49
CMR                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400746               1 Z203A00100         24/04/15        24,280.0          5.3588 T        130111.66       147102.13     16990.47
CMR                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400747               1 Z203A00100         24/04/15        24,120.0          5.3588 T        129254.26       146132.76     16878.50
CMR                       1                 24/04/15             0.0         6.05857                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400759               1 Z203A00100         24/04/17        24,420.0          5.3588 T        130861.90       149791.65     18929.75
cmr                       1                 24/04/17             0.0         6.13397                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400768               1 Z203A00100         24/04/18        24,340.0          5.3588 T        130433.19       149840.11     19406.92
CMR                       1                 24/04/18             0.0         6.15613                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400779               1 Z203A00100         24/04/19        25,540.0          5.3588 T        136863.75       157067.88     20204.13
cmr                       1                 24/04/19             0.0         6.14988                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400780               1 Z203A00100         24/04/19        24,140.0          5.3588 T        129361.43       148458.05     19096.62
cmr                       1                 24/04/19             0.0         6.14988                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400795               1 Z203A00100         24/04/22        23,940.0          5.3588 T        128289.67       147251.88     18962.21
cmr                       1                 24/04/22             0.0         6.15087                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400799               1 Z203A00100         24/04/22        24,600.0          5.3588 T        131826.48       151311.45     19484.97
CMR                       1                 24/04/22             0.0         6.15087                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3316                                                            
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  20                                                   ERGIS S.A.                                              Czas: 02:52:12
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400805               1 Z203A00100         24/04/23        23,840.0          5.3588 T        127753.79       146254.25     18500.46
cmr                       1                 24/04/23             0.0         6.13483                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400822               1 Z203A00100         24/04/25        24,800.0          5.3588 T        132898.24       152052.12     19153.88
cmr                       1                 24/04/25             0.0         6.13113                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400829               1 Z203A00100         24/04/25        24,480.0          5.3588 T        131183.42       150090.16     18906.74
cmr                       1                 24/04/25             0.0         6.13113                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400830               1 Z203A00100         24/04/25        24,380.0          5.3588 T        130647.54       149477.05     18829.51
cmr                       1                 24/04/25             0.0         6.13113                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400847               1 Z203A00100         24/04/26        25,140.0          5.3588 T        134720.23       154211.68     19491.45
cmr                       1                 24/04/26             0.0         6.13412                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400850               1 Z203A00100         24/04/26        24,480.0          5.3588 T        131183.42       150163.16     18979.74
CMR                       1                 24/04/26             0.0         6.13412                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400855               1 Z203A00100         24/04/29        24,360.0          5.3588 T        130540.37       149520.46     18980.09
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400857               1 Z203A00100         24/04/29        24,500.0          5.3588 T        131290.60       150379.78     19089.18
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400859               1 Z203A00100         24/04/29        24,300.0          5.3588 T        130218.84       149152.19     18933.35
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400860               1 Z203A00100         24/04/29        24,360.0          5.3588 T        130540.37       149520.46     18980.09
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400863               1 Z203A00100         24/04/29        24,600.0          5.3588 T        131826.48       150993.57     19167.09
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400869               1 Z203A00100         24/04/29        25,000.0          5.3588 T        133970.00       153448.75     19478.75
cmr                       1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400875               1 Z203A00100         24/04/30        24,720.0          5.3588 T        132469.54       151607.27     19137.73
cmr                       1                 24/04/30             0.0         6.13298                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
F2400880               1 Z203A00100         24/04/30        24,040.0          5.3588 T        128825.55       147436.84     18611.29
cmr                       1                 24/04/30             0.0         6.13298                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  21                                                   ERGIS S.A.                                              Czas: 02:52:12
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400884               1 Z203A00100         24/04/30        23,680.0          5.3588 T        126896.38       145228.97     18332.59
CMR                       1                 24/04/30             0.0         6.13298                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                6161098.58      7007336.79    846238.21
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56970 10025008 EXXONMOBIL PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400669               1 Z217A00200         24/04/03        24,360.0          5.2566 T        128050.78       143807.43     15756.65
cmr                       1                 24/04/03             0.0         5.90343                               0.00
         Kurs wym:eur 1.0 = PLN 4.2934                                                            
                                                                                                   
F2400752               1 Z217A00200         24/04/16        24,820.0          5.2233 T        129642.31       146239.75     16597.44
cmr                       1                 24/04/16             0.0         5.89201                               0.00
         Kurs wym:eur 1.0 = PLN 4.2851                                                            
                                                                                                   
F2400785               1 Z217A00200         24/04/19        24,260.0          5.2233 T        126717.26       144468.00     17750.74
cmr                       1                 24/04/19             0.0         5.95499                               0.00
         Kurs wym:eur 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400872               1 Z217A00200         24/04/29        24,540.0          5.2233 T        128179.78       145851.96     17672.18
CMR                       1                 24/04/29             0.0         5.94344                               0.00
         Kurs wym:eur 1.0 = PLN 4.3225                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 512590.13       580367.14     67777.01
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56973 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400664               1 Z203A00200         24/04/03        23,375.0            5.48 T        128095.00       144014.07     15919.07
                          1                 24/04/03             0.0         6.16103                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2934                                                            
                                                                                                   
F2400687               1 Z203A00200         24/04/08        23,375.0            5.48 T        128095.00       143843.00     15748.00
                          1                 24/04/08             0.0         6.15371                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400735               1 Z203A00200         24/04/12        23,375.0            5.50 T        128562.50       143058.10     14495.60
                          1                 24/04/12             0.0         6.12013                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  22                                                   ERGIS S.A.                                              Czas: 02:52:12
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400771               1 Z203A00200         24/04/18        23,375.0            5.50 T        128562.50       145419.53     16857.03
                          1                 24/04/18             0.0         6.22116                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 513315.00       576334.70     63019.70
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56974 10009251 DOW EUROPE ES
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400682               1 Z206B00100         24/04/05        23,375.0            7.54 T        176247.50       175573.72      -673.78
                          1                 24/04/05             0.0         7.51118                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400689               1 Z206B00100         24/04/08        23,375.0            7.54 T        176247.50       175418.27      -829.23
                          1                 24/04/08             0.0         7.50453                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2883                                                            
                                                                                                   
F2400723               1 Z206B00100         24/04/12        23,375.0            7.42 T        173442.50       174461.07      1018.57
                          1                 24/04/12             0.0         7.46358                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400731               1 Z206B00100         24/04/12        23,375.0            7.42 T        173442.50       174461.07      1018.57
                          1                 24/04/12             0.0         7.46358                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400733               1 Z206B00100         24/04/12        23,375.0            7.42 T        173442.50       174461.07      1018.57
                          1                 24/04/12             0.0         7.46358                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400765               1 Z206B00100         24/04/18        23,375.0            7.42 T        173442.50       177340.87      3898.37
                          1                 24/04/18             0.0         7.58678                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400793               1 Z206B00100         24/04/22        23,375.0            7.42 T        173442.50       177189.51      3747.01
                          1                 24/04/22             0.0          7.5803                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400796               1 Z206B00100         24/04/22        23,375.0            7.42 T        173442.50       177189.51      3747.01
                          1                 24/04/22             0.0          7.5803                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400834               1 Z206B00100         24/04/25        23,375.0            7.42 T        173442.50       176620.92      3178.42
                          1                 24/04/25             0.0         7.55598                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                1566592.50      1582716.01     16123.51
                                                                                                                 0.00

ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  23                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56982 10004690 Schumacher Packaging Sp. z o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400658               3 Z905A08700         24/04/02         1,680.0            1.38            2318.40         2325.12         6.72
                          1                 24/04/02             0.0           1.384                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   2318.40         2325.12         6.72
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56986 10003526 Borealis AG Austria
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400772               1 Z401A00500         24/04/18        23,750.0            7.82 T        185725.00       177611.82     -8113.18
                          1                 24/04/18             0.0         7.47839                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 185725.00       177611.82     -8113.18
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56987 10003526 Borealis AG Austria
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400758               1 Z401A00100         24/04/17        24,860.0          6.8446 T        170156.76       165914.06     -4242.70
cmr                       1                 24/04/17             0.0         6.67394                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400784               1 Z401A00100         24/04/19        24,980.0          6.8446 T        170978.11       167147.19     -3830.92
cmr                       1                 24/04/19             0.0         6.69124                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400817               1 Z401A00100         24/04/24        24,940.0          6.8446 T        170704.32       166979.72     -3724.60
cmr                       1                 24/04/24             0.0         6.69526                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3335                                                            
                                                                                                   
F2400882               1 Z401A00100         24/04/30        24,760.0          6.8446 T        169472.30       165219.89     -4252.41
cmr                       1                 24/04/30             0.0         6.67286                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 681311.49       665260.86    -16050.63
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56992 10024650 GATNER dawniej JANMAR
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  24                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56992 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400270               1 Z905D02100         24/04/12         1,062.0            1.14            1210.68         1210.68         0.00
                          1                 24/04/12             0.0            1.14                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   1210.68         1210.68         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56995 12E00537 EXXONMOBIL BE
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400764               1 Z206A00100         24/04/18         8,950.0          7.9253 T         70931.44        73721.78      2790.34
                          1                 24/04/18             0.0         8.23707                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
F2400764               2 Z206A00300         24/04/18        15,000.0            8.22 T        123300.00       123556.05       256.05
                          1                 24/04/18             0.0         8.23707                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3353                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 194231.44       197277.83      3046.39
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc56997 10025294 Ter Chemicals CEE GMBH
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400252               1 Z211A00600         24/04/05         6,850.0           25.18 T        172483.00       169643.11     -2839.89
                          1                 24/04/05             0.0        24.76542                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 172483.00       169643.11     -2839.89
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57006 10025143 TECH-PLAST RECYCLING Sp zoo
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400241               1 Z2301000J2         24/04/02        18,114.0            2.90           52530.60        52530.60         0.00
                          1                 24/04/02             0.0            2.90                               0.00
J2400278               1 Z2301000J2         24/04/16        20,729.0            2.90           60114.10        60114.10         0.00
                          1                 24/04/16             0.0            2.90                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  25                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57006 10025143 TECH-PLAST RECYCLING Sp zoo                                                            * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400298               1 Z2301000J2         24/04/24        19,361.0            2.90           56146.90        56146.90         0.00
                          1                 24/04/24             0.0            2.90                               0.00
J2400299               1 Z2301000J2         24/04/24       -19,361.0            2.90          -56146.90       -56146.90         0.00
                          1                 24/04/24             0.0            2.90                               0.00
J2400310               1 Z2301000J2         24/04/26        21,622.0            2.90           62703.80        62703.80         0.00
                          1                 24/04/26             0.0            2.90                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 175348.50       175348.50         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57007 10025154 Eco-Ergis sp. z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400245               1 Z305A00100         24/04/03        18,527.0          2.6873           49787.61        50022.90       235.29
                          1                 24/04/03             0.0            2.70                               0.00
J2400246               1 Z305A00100         24/04/03        19,259.0          2.6873           51754.71        51999.30       244.59
                          1                 24/04/03             0.0            2.70                               0.00
J2400247               1 Z305A00100         24/04/04        20,313.0          2.6873           54587.12        54845.10       257.98
                          1                 24/04/04             0.0            2.70                               0.00
J2400251               1 Z305A00100         24/04/05        19,815.0          2.6873           53248.85        53500.50       251.65
                          1                 24/04/05             0.0            2.70                               0.00
J2400254               1 Z305A00100         24/04/08        18,547.0          2.6873           49841.35        50076.90       235.55
                          1                 24/04/08             0.0            2.70                               0.00
J2400257               1 Z305A00100         24/04/08        19,741.0          2.6873           53049.99        53300.70       250.71
                          1                 24/04/08             0.0            2.70                               0.00
J2400258               1 Z305A00100         24/04/09        18,244.0          2.7807           50731.09        49258.80     -1472.29
                          1                 24/04/09             0.0            2.70                               0.00
J2400259               1 Z305A00100         24/04/09        18,261.0          2.7807           50778.36        49304.70     -1473.66
                          1                 24/04/09             0.0            2.70                               0.00
J2400264               1 Z305A00100         24/04/10        18,178.0          2.7807           50547.56        49080.60     -1466.96
                          1                 24/04/10             0.0            2.70                               0.00
J2400265               1 Z305A00100         24/04/10        19,419.0          2.7807           53998.41        52431.30     -1567.11
                          1                 24/04/10             0.0            2.70                               0.00
J2400266               1 Z305A00100         24/04/11        18,997.0          2.7807           52824.96        51291.90     -1533.06
                          1                 24/04/11             0.0            2.70                               0.00
J2400271               1 Z305A00100         24/04/15        18,636.0          2.7807           51821.13        50317.20     -1503.93
                          1                 24/04/15             0.0            2.70                               0.00
J2400273               1 Z305A00100         24/04/15        17,780.0          2.7807           49440.85        48006.00     -1434.85
                          1                 24/04/15             0.0            2.70                               0.00
J2400276               1 Z305A00100         24/04/15        18,536.0          2.7807           51543.06        50047.20     -1495.86
                          1                 24/04/15             0.0            2.70                               0.00
J2400277               1 Z305A00100         24/04/16        18,466.0          2.7807           51348.41        49858.20     -1490.21
                          1                 24/04/16             0.0            2.70                               0.00
J2400279               1 Z305A00100         24/04/16        19,504.0          2.7807           54234.77        52660.80     -1573.97
                          1                 24/04/16             0.0            2.70                               0.00
J2400281               1 Z305A00100         24/04/17        18,019.0          2.7807           50105.43        48651.30     -1454.13
                          1                 24/04/17             0.0            2.70                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  26                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57007 10025154 Eco-Ergis sp. z o.o.                                                                   * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400285               1 Z305A00100         24/04/18        19,339.0          2.7807           53775.96        52215.30     -1560.66
                          1                 24/04/18             0.0            2.70                               0.00
J2400289               1 Z305A00100         24/04/19        17,637.0          2.7807           49043.21        47619.90     -1423.31
                          1                 24/04/19             0.0            2.70                               0.00
J2400290               1 Z305A00100         24/04/22        18,519.0          2.7807           51495.78        50001.30     -1494.48
                          1                 24/04/22             0.0            2.70                               0.00
J2400293               1 Z305A00100         24/04/23        18,272.0          2.7807           50808.95        49334.40     -1474.55
                          1                 24/04/23             0.0            2.70                               0.00
J2400294               1 Z305A00100         24/04/23        18,136.0          2.7807           50430.78        48967.20     -1463.58
                          1                 24/04/23             0.0            2.70                               0.00
J2400296               1 Z305A00100         24/04/24        17,936.0          2.7807           49874.64        48427.20     -1447.44
                          1                 24/04/24             0.0            2.70                               0.00
J2400303               1 Z305A00100         24/04/25        19,804.0          2.7807           55068.98        53470.80     -1598.18
                          1                 24/04/25             0.0            2.70                               0.00
J2400304               1 Z305A00100         24/04/25        20,913.0          2.7807           58152.78        56465.10     -1687.68
                          1                 24/04/25             0.0            2.70                               0.00
J2400309               1 Z305A00100         24/04/26        19,363.0          2.7807           53842.69        52280.10     -1562.59
                          1                 24/04/26             0.0            2.70                               0.00
J2400312               1 Z305A00100         24/04/29        19,578.0          2.7807           54440.54        52860.60     -1579.94
                          1                 24/04/29             0.0            2.70                               0.00
J2400314               1 Z305A00100         24/04/29        18,972.0          2.7807           52755.44        51224.40     -1531.04
                          1                 24/04/29             0.0            2.70                               0.00
J2400315               1 Z305A00100         24/04/29        17,962.0          2.7807           49946.93        48497.40     -1449.53
                          1                 24/04/29             0.0            2.70                               0.00
J2400317               1 Z305A00100         24/04/30        19,024.0          2.7807           52900.04        51364.80     -1535.24
                          1                 24/04/30             0.0            2.70                               0.00
J2400319               1 Z305A00100         24/04/30        19,212.0          2.7807           53422.81        51872.40     -1550.41
                          1                 24/04/30             0.0            2.70                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                1615603.19      1579254.30    -36348.89
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57016 12E00537 EXXONMOBIL BE
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400737               1 Z206A00400         24/04/12        24,000.0            6.87 T        164880.00       179125.80     14245.80
                          1                 24/04/12             0.0         7.46358                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 164880.00       179125.80     14245.80
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57018 10004690 Schumacher Packaging Sp. z o
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  27                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57018 10004690 Schumacher Packaging Sp. z o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400718               1 z905a04900         24/04/11         1,680.0            1.09            1831.20         1831.20         0.00
                          1                 24/04/11             0.0            1.09                               0.00
F2400724               1 z905a04900         24/04/12         1,560.0            1.09            1700.40         1700.40         0.00
                          1                 24/04/12             0.0            1.09                               0.00
F2400724               2 Z905A05600         24/04/12         4,230.0            1.29            5456.70         5435.55       -21.15
                          1                 24/04/12             0.0           1.285                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   8988.30         8967.15       -21.15
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57019 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400725               1 Z905A07800         24/04/12         2,077.0            1.74            3613.98         3094.73      -519.25
                          1                 24/04/12             0.0            1.49                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   3613.98         3094.73      -519.25
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57027 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400843               1 Z905D00700         24/04/26         6,291.0            1.62           10191.42        10191.42         0.00
                          1                 24/04/26             0.0            1.62                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  10191.42        10191.42         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57029 10024650 GATNER dawniej JANMAR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400844               1 Z905D01200         24/04/26         3,089.0            2.15            6641.35         6641.35         0.00
                          1                 24/04/26             0.0            2.15                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   6641.35         6641.35         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57035 10023597 LG Chem Europe GmbH NIP PL
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  28                                                   ERGIS S.A.                                              Czas: 02:52:12

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57035 10023597 LG Chem Europe GmbH NIP PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400729               1 Z203A00100         24/04/12        23,750.0          5.3588 T        127271.50       121043.19     -6228.31
                          1                 24/04/12             0.0         5.09656                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400736               1 Z203A00100         24/04/12        23,750.0          5.3588 T        127271.50       121043.19     -6228.31
                          1                 24/04/12             0.0         5.09656                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
F2400744               1 Z203A00100         24/04/15        23,750.0          5.3588 T        127271.50       121091.44     -6180.06
                          1                 24/04/15             0.0         5.09859                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2666                                                            
                                                                                                   
F2400749               1 Z203A00100         24/04/16        23,750.0          5.3588 T        127271.50       121616.49     -5655.01
                          1                 24/04/16             0.0         5.12069                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2851                                                            
                                                                                                   
F2400756               1 Z203A00100         24/04/17        23,750.0          5.3588 T        127271.50       122598.49     -4673.01
                          1                 24/04/17             0.0         5.16204                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400761               1 Z203A00100         24/04/17        23,750.0          5.3588 T        127271.50       122598.49     -4673.01
                          1                 24/04/17             0.0         5.16204                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400777               1 Z203A00100         24/04/19        23,750.0          5.3588 T        127271.50       122916.36     -4355.14
                          1                 24/04/19             0.0         5.17543                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400789               1 Z203A00100         24/04/22        23,750.0          5.3588 T        127271.50       122936.22     -4335.28
                          1                 24/04/22             0.0         5.17626                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3316                                                            
                                                                                                   
F2400807               1 Z203A00100         24/04/23        23,750.0          5.3588 T        127271.50       122615.51     -4655.99
                          1                 24/04/23             0.0         5.16276                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400809               1 Z203A00100         24/04/23        23,750.0          5.3588 T        127271.50       122615.51     -4655.99
                          1                 24/04/23             0.0         5.16276                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400818               1 Z203A00100         24/04/24        23,750.0          5.3588 T        127271.50       122990.15     -4281.35
                          1                 24/04/24             0.0         5.17853                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3335                                                            
                                                                                                   
F2400833               1 Z203A00100         24/04/25        23,750.0          5.3588 T        127271.50       122541.72     -4729.78
                          1                 24/04/25             0.0         5.15965                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                1527258.00      1466606.76    -60651.24
                                                                                                                 0.00

ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  29                                                   ERGIS S.A.                                              Czas: 02:52:12
Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57036 10023597 LG Chem Europe GmbH NIP PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400728               1 Z2301000F4         24/04/12        22,200.0            5.14 T        114108.00       113143.53      -964.47
                          1                 24/04/12             0.0         5.09656                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2649                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 114108.00       113143.53      -964.47
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57037 10025143 TECH-PLAST RECYCLING Sp zoo
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400790               1 Z2301000F1         24/04/22        18,564.0            4.50           83538.00        83538.00         0.00
                          1                 24/04/22             0.0            4.50                               0.00
F2400836               1 Z2301000F1         24/04/26        16,449.0            4.50           74020.50        74020.50         0.00
                          1                 24/04/26             0.0            4.50                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 157558.50       157558.50         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57040 10004690 Schumacher Packaging Sp. z o
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400763               1 z905a04900         24/04/18         3,080.0            1.09            3357.20         3357.20         0.00
                          1                 24/04/18             0.0            1.09                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   3357.20         3357.20         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57041 10E00002 SABIC EUROPE PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400813               1 Z401A00100         24/04/24        24,750.0          6.8446 T        169403.85       166243.89     -3159.96
                          1                 24/04/24             0.0         6.71693                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3335                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 169403.85       166243.89     -3159.96
                                                                                                                 0.00


ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  30                                                   ERGIS S.A.                                              Czas: 02:52:12
Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57043 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400708               1 Z203A00200         24/04/10        23,375.0            5.50 T        128562.50       142853.48     14290.98
                          1                 24/04/10             0.0         6.11138                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400709               1 Z203A00200         24/04/10        24,750.0            5.50 T        136125.00       151256.61     15131.61
                          1                 24/04/10             0.0         6.11138                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
F2400710               1 Z203A00200         24/04/10        23,300.0            5.50 T        128150.00       142395.11     14245.11
                          1                 24/04/10             0.0         6.11138                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2588                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 392837.50       436505.20     43667.70
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57046 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400831               1 Z203A00100         24/04/25        23,375.0          5.3588 T        125261.95       143315.26     18053.31
                          1                 24/04/25             0.0         6.13113                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400840               1 Z203A00100         24/04/26        23,375.0          5.3588 T        125261.95       143384.96     18123.01
                          1                 24/04/26             0.0         6.13412                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400845               1 Z203A00100         24/04/26        23,375.0          5.3588 T        125261.95       143384.96     18123.01
                          1                 24/04/26             0.0         6.13412                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400849               1 Z203A00100         24/04/26        23,375.0          5.3588 T        125261.95       143384.96     18123.01
                          1                 24/04/26             0.0         6.13412                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400853               1 Z203A00100         24/04/29        23,375.0          5.3588 T        125261.95       143474.58     18212.63
                          1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400858               1 Z203A00100         24/04/29        23,375.0          5.3588 T        125261.95       143474.58     18212.63
                          1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400861               1 Z203A00100         24/04/29        23,375.0          5.3588 T        125261.95       143474.58     18212.63
                          1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400866               1 Z203A00100         24/04/29        23,375.0          5.3588 T        125261.95       143474.58     18212.63
                          1                 24/04/29             0.0         6.13795                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  31                                                   ERGIS S.A.                                              Czas: 02:52:12
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400868               1 Z203A00100         24/04/29        23,375.0          5.3588 T        125261.95       143474.58     18212.63
                          1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400870               1 Z203A00100         24/04/29        24,750.0          5.3588 T        132630.30       151914.26     19283.96
                          1                 24/04/29             0.0         6.13795                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400874               1 Z203A00100         24/04/30        23,375.0          5.3588 T        125261.95       143358.41     18096.46
                          1                 24/04/30             0.0         6.13298                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
F2400881               1 Z203A00100         24/04/30        24,375.0          5.3588 T        130620.75       149491.39     18870.64
                          1                 24/04/30             0.0         6.13298                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                1515870.55      1735607.10    219736.55
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57049 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400774               1 Z203A01100         24/04/19        23,375.0            5.63 T        131601.25       133638.02      2036.77
                          1                 24/04/19             0.0         5.71713                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 131601.25       133638.02      2036.77
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57053 12E00538 EXXONMOBIL FR
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400781               1 Z203A01700         24/04/19        24,250.0            5.73 T        138952.50       141103.32      2150.82
                          1                 24/04/19             0.0         5.81869                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 138952.50       141103.32      2150.82
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57055 10024650 GATNER dawniej JANMAR
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  32                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400808               1 z905a06300         24/04/23         2,097.0            1.04            2180.88         2097.00       -83.88
                          1                 24/04/23             0.0            1.00                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   2180.88         2097.00       -83.88
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57057 10E00002 SABIC EUROPE PL
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400825               1 Z201A00100         24/04/25        24,750.0          4.9355 T        122153.63       121823.91      -329.72
                          1                 24/04/25             0.0         4.92218                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3177                                                            
                                                                                                   
F2400838               1 Z201A00100         24/04/26        24,750.0          4.9355 T        122153.63       121883.16      -270.47
                          1                 24/04/26             0.0         4.92457                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400871               1 Z201A00100         24/04/29        24,750.0          4.9355 T        122153.63       121959.34      -194.29
                          1                 24/04/29             0.0         4.92765                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400876               1 Z201A00100         24/04/30        24,750.0          4.9355 T        122153.63       121860.59      -293.04
                          1                 24/04/30             0.0         4.92366                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
F2400879               1 Z201A00100         24/04/30        24,750.0          4.9355 T        122153.63       121860.59      -293.04
                          1                 24/04/30             0.0         4.92366                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 610768.15       609387.59     -1380.56
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57070 10005926 GM COLOR Sp.z o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
J2400302               1 Z310A00500         24/04/24         1,250.0           15.20           19000.00        19000.00         0.00
                          1                 24/04/24             0.0           15.20                               0.00
J2400313               1 Z310A00500         24/04/29         2,500.0           15.20           38000.00        38000.00         0.00
                          1                 24/04/29             0.0           15.20                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  57000.00        57000.00         0.00
                                                                                                                 0.00


ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  33                                                   ERGIS S.A.                                              Czas: 02:52:12
Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57071 12E00537 EXXONMOBIL BE
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400802               1 Z206A00400         24/04/23        24,000.0            6.87 T        164880.00       166234.43      1354.43
                          1                 24/04/23             0.0         6.92643                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 164880.00       166234.43      1354.43
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57074 10024871 TFP SP. Z O.O.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400819               1 Z905A05300         24/04/24         2,968.0            1.07            3175.76         3190.60        14.84
                          1                 24/04/24             0.0           1.075                               0.00
F2400819               2 Z905A05600         24/04/24         3,006.0            1.29            3877.74         3847.68       -30.06
                          1                 24/04/24             0.0            1.28                               0.00
F2400819               3 z905A05000         24/04/24         3,124.0            1.19            3717.56         3708.19        -9.37
                          1                 24/04/24             0.0           1.187                               0.00
F2400819               4 z905a07700         24/04/24         3,009.0            1.49            4483.41         4212.60      -270.81
                          1                 24/04/24             0.0            1.40                               0.00
F2400819               5 Z905A07310         24/04/24         1,996.0            1.80            3592.80         3592.80         0.00
                          1                 24/04/24             0.0            1.80                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  18847.27        18551.87      -295.40
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57075 10019936 Polyplast M�ller GmbH
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400803               1 Z410B00400         24/04/23         3,300.0            9.29 T         30657.00        32933.65      2276.65
                          1                 24/04/23             0.0         9.97989                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  30657.00        32933.65      2276.65
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57079 12000795 JM TRADE JERZY MR�Z
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400827               1 Z304B00800         24/04/25        18,247.0            2.90           52916.30        52916.30         0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  34                                                   ERGIS S.A.                                              Czas: 02:52:12
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                          1                 24/04/25             0.0            2.90                               0.00
F2400862               1 Z304B00800         24/04/29        19,674.0            2.90           57054.60        57054.60         0.00
                          1                 24/04/29             0.0            2.90                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 109970.90       109970.90         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57081 10024871 TFP SP. Z O.O.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400820               1 Z905A08400         24/04/24         2,004.0            1.25            2505.00         2605.20       100.20
                          1                 24/04/24             0.0            1.30                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                   2505.00         2605.20       100.20
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57086 12E00537 EXXONMOBIL BE
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400883               1 Z206A00400         24/04/30        24,000.0            6.87 T        164880.00       165849.60       969.60
                          1                 24/04/30             0.0          6.9104                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 164880.00       165849.60       969.60
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
amc57091 10009251 DOW EUROPE ES
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400878               1 Z206B00100         24/04/30        23,375.0            7.42 T        173442.50       177683.66      4241.16
                          1                 24/04/30             0.0         7.60144                               0.00
         Kurs wym:EUR 1.0 = PLN 4.319                                                             
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                 173442.50       177683.66      4241.16
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57005 10008597 Corex Sosnowiec daw.Corenso
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  35                                                   ERGIS S.A.                                              Czas: 02:53:18
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400663               1 Z906C02500         24/04/02         6,466.0            4.46           28838.36        28838.36         0.00
                          1                 24/04/02             0.0            4.46                               0.00
F2400663               2 Z906C03900         24/04/02         5,519.0            4.25           23455.75        23455.75         0.00
                          1                 24/04/02             0.0            4.25                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  52294.11        52294.11         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57013 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400675               1 Z906C02500         24/04/05         2,300.0            4.46 T         10258.00        11253.89       995.89
                          1                 24/04/05             0.0         4.89299                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400675               2 Z906C01000         24/04/05         2,628.0            4.97 T         13061.16        12745.99      -315.17
                          1                 24/04/05             0.0         4.85007                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400675               3 Z906A03700         24/04/05         7,040.0            0.87 T          6124.80         6451.20       326.40
                          1                 24/04/05             0.0         0.91636                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400675               4 Z906A03500         24/04/05         7,040.0            0.78 T          5491.20         5738.11       246.91
                          1                 24/04/05             0.0         0.81507                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
F2400675               5 Z906A06400         24/04/05         6,174.0            1.40 T          8643.60         8455.95      -187.65
                          1                 24/04/05             0.0         1.36961                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2921                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  43578.76        44645.14      1066.38
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57015 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400673               1 z906c02800         24/04/04           462.0            9.00            4158.00         4158.00         0.00
                          1                 24/04/04             0.0            9.00                               0.00
F2400673               2 Z906A03500         24/04/04         9,855.0            0.78            7686.90         7686.90         0.00
                          1                 24/04/04             0.0            0.78                               0.00
F2400673               3 Z906C04200         24/04/04         6,622.0            4.28           28342.16        28342.16         0.00
                          1                 24/04/04             0.0            4.28                               0.00
F2400673               4 Z906C04300         24/04/04           693.0            8.65            5994.45         5994.45         0.00
                          1                 24/04/04             0.0            8.65                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  36                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57015 10008597 Corex Sosnowiec daw.Corenso                                                                           * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  46181.51        46181.51         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57017 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400686               1 Z906C03100         24/04/05           231.0            6.33            1462.23         1462.23         0.00
                          1                 24/04/05             0.0            6.33                               0.00
F2400686               2 Z906A03700         24/04/05        14,079.0            0.87           12248.73        12248.73         0.00
                          1                 24/04/05             0.0            0.87                               0.00
F2400686               3 Z906C04200         24/04/05         1,655.0            4.28            7083.40         7083.40         0.00
                          1                 24/04/05             0.0            4.28                               0.00
F2400686               4 Z906C04500         24/04/05         5,520.0            4.28           23625.60        23625.60         0.00
                          1                 24/04/05             0.0            4.28                               0.00
F2400846               2 Z906A03700         24/04/26        -1,408.0          0.8629           -1214.96        -1224.96       -10.00
                          1                 24/04/26             0.0            0.87                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  43205.00        43195.00       -10.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57023 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400697               1 z906c00400         24/04/09         5,256.0           5.375 T         28251.00        28122.89      -128.11
                          1                 24/04/09             0.0         5.35063                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400697               2 z906a03700         24/04/09        11,264.0          0.8629 T          9719.71        10125.27       405.56
                          1                 24/04/09             0.0         0.89891                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
F2400697               3 Z906A06400         24/04/09         8,232.0          1.3721 T         11295.13        11275.86       -19.27
                          1                 24/04/09             0.0         1.36976                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2805                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  49265.84        49524.02       258.18
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57024 10008597 Corex Sosnowiec daw.Corenso
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  37                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57024 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400696               1 z906c02500         24/04/08         5,543.0            4.46           24721.78        24721.78         0.00
                          1                 24/04/08             0.0            4.46                               0.00
F2400696               2 z906a03700         24/04/08         8,447.0            0.87            7348.89         7348.89         0.00
                          1                 24/04/08             0.0            0.87                               0.00
F2400696               3 z906a04100         24/04/08         7,040.0            1.03            7251.20         7251.20         0.00
                          1                 24/04/08             0.0            1.03                               0.00
F2400696               4 z906C04200         24/04/08           551.0            4.28            2358.28         2358.28         0.00
                          1                 24/04/08             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  41680.15        41680.15         0.00
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57038 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400712               1 z906c02500         24/04/10         5,542.0           4.456           24695.15        24695.15         0.00
                          1                 24/04/10             0.0           4.456                               0.00
F2400712               2 Z906C03900         24/04/10         2,208.0          4.2446            9372.08         9372.08         0.00
                          1                 24/04/10             0.0          4.2446                               0.00
F2400712               3 Z906C04200         24/04/10         4,416.0            4.28           18900.48        18900.48         0.00
                          1                 24/04/10             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  52967.71        52967.71         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57039 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400721               1 z906c00400         24/04/11         2,628.0           5.375 T         14125.50        14007.57      -117.93
                          1                 24/04/11             0.0         5.33013                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400721               2 z906c00500         24/04/11           438.0            5.12 T          2242.56         1905.03      -337.53
                          1                 24/04/11             0.0         4.34938                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400721               3 Z906A03700         24/04/11         7,040.0          0.8629 T          6074.82         6304.05       229.23
                          1                 24/04/11             0.0         0.89546                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
F2400721               4 Z906A04100         24/04/11        11,264.0          1.0248 T         11543.35        12007.71       464.36
                          1                 24/04/11             0.0         1.06603                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  38                                                   ERGIS S.A.                                              Czas: 02:53:18
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400721               5 Z906A04200         24/04/11         4,928.0          1.2255 T          6039.26         6093.91        54.65
                          1                 24/04/11             0.0         1.23659                               0.00
         Kurs wym:EUR 1.0 = PLN 4.2641                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  40025.49        40318.27       292.78
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57045 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400722               1 z906c02500         24/04/11         6,468.0           4.456           28821.41        28821.41         0.00
                          1                 24/04/11             0.0           4.456                               0.00
F2400722               2 Z906A03700         24/04/11         7,040.0          0.8629            6074.82         6406.40       331.58
                          1                 24/04/11             0.0            0.91                               0.00
F2400722               3 Z906C03900         24/04/11         2,760.0          4.2446           11715.10        11702.40       -12.70
                          1                 24/04/11             0.0            4.24                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  46611.33        46930.21       318.88
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57051 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400734               1 z906c02500         24/04/12         4,153.0           4.456           18505.77        18522.38        16.61
                          1                 24/04/12             0.0            4.46                               0.00
F2400734               2 Z906C04200         24/04/12         2,760.0            4.28           11812.80        11812.80         0.00
                          1                 24/04/12             0.0            4.28                               0.00
F2400734               3 Z906C03900         24/04/12         2,760.0          4.2446           11715.10        11702.40       -12.70
                          1                 24/04/12             0.0            4.24                               0.00
F2400734               4 Z906C04400         24/04/12           552.0          6.5075            3592.14         3781.20       189.06
                          1                 24/04/12             0.0            6.85                               0.00
F2400734               5 Z906C04500         24/04/12         1,656.0            4.28            7087.68         7087.68         0.00
                          1                 24/04/12             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  52713.49        52906.46       192.97
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57056 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400748               1 z906c02500         24/04/15         7,386.0           4.456           32912.02        32912.02         0.00
                          1                 24/04/15             0.0           4.456                               0.00
F2400748               2 z906c03100         24/04/15           692.0          6.3299            4380.29         4608.72       228.43
                          1                 24/04/15             0.0            6.66                               0.00
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  39                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57056 10008597 Corex Sosnowiec daw.Corenso                                                            * Kontynuu *
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400748               3 Z906C03900         24/04/15         2,759.0          4.2446           11710.85        11710.85         0.00
                          1                 24/04/15             0.0          4.2446                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  49003.16        49231.59       228.43
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57066 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400754               1 z906c02500         24/04/16         9,237.0           4.456           41160.07        41197.02        36.95
                          1                 24/04/16             0.0            4.46                               0.00
F2400754               2 Z906A04100         24/04/16         5,630.0          1.0248            5769.62         6080.40       310.78
                          1                 24/04/16             0.0            1.08                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  46929.69        47277.42       347.73
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57067 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400755               1 z906c02600         24/04/17         3,024.0           2.709 T          8192.02         8621.43       429.41
                          1                 24/04/17             0.0           2.851                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400755               2 z906a03700         24/04/17         5,632.0          0.8629 T          4859.85         5109.00       249.15
                          1                 24/04/17             0.0         0.90714                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400755               3 z906a03500         24/04/17        16,896.0            0.78 T         13178.88        13867.27       688.39
                          1                 24/04/17             0.0         0.82074                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
F2400755               4 z906a04100         24/04/17         2,816.0          1.0248 T          2885.84         3162.71       276.87
                          1                 24/04/17             0.0         1.12312                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3197                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  29116.59        30760.41      1643.82
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57073 10008597 Corex Sosnowiec daw.Corenso
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  40                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57073 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400762               1 z906c02500         24/04/17         6,928.0           4.456           30871.17        30871.17         0.00
                          1                 24/04/17             0.0           4.456                               0.00
F2400762               2 Z906A07500         24/04/17         1,406.0          0.9407            1322.62         1322.62         0.00
                          1                 24/04/17             0.0          0.9407                               0.00
F2400762               3 Z906C04300         24/04/17           276.0          8.6494            2387.23         2387.23         0.00
                          1                 24/04/17             0.0          8.6494                               0.00
F2400762               4 Z906C04500         24/04/17         3,864.0            4.28           16537.92        16537.92         0.00
                          1                 24/04/17             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  51118.94        51118.94         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57076 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400786               1 z906c01000         24/04/19         1,314.0           4.859 T          6384.73         6430.61        45.88
                          1                 24/04/19             0.0         4.89392                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400786               2 Z906A03700         24/04/19        15,488.0          0.8629 T         13364.60        14086.17       721.57
                          1                 24/04/19             0.0         0.90949                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
F2400786               3 Z906A06400         24/04/19        20,580.0          1.3721 T         28237.82        28521.58       283.76
                          1                 24/04/19             0.0         1.38589                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3309                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  47987.15        49038.36      1051.21
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57077 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400773               1 z906c02500         24/04/18         6,465.0           4.456           28808.04        28808.04         0.00
                          1                 24/04/18             0.0           4.456                               0.00
F2400773               2 Z906A03500         24/04/18        14,079.0            0.78           10981.62        10981.62         0.00
                          1                 24/04/18             0.0            0.78                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  39789.66        39789.66         0.00
                                                                                                                 0.00

ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  41                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57083 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400787               1 z906c02500         24/04/19         3,234.0           4.456           14410.70        14423.64        12.94
                          1                 24/04/19             0.0            4.46                               0.00
F2400787               2 Z906A07200         24/04/19         7,038.0          0.6968            4904.08         4926.60        22.52
                          1                 24/04/19             0.0            0.70                               0.00
F2400787               3 Z906C03900         24/04/19         3,311.0          4.2446           14053.87        14038.64       -15.23
                          1                 24/04/19             0.0            4.24                               0.00
F2400787               4 z906c04200         24/04/19         3,312.0            4.28           14175.36        14175.36         0.00
                          1                 24/04/19             0.0            4.28                               0.00
F2400788               3 Z906C03900         24/04/19           551.0          4.2446            2338.77         2336.24        -2.53
                          1                 24/04/19             0.0            4.24                               0.00
F2400798               3 Z906C03900         24/04/22          -551.0          4.2446           -2338.77        -2336.24         2.53
                          1                 24/04/22             0.0            4.24                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  47544.01        47564.24        20.23
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57092 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400801               1 z906c00400         24/04/23         3,504.0           5.375 T         18834.00        18922.91        88.91
                          1                 24/04/23             0.0         5.40038                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400801               2 Z906C01000         24/04/23           438.0           4.859 T          2128.24         2138.29        10.05
                          1                 24/04/23             0.0         4.88194                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400801               3 Z906C02600         24/04/23         2,520.0           2.709 T          6826.68         7185.52       358.84
                          1                 24/04/23             0.0          2.8514                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
F2400801               4 Z906A04100         24/04/23        14,080.0          1.0248 T         14429.18        15815.75      1386.57
                          1                 24/04/23             0.0         1.12328                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3203                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  42218.10        44062.47      1844.37
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57093 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400800               1 z906c02500         24/04/22         8,310.0           4.456           37029.36        37062.60        33.24
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  42                                                   ERGIS S.A.                                              Czas: 02:53:18
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
                          1                 24/04/22             0.0            4.46                               0.00
F2400800               2 Z906C03900         24/04/22         1,656.0          4.2446            7029.06         7029.06         0.00
                          1                 24/04/22             0.0          4.2446                               0.00
F2400800               3 Z906C04200         24/04/22         1,656.0            4.28            7087.68         7087.68         0.00
                          1                 24/04/22             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  51146.10        51179.34        33.24
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57100 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400821               1 z906c02500         24/04/24         6,925.0           4.456           30857.80        30857.80         0.00
                          1                 24/04/24             0.0           4.456                               0.00
F2400821               2 z906c03100         24/04/24           462.0          6.3299            2924.41         2924.41         0.00
                          1                 24/04/24             0.0          6.3299                               0.00
F2400821               3 z906c02800         24/04/24           461.0          9.0043            4150.98         4150.98         0.00
                          1                 24/04/24             0.0          9.0043                               0.00
F2400821               4 Z906A03500         24/04/24         7,040.0            0.78            5491.20         5491.20         0.00
                          1                 24/04/24             0.0            0.78                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  43424.39        43424.39         0.00
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57101 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400837               1 z906c02600         24/04/26         2,520.0           2.709 T          6826.68         7184.69       358.01
                          1                 24/04/26             0.0         2.85107                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400837               2 Z906A03700         24/04/26         4,224.0          0.8629 T          3644.89         3831.84       186.95
                          1                 24/04/26             0.0         0.90716                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400837               3 Z906A03500         24/04/26        21,120.0            0.78 T         16473.60        17334.49       860.89
                          1                 24/04/26             0.0         0.82076                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
F2400837               4 Z906A06400         24/04/26         2,058.0          1.3721 T          2823.78         2844.85        21.07
                          1                 24/04/26             0.0         1.38234                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3198                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  29768.95        31195.87      1426.92
                                                                                                                 0.00

ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  43                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57102 00000005 Corex �wiecie Sp.z.o.o.
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400854               1 z906c02500         24/04/29         3,680.0           4.456 T         16398.08        18133.75      1735.67
                          1                 24/04/29             0.0         4.92765                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400854               2 Z906A03700         24/04/29        16,896.0          0.8629 T         14579.56        15336.92       757.36
                          1                 24/04/29             0.0         0.90773                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
F2400854               3 Z906A06400         24/04/29         8,232.0          1.3721 T         11295.13        11386.50        91.37
                          1                 24/04/29             0.0          1.3832                               0.00
         Kurs wym:EUR 1.0 = PLN 4.3225                                                            
                                                                                                   
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  42272.77        44857.17      2584.40
                                                                                                                 0.00


Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57103 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400835               1 z906c02500         24/04/25         3,692.0           4.456           16451.55        16466.32        14.77
                          1                 24/04/25             0.0            4.46                               0.00
F2400835               2 Z906A03700         24/04/25        15,482.0          0.8629           13359.42        14088.62       729.20
                          1                 24/04/25             0.0            0.91                               0.00
F2400835               3 z906a03500         24/04/25         7,040.0            0.78            5491.20         5491.20         0.00
                          1                 24/04/25             0.0            0.78                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  35302.17        36046.14       743.97
                                                                                                                 0.00

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57109 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400851               1 z906c02500         24/04/26         5,540.0           4.456           24686.24        24686.24         0.00
                          1                 24/04/26             0.0           4.456                               0.00
F2400851               2 Z906A03700         24/04/26         9,853.0          0.8629            8502.15         8502.15         0.00
                          1                 24/04/26             0.0          0.8629                               0.00
F2400851               3 Z906C03900         24/04/26         2,760.0          4.2446           11715.10        11715.10         0.00
                          1                 24/04/26             0.0          4.2446                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  44903.49        44903.49         0.00
                                                                                                                 0.00

ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  44                                                   ERGIS S.A.                                              Czas: 02:53:18

Zlec.    Dostawca                                                    Projekt
-------- --------                                                    --------
bgi57112 10008597 Corex Sosnowiec daw.Corenso
Dok PZ                   Nr indeksu         Data wys�       Przyj�to        Koszt KG                      Zewn koszt ZZ
Nr spec wys           Lp Opcja ERS          przyj.          Dok dost Ty     Koszt ZZ Wa    Wyl koszt KG zewn podatek ZZ   Odch KG-ZZ Partia dostawcy
-------------------- --- ------------------ --------- -------------- -- ------------ -- --------------- --------------- ------------ ------------------
F2400873               1 z906a03500         24/04/29        11,264.0            0.78            8785.92         8785.92         0.00
                          1                 24/04/29             0.0            0.78                               0.00
F2400873               2 z906a04100         24/04/29        14,077.0          1.0248           14426.11        14358.54       -67.57
                          1                 24/04/29             0.0            1.02                               0.00
F2400873               3 Z906C03900         24/04/29         1,656.0          4.2446            7029.06         7021.44        -7.62
                          1                 24/04/29             0.0            4.24                               0.00
F2400873               4 z906c04200         24/04/29         1,651.0            4.28            7066.28         7066.28         0.00
                          1                 24/04/29             0.0            4.28                               0.00
                                                                                        --------------- --------------- ------------
                                                                  ZZ Razem:                  37307.37        37232.18       -75.19
                                                                                                                 0.00

                                                                                      --------------- --------------- ------------
                                                              Raport razem podst          25206571.56     27214463.08   2007891.52
                                                                                                                 0.00
                                                                                      =============== =============== ============


                                                           Koniec raportu
ERGIS          [PLN]                          5.13.5 Raport przyj�cia zakup�w                                         Data: 24/05/17
Strona:  45                                                   ERGIS S.A.                                              Czas: 02:53:46




Kryteria raportu:                       Raport wykonany przez:     jgu

   Data przyj.: 24/04/01                      Do: 24/04/30
  Kod dostawcy:                               Do:
           Typ:                               Do:
 Numer indeksu:                               Do:
        Zak�ad:                               Do:
       Projekt:                               Do:
  Dok. dostawy:                               Do:
 Indeksy magazynowe: Tak
  Indeksy podwykon.: Tak
  Tylko indeksy ERS: Nie
       Indeksy memo: Tak
 Bez faktur dostaw.: Nie
 Depozyty dostawc�w: Wy��cz
 U�yj koszt standar: Nie
   Drukuj podsumow.: Tak
             Waluta:        Uwzgl�dnij logistyk�: Tak
          Sortuj wg: ZZ                           ZZ / PZ / Pozycja
                                                            Wyj�cie: PZ0424N

`);
    console.log(ret);
    // console.log(ret.filter(v => v.pzItems.length > 1));
  }

  readRejZ(rawPrnData: string): RejZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+1 /, 0, false);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: RejZ\d+$/, Math.max(lines.length - 100, 0));
    lines = this._removeLinesBetween(lines, /^\s+ID wsadu:/, /^\s+ID wsadu:/, lines.length - 2);
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new RejZItem(data[0], data[1]));
  }
  readMAPZ(rawPrnData: string): MAPZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^ERGIS/, /^Strona:/);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: MA/, Math.max(lines.length - 100, 0));
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new MAPZItem(data[0], data[1]));
  }
  readWNPZ(rawPrnData: string): WNPZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^ERGIS/, /^Strona:/);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: MA/, Math.max(lines.length - 100, 0));
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new WNPZItem(data[0], data[1]));
  }
  readPZN(rawPrnData: string): any {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeLinesBetween(lines, /^\s*.?ERGIS/, /^Strona:/);
    lines = this._removePZNTableHeaders(lines);
    lines = this._removePZNSummaries(lines);
    lines = this._removeLinesBetween(lines, /^\s+={5,}/, /^\s+Wyj.cie: PZ/, Math.max(lines.length - 100, 0));
    const items = this._splitPZNIntoItems(lines);
    return items.map(itemLines => new PZNItem(itemLines));
  }

  private _splitIntoLines(str: string): string[] {
    return str
      .split(/\n+/)
      .map(l => l.trimEnd())
      .filter(l => l);
  }
  private _removeTopHeaderLines(lines: string[], endPattern: RegExp): string[] {
    const endIndex = lines.findIndex(l => endPattern.test(l));
    lines.splice(0, endIndex + 1);
    return lines;
  }
  private _removeLinesBetween(
    lines: string[],
    startPattern: RegExp,
    endPattern: RegExp,
    minStartIndexIndex: number = 0,
    deleteEndLine: boolean = true
  ): string[] {
    let deleteStartIndex = -1;
    let deleteCount = 0;
    for (let i = minStartIndexIndex; i < lines.length; i++) {
      const line = lines[i];
      if (deleteStartIndex === -1 && startPattern.test(line)) {
        deleteStartIndex = i;
        deleteCount++;
      }
      if (deleteStartIndex !== -1 && !endPattern.test(line)) {
        deleteCount++;
      }
      if (endPattern.test(line)) {
        lines.splice(deleteStartIndex, deleteCount - (deleteEndLine ? 0 : 1));
        i -= deleteCount;
        deleteStartIndex = -1;
        deleteCount = 0;
      }
    }

    return lines;
  }
  private _removeTableHeaders(lines: string[]): string[] {
    return this._removeLinesBetween(lines, /^\s+Lp/, /^-+$/);
  }
  private _removePZNTableHeaders(lines: string[]): string[] {
    lines = this._removeLinesBetween(lines, /^Zlec./, /^-{5,}/, 0, false);
    return this._removeLinesBetween(lines, /^Dok PZ/, /^-{5,}/);
  }
  private _splitIntoItems(lines: string[]): string[][] {
    const lineItems: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i !== 0 && /^ {0,4}\d+ /.test(line)) {
        const newItem = lines.splice(0, i);
        lineItems.push(newItem);
        i = 0;
      }
    }
    return lineItems;
  }
  private _extractVatInfo(lines: string[]): [string[], string[]] {
    const contentLines: string[] = [];
    const vatLines: string[] = [];

    const separatorLineIndex = lines.findIndex(l => /-+$/.test(l));
    const separatorLine = lines[separatorLineIndex];
    const separatorIndex = separatorLine.indexOf(' --');

    for (const line of lines) {
      const contentLine = line.slice(0, separatorIndex).trim().replace(/ {2,}/g, ' ');
      if (contentLine) contentLines.push(contentLine);

      const vatLine = line.slice(separatorIndex).trim().replace(/ {2,}/g, ' ');
      if (vatLine && !/^-+$/.test(vatLine)) vatLines.push(vatLine);
    }
    return [contentLines, vatLines];
  }
  private _removePZNSummaries(lines: string[]): string[] {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s+ZZ Razem|^\s+Raport razem podst/.test(line)) {
        i--;
        lines.splice(i, 3);
      }
    }
    return lines;
  }
  private _splitPZNIntoItems(lines: string[]): string[][] {
    const lineItems: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i !== 0 && /^--------/.test(line)) {
        const newItem = lines.splice(0, i);
        newItem.shift();
        lineItems.push(newItem);
        i = 0;
      }
    }
    return lineItems;
  }
}
