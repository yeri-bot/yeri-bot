# Yeri Discord Bot
***Yeri Discord Bot*** jest open-source'owym botem opartym na platformie **node.js**. Do swojego działania wykorzystuje bibliotekę **discord.js** oraz technologię **MongoDB**.

Zapewnia on dostarczanie na serwer Discord treści postów oraz mediów z serwisów takich jak **wykop**.

## Konfiguracja pliku `app.js`
- **version** - wyświetlana wersja bota
- **discord.ownerId** - ID profilu na Discordzie właściciela bota
- **discord.token** - token otrzymywany po rejestracji bota na stronie Discorda
- **discord.maknaeToken** - token używany w wersji testowej środowiska
- **mongodb.host** - host bazy danych MongoDB
- **mongodb.db** - nazwa bazy danych MongoDB
- **mongodb.user** - nazwa użytkownika bazy danych MongoDB
- **mongodb.password** - hasło bazy danych MongoDB
- **modules** - moduły
- **modules.\*.enabled** - moduł aktywny (`true`), moduł nieaktywny (`false`)

## Środowisko testowe
Środowisko testowe uruchamiane jest przez dodanie do linii poleceń parametru `--maknae`, np.
```
node app.js --maknae