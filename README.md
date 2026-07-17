# Coworking Booking

Egyszerű szoba-/tárgyalófoglaló alkalmazás coworking irodák számára. Bejelentkezett felhasználók megnézhetik a termeket, óránkénti bontásban lefoglalhatnak egy szabad időpontot, és kezelhetik a saját foglalásaikat.

🔗 **Élő demo:** https://coworking-booking-95b46.web.app

## Funkciók

- **Bejelentkezés**: email/jelszó és Google fiókkal
- **Termek listája**: Firestore-ból betöltve, kapacitással és leírással
- **Foglalási órarács**: napi bontás (8:00–18:00), dátumválasztóval (előre/vissza nap, "Ma" gomb)
- **Foglalás megerősítéssel**: a foglaláshoz kötelező tárgyat megadni, majd egy megerősítő ablakban látod a termet, dátumot és időpontot
- **Foglalás részletei**: egy már lefoglalt sávra kattintva megnézheted, ki foglalta le, mi a tárgya
- **Saját foglalásaim**: a bejelentkezett felhasználó összes foglalása egy helyen, lemondási lehetőséggel
- **Dupla foglalás elleni védelem**: a foglalás Firestore tranzakcióval, determinisztikus dokumentum-ID-vel történik, így két egyidejű foglalási kísérlet közül csak az egyik sikerülhet ugyanarra a sávra
- **Firestore security rules**: csak bejelentkezett felhasználó olvashat/írhat, foglalást csak a saját nevében hozhat létre, és csak a sajátját mondhatja le

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Authentication + Firestore)
- [TanStack Query](https://tanstack.com/query/latest) a szerverállapot kezelésére

## Fejlesztői környezet beállítása

### 1. Függőségek telepítése

```bash
npm install
```

### 2. Firebase projekt

Hozz létre egy Firebase projektet a [Firebase Console](https://console.firebase.google.com/)-ban, majd engedélyezd benne:

- **Authentication** → Email/Password és Google sign-in módszerek
- **Firestore Database**

### 3. Környezeti változók

Másold le a `.env.example` fájlt `.env` néven, és töltsd ki a Firebase projekt saját adataival (Project settings → General → Your apps → SDK setup and configuration):

```bash
cp .env.example .env
```

### 4. Firestore adatok

Hozz létre egy `rooms` collection-t a Firestore-ban, dokumentumonként az alábbi mezőkkel:

| mező          | típus  | példa               |
| ------------- | ------ | ------------------- |
| `name`        | string | `Ares terem`        |
| `capacity`    | int64  | `8`                 |
| `description` | string | `Projektor, whiteboard` |

A `bookings` collection-t az alkalmazás hozza létre automatikusan foglaláskor.

### 5. Firestore security rules

A [firestore.rules](firestore.rules) fájl tartalmát másold be a Firebase Console → Firestore Database → Rules fülre, és nyomj Publish-t. (A `firebase.json` a fájlra mutat, ha a Firebase CLI-t használod a megfelelő projektfiókkal bejelentkezve: `firebase deploy --only firestore:rules`.)

### 6. Indítás

```bash
npm run dev
```

## Egyéb parancsok

```bash
npm run build     # típusellenőrzés + production build
npm run lint      # ESLint
npm run preview   # production build helyi megtekintése
```
