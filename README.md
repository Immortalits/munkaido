# Munkaidő nyilvántartó

Használat:


expo start --tunnel


1. `yarn install` parancs segítségével telepítsük a package.json-ban szereplő függőségeket
2. `yarn start` paranccsal indítsuk el az alkalmazást, majd expo környezetből csatlakozzunk rá.

## !!fontos tudnivalók

Jelenleg 15ös nodejs-re van szükség ami letölthető innen:

https://nodejs.org/dist/latest-v15.x/

Mac rendszer esetén a pkg file, windows esetén az msi file a telepítő file amit lehet használni.

### Dependencyk telepítése 

Erre csak akkor van szükség ha nullárol szeretnénk felépíteni az alkalmazást és nem áll rendelkezésre package.json file.

Alap csomagok telepítése:

```
yarn add @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack expo firebase react react-dom react-native react-native-keyboard-aware-scroll-view react-native-safe-area-context react-native-screens react-native-svg 
```

### dev dependency-k

eslint: jelenleg a 7.32.0 verzió működik jól

```
yarn add -D eslint eslint-plugin-auto-import eslint-plugin-import eslint-plugin-react-native eslint-config-universe eslint-plugin-prettier prettier
```


