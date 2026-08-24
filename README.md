# interpaints

Многостраничный сайт про цвет, стрит-арт и современные покрытия. Это не лендинг краски, а визуальная история: цвет как язык, стена как холст, поверхность как технология.

Сайт живёт на [interpaints.ru](https://interpaints.ru) (GitHub Pages).

## Как устроен маршрут

Корень идет на главную. Дальше страницы идут цепочкой:

1. **Главная** (`mainPage/new.html`) — hero, главы про цвет / дизайн / будущее, видео-интерлюдия, галерея и эпилог.
2. **Hypercube** (`secondPage/fsecond.html`) — 3D-тессеракт на Three.js и скролл-история про цветовое пространство.
3. **Punk skull** (`thirdPage/third.html`) — интерактивная 3D-модель через Google `<model-viewer>`.
4. **Jellyfish** (`fourPage/fourPage.html`) — 3D-карусель фотографий.

## Структура

```
newInter/
├── index.html              # редирект на главную
├── CNAME                   # interpaints.ru
├── mainPage/               # главная страница
│   ├── new.html
│   ├── new.css
│   ├── new.js
│   ├── serve.py            # локальный сервер без кэша
│   └── images/             # фото и видео
├── secondPage/             # гиперкуб
│   ├── fsecond.html
│   ├── second.ts           # исходник Three.js
│   ├── second.js           # собранный бандл
│   └── second.css
├── thirdPage/              # 3D-череп
│   ├── third.html
│   ├── third.js
│   └── third.css
└── fourPage/               # карусель медуз
    ├── fourPage.html
    ├── fourPage.js
    └── fourPage.css
```

## Стек

- HTML, CSS, JavaScript
- [Three.js](https://threejs.org/) — гиперкуб на второй странице
- TypeScript + esbuild — сборка `second.ts` → `second.js`
- [Google model-viewer](https://modelviewer.dev/) — 3D-модель на третьей странице
- Python `http.server` — локальная разработка без кэша браузера

## Локальный запуск

Главную удобно смотреть через сервер без кэша:

```bash
cd mainPage
python3 serve.py
```

Откроется `http://localhost:8080/new.html`. С телефона в той же сети — `http://<ip>:8080/new.html`.

Остальные страницы можно открывать через любой статический сервер из корня репозитория, чтобы работали относительные пути между папками.

## Сборка второй страницы

Если правите `secondPage/second.ts`:

```bash
cd secondPage
npm install
npm run build
```

Для автосборки: `npm run watch`.
