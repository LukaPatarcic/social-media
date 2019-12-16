# Allshak

Have all your social media in one place. One account for everything!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
PHP, MySQL, Composer, Node.js 12.2, NPM, Yarn, Android Sdk, Android Emulator
```

### Installing API

A step by step series of examples that tell you how to get a development env running

Install dependencies from composer.json

```
composer install
```

Edit your .env file with correct values
```
edit mysql,swift_mailer,facebook and other API keys
```

Setup Database

```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Finally run dev server
```
php bin/console s:r
```

### Installing Frontend

A step by step series of examples that tell you how to get a development env running

Install dependencies from package.json

```
yarn install or npm install
```

Startup dev server

```
yarn start
```

### Installing React-Native

A step by step series of examples that tell you how to get a development env running

Install dependencies from package.json

```
yarn install or npm install
```

Setup Android and IOS on your device

```
Check the link for more info https://facebook.github.io/react-native/docs/getting-started
```

Finally run dev server on Android or IOS

```
react-native run-android or react-native run-ios
```

## Deployment

###For React

```
yarn build
```

###For React-Native

Setup Keystore
```
keytool -genkey -v -keystore your_key_name.keystore -alias your_key_alias -keyalg RSA -keysize 2048 -validity 10000
```
Setup APK

```
cd android && ./gradlew assembleRelease
```
## Built With

* [Symfony](https://symfony.com/doc/current/index.html) - API backend
* [React](https://reactjs.org/docs/getting-started.html) - Frontend
* [React-Native](https://facebook.github.io/react-native/docs/getting-started) - Mobile app

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Git](http://git-scm.com/) for versioning.  

## Authors

* **Luka Patarčić** - *web developer* - [LukaPatarcic](https://github.com/LukaPatarcic)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
