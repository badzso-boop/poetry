## SETUP

### XAMPP

https://www.apachefriends.org/download.html

 - Innen töltsd le ezt a csodás alkalmazást majd az alap beállításokkal installáld fel.
 - Ha feltelepült:
  - Apache
  - MySQL
 - szerverek indítás a astart gombbal
 - MySQL mellett az admin gombra nyomva megnyílik az online felület (localhost :D)
 - A felső sávban az Import gombra kattintva beimportáljuk az sql mappában található fájlt

### Backend szerver

 - A klónozott mappaban egy `npm install` szükségeltetik
 - majd egy `npx nodemon .\src\app.js`

### Frontend szerver

 - a frontend mappában van, ajánlott ezt is megnyitni VS Codeban
 - `npm install`
 - `npm start`
 - igen másik porton szeretne majd futni :)

### Tesztelés

 - a belépésnél:
  - `username`: `new_user`
  - `password`: `new_secret123`

  jó tesztelést! 

## Adatmodellek

### Comment Modell

A `Comment` modell reprezentálja a felhasználók kommentjeit a versekhez. A következő attribútumokkal rendelkezik:

- `id`: A komment azonosítója.
- `userId`: A felhasználó azonosítója, aki a kommentet hozta létre.
- `poemId`: A vers azonosítója, amelyhez a komment tartozik.
- `commentText`: A komment szövege.
- `dateCommented`: A komment létrehozásának dátuma.
- `commenter`: A felhasználó neve, aki a kommentet hozta létre.

### Like Modell

A `Like` modell reprezentálja a felhasználók lájkjait a versekhez. A következő attribútumokkal rendelkezik:

- `id`: A lájk azonosítója.
- `userId`: A felhasználó azonosítója, aki a lájkot hozta létre.
- `poemId`: A vers azonosítója, amelyhez a lájk tartozik.
- `dateLiked`: A lájk létrehozásának dátuma.
- `username`: A felhasználó neve, aki a lájkot hozta létre.

### Poem Modell

A `Poem` modell reprezentálja a verseket az alkalmazásban. A következő attribútumokkal rendelkezik:

- `id`: A vers azonosítója.
- `title`: A vers címe.
- `content`: A vers tartalma.
- `userId`: A felhasználó azonosítója, aki a verset létrehozta.
- `creationDate`: A vers létrehozásának dátuma.
- `author`: A vers szerzőjének neve.
- `likes`: A vershez tartozó lájkok listája.
- `comments`: A vershez tartozó kommentek listája.

### User Modell

A `User` modell reprezentálja a felhasználókat az alkalmazásban. A következő attribútumokkal rendelkezik:

- `id`: A felhasználó azonosítója.
- `username`: A felhasználó neve.
- `email`: A felhasználó e-mail címe.
- `passwordHash`: A felhasználó jelszavának hash értéke.
- `profileImgUrl`: A felhasználó profilképének URL-je.
- `role`: A felhasználó szerepköre az alkalmazásban.

## Alkalmazás Útvonalak

A `routes` mappa tartalmazza az alkalmazás különböző útvonalainak definícióit. Az alábbiakban felsoroljuk az egyes útvonalakat és leírjuk, hogy mire szolgálnak.

## AuthRoutes

### Regisztráció (POST /auth/register)

Regisztrálja az új felhasználót az alkalmazásba.

- **Útvonal:** `/auth/register`
- **Metódus:** POST
- **Request testreszabása:**
  - `username`: A regisztrálni kívánt felhasználónév.
  - `email`: Az új felhasználó e-mail címe.
  - `password`: A regisztrálni kívánt jelszó.

### Bejelentkezés (POST /auth/login)

Bejelentkezik a felhasználót.

- **Útvonal:** `/auth/login`
- **Metódus:** POST
- **Request testreszabása:**
  - `username`: A bejelentkezni kívánt felhasználónév.
  - `password`: A bejelentkezni kívánt jelszó.

### Kijelentkezés (GET /auth/logout)

Kijelentkezik a bejelentkezett felhasználóból.

- **Útvonal:** `/auth/logout`
- **Metódus:** GET

### Azonosítás ellenőrzése (GET /auth/check-auth)

Ellenőrzi, hogy a felhasználó be van-e jelentkezve.

- **Útvonal:** `/auth/check-auth`
- **Metódus:** GET
- **Válasz:**
  - `{ authenticated: true, userId: [userId], username: [username] }`: A felhasználó be van jelentkezve.
  - `{ authenticated: false }`: A felhasználó nincs bejelentkezve.

## PoemRoutes

### Get All Poems (GET /poems)

Lekéri az összes verset az adatbázisból.

- **Útvonal:** `/poems`
- **Metódus:** GET
- **Válasz:**
  - A lekért versek adatait tartalmazó tömb.

### Create a New Poem (POST /poems)

Létrehoz egy új verset.

- **Útvonal:** `/poems`
- **Metódus:** POST
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Request testreszabása:**
  - `title`: A vers címe.
  - `content`: A vers tartalma.
- **Válasz:**
  - A létrehozott vers adatai.

### Get Poems by User (GET /poems/user/:userId)

Lekéri az adott felhasználó által létrehozott verseket.

- **Útvonal:** `/poems/user/:userId`
- **Metódus:** GET
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - A lekért versek adatait tartalmazó tömb.

### Get a Specific Poem (GET /poems/poem/:poemId)

Lekéri a megadott azonosítójú verset.

- **Útvonal:** `/poems/poem/:poemId`
- **Metódus:** GET
- **Paraméter:**
  - `poemId`: A vers azonosítója.
- **Válasz:**
  - A lekért vers adatai.

### Delete a Poem (DELETE /poems/:poemId)

Törli a megadott azonosítójú verset.

- **Útvonal:** `/poems/:poemId`
- **Metódus:** DELETE
- **Szükséges jogosultság:** Bejelentkezett felhasználó, aki a vers tulajdonosa.

### Update a Poem (PUT /poems/:poemId)

Frissíti a megadott azonosítójú vers adatait.

- **Útvonal:** `/poems/:poemId`
- **Metódus:** PUT
- **Szükséges jogosultság:** Bejelentkezett felhasználó, aki a vers tulajdonosa.
- **Request testreszabása:**
  - `title`: Az új cím.
  - `content`: Az új tartalom.

### Like a Poem (POST /poems/like/:poemId)

Lekéri a megadott azonosítójú verset.

- **Útvonal:** `/poems/like/:poemId`
- **Metódus:** POST
- **Szükséges jogosultság:** Bejelentkezett felhasználó.
- **Válasz:**
  - A siker üzenetét tartalmazza, ha a like-olás sikeres.

## CommentRoutes

### Get All Comments (GET /comments)

Lekéri az összes kommentet az adatbázisból.

- **Útvonal:** `/comments`
- **Metódus:** GET
- **Válasz:**
  - A lekért kommentek adatait tartalmazó tömb.

### Create a Comment (POST /comments/:poemId)

Létrehoz egy új kommentet a megadott vershez.

- **Útvonal:** `/comments/:poemId`
- **Metódus:** POST
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Request testreszabása:**
  - `commentText`: A komment szövege.
- **Paraméter:**
  - `poemId`: A vers azonosítója, amelyhez a komment tartozik.
- **Válasz:**
  - A létrehozott komment adatai.

### Delete a Comment (DELETE /comments/:commentId)

Törli a megadott azonosítójú kommentet.

- **Útvonal:** `/comments/:commentId`
- **Metódus:** DELETE
- **Szükséges jogosultság:** Bejelentkezett felhasználó, aki a komment tulajdonosa vagy adminisztrátor
- **Paraméter:**
  - `commentId`: A komment azonosítója.
- **Válasz:**
  - Sikeres törlés esetén üzenet, egyébként hibaüzenet.

### Update a Comment (PUT /comments/:commentId)

Frissíti a megadott azonosítójú kommentet.

- **Útvonal:** `/comments/:commentId`
- **Metódus:** PUT
- **Szükséges jogosultság:** Bejelentkezett felhasználó, aki a komment tulajdonosa
- **Request testreszabása:**
  - `commentText`: Az új komment szövege.
- **Paraméter:**
  - `commentId`: A komment azonosítója.
- **Válasz:**
  - Sikeres frissítés esetén üzenet, egyébként hibaüzenet.

### Get Comments by User (GET /comments/user/:userId)

Lekéri az adott felhasználó által létrehozott kommenteket.

- **Útvonal:** `/comments/user/:userId`
- **Metódus:** GET
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - A lekért kommentek adatait tartalmazó tömb.

## UserRoutes

### Get All Users (GET /users)

Lekéri az összes felhasználót az adatbázisból.

- **Útvonal:** `/users`
- **Metódus:** GET
- **Válasz:**
  - A lekért felhasználók adatait tartalmazó tömb.

### Get a Specific User (GET /users/:userId)

Lekéri a megadott azonosítójú felhasználó adatait.

- **Útvonal:** `/users/:userId`
- **Metódus:** GET
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - A lekért felhasználó adatai.

### Delete a User (DELETE /users/:userId)

Törli a megadott azonosítójú felhasználót.

- **Útvonal:** `/users/:userId`
- **Metódus:** DELETE
- **Szükséges jogosultság:** Adminisztrátor
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - Sikeres törlés esetén üzenet, egyébként hibaüzenet.

### Update a User (PUT /users/:userId)

Frissíti a megadott azonosítójú felhasználó adatait.

- **Útvonal:** `/users/:userId`
- **Metódus:** PUT
- **Szükséges jogosultság:** Adminisztrátor
- **Request testreszabása:**
  - `username`: A felhasználó új felhasználóneve.
  - `email`: A felhasználó új e-mail címe.
  - `password`: A felhasználó új jelszava.
  - `profileImgUrl`: A felhasználó új profilkép URL-je.
  - `role`: A felhasználó új szerepköre.
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - Sikeres frissítés esetén üzenet, egyébként hibaüzenet.

## FollowRoutes

### Get Users Followed by a User (GET /follow/following/:userId)

Lekéri az összes felhasználót, akiket a megadott felhasználó követ.

- **Útvonal:** `/follow/following/:userId`
- **Metódus:** GET
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - A követett felhasználók adatait tartalmazó tömb.

### Get Followers of a User (GET /follow/followers/:userId)

Lekéri az összes felhasználót, akik követik a megadott felhasználót.

- **Útvonal:** `/follow/followers/:userId`
- **Metódus:** GET
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - A követő felhasználók adatait tartalmazó tömb.

### Follow a User (POST /follow/follow/:followedId)

Követ egy felhasználót.

- **Útvonal:** `/follow/follow/:followedId`
- **Metódus:** POST
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Paraméter:**
  - `followedId`: A követett felhasználó azonosítója.
- **Válasz:**
  - Sikeres követés esetén üzenet, egyébként hibaüzenet.

### Unfollow a User (DELETE /follow/unfollow/:followedId)

Megszünteti a követést egy felhasználótól.

- **Útvonal:** `/follow/unfollow/:followedId`
- **Metódus:** DELETE
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Paraméter:**
  - `followedId`: A követett felhasználó azonosítója.
- **Válasz:**
  - Sikeres követés megszüntetése esetén üzenet, egyébként hibaüzenet.

## AlbumRoutes

### Create Album and Add Poems (POST /albums/create-album)

Létrehoz egy albumot és hozzáad verseket.

- **Útvonal:** `/albums/create-album`
- **Metódus:** POST
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Test:** JSON objektum a következő mezőkkel:
  - `title`: Az album címe.
  - `description`: Az album leírása.
  - `poemIds`: Egy tömb a hozzáadott versek azonosítóival.
- **Válasz:**
  - Sikeres létrehozás esetén üzenet, egyébként hibaüzenet.

### Get Albums with Poems (GET /albums/albums-with-poems)

Lekéri az összes albumot a hozzájuk tartozó versekkel.

- **Útvonal:** `/albums/albums-with-poems`
- **Metódus:** GET
- **Válasz:**
  - Az albumokat és hozzájuk tartozó verseket tartalmazó tömb.

### Get a specific Album with Poems (GET /albums/albums-with-poems/:albumId)

Lekéri az adott albumot a hozzájuk tartozó versekkel.

- **Útvonal:** `/albums/albums-with-poems/:albumId`
- **Metódus:** GET
- **Válasz:**
  - Az adott albumot és hozzájuk tartozó verseket tartalmazó tömb.

### Delete Album by Album ID (DELETE /albums/delete-album/:albumId)

Törli az albumot azonosító alapján.

- **Útvonal:** `/albums/delete-album/:albumId`
- **Metódus:** DELETE
- **Szükséges jogosultság:** Bejelentkezett felhasználó
- **Paraméter:**
  - `albumId`: Az album azonosítója.
- **Válasz:**
  - Sikeres törlés esetén üzenet, egyébként hibaüzenet.



## DB.js
Az src/db.js fájl egy MySQL adatbázis kapcsolódási medencét definiál, és ezt exportálja a Promise-alapú interfész segítségével. Ez a modul egy egyszerű és hatékony módszert kínál a MySQL adatbázishoz való kapcsolódásra és lekérdezésekre a Node.js alkalmazásban.

## App.js

Az src/app.js fájl egy Express.js alkalmazást definiál, konfigurálva a szükséges middleware-eket, például a JSON feldolgozást, CORS-t, és session kezelést. A különböző útvonalakat az alkalmazás külön fájlokba szervezi a routes mappában. Az alkalmazás a 3000-es porton hallgatózik, és a console.log-al jelzi, ha sikeresen elindult.

## Functions.js

### getPoemsByUser

Egy async függvény ami visszaadja a verseket a userId alapjan

- **Útvonal:** `./helpers/functions.js`
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - Az adott felhasználó verseit

### getAlbums

Egy async függvény ami visszaadja az albumokat. Ha az albumId = -1 akkor az összeset visszaadja, ha barmi ami nem -1 akkor az adott albumot adja vissza

- **Útvonal:** `./helpers/functions.js`
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - Az adott albumaot, vagy az összes albumot

### getAlbumsByUser

Egy async függvény ami visszaadja az albumokat a userId alapján az adott felhasználóét adja vissza

- **Útvonal:** `./helpers/functions.js`
- **Paraméter:**
  - `userId`: A felhasználó azonosítója.
- **Válasz:**
  - Azokat az albumokat adja vissza amelyik az adott felhasználó tulajdonában van.