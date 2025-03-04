#  Specyfikacja Systemu Magazynowego

## 1. Wprowadzenie

System magazynowy ma na celu usprawnienie zarządzania zasobami magazynowymi poprzez automatyzację procesów logowania, zarządzania użytkownikami, monitorowania stanów magazynowych oraz obsługę operacji online i offline.

## 2. Funkcjonalności systemu

Poniżej przedstawiono listę funkcjonalności systemu wraz z informacją, na jakich platformach są dostępne:

| **L.p.** | **Funkcjonalność**                                                                                           | **API** | **Web** | **Mobile** | **Desktop** |
| -------- | ------------------------------------------------------------------------------------------------------------ | ------- | ------- | ---------- | ----------- |
| 1        | Pierwszy administrator jest automatycznie dodany do systemu.                                                 | X       |         |            |             |
| 2        | Administrator może zalogować się w systemie.                                                                 | X       | X       |            | X           |
| 3        | Administrator może tworzyć nowych użytkowników                                                               | X       | X       |            | X           |
| 4        | Użytkownik może zalogować się w systemie                                                                     | X       |         | X          | X           |
| 5        | Resetowanie hasła                                                                                            |         | X       | X          | X           |
| 6        | Wylogowywanie się                                                                                            |         | X       | X          | X           |
| 7        | Administrator może wyświetlić stan magazynowy                                                                | X       | X       |            | X           |
| 8        | Administrator może modyfikować stan magazynowy                                                               | X       | X       |            | X           |
| 9        | Administrator może generować raporty stanu magazynowego                                                      | X       | X       |            | X           |
| 10       | Administrator otrzymuje powiadomienia przypominające o zrobieniu raportu stanu magazynowego                  | X       | X       |            | X           |
| 11       | Użytkownik może skanować kod kreskowy produktu, podaje ilość, podaje lokalizację i przesyła na stan magazynu | X       |         | X          |             |
| 12       | Użytkownik może zobaczyć listę produktów w magazynie                                                         | X       |         | X          |             |
| 13       | Użytkownik może znaleźć lokalizację produktów w magazynie                                                    | X       |         | X          |             |
| 14       | W przypadku gdy jest się offline, zadania dodają się do kolejki wykonania                                    | X       |         | X          | X           |
| 15       | Pobranie zawartości bazy danych do użytku offline                                                            | X       |         | X          | X           |
| 16       | Użytkownik może dodawać nowe przedmioty                                                                      | X       | X       |            | X           |
| 17       | Obsługa języka polskiego i angielskiego                                                                      |         | X       | X          | X           |
| 18       | Użytkownik dostaje powiadomienie związane z przywróceniem połączenia z internetem i synchronizacji danych    | X       |         | X          |             |

## 3. Baza danych

System magazynowy wykorzystuje bazę danych do przechowywania informacji o:

- użytkownikach/administratorach,
- przedmiotach,
- stanie magazynu.

## 4. Wymagania techniczne

System wymaga dostępu do API oraz obsługi platform Web, Mobile i Desktop, w zależności od funkcjonalności.

## 5. Technologie projektowe

- **Aplikacja desktop**: C#, .NET
- **Aplikacja webowa**: TypeScript, React
- **API**: PHP, Laravel, MySQL
- **Aplikacja mobilna**: Dart, Flutter

