[![CircleCI](https://circleci.com/gh/DanPurdy/firebase-firestore-rule-testing-demo.svg?style=shield)](https://circleci.com/gh/DanPurdy/firebase-firestore-rule-testing-demo)

# firebase-firestore-testing-demo

A Firebase Firestore demo repo for testing Firestore rules

The companion for the Firebase Cloud Firestore security rules article at [dpurdy.me](https://dpurdy.me/blog)

Part 1 - [Firebase Cloud Firestore security rules - Part one - Writing the rules](https://dpurdy.me/blog/firebase-cloud-firestore-security-rules/)

Part 2 - [Firebase Cloud Firestore security rules - Part two - unit testing](https://dpurdy.me/blog/firebase-cloud-firestore-security-rules-part-two-unit-testing/)

## Setup and run

If you don't have the firebase CLI setup you'll need to install it see the [Firebase CLI docs](https://firebase.google.com/docs/cli) or just install globally with npm using

```
npm install -g firebase-tools
```

then install the node modules

```
npm i
```

You can then run the tests with

```
npm test
```
