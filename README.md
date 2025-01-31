# PPL Solutions website

Hello there, it seems you have stumbled across one of my projects. This project in particular is one of my finest work, this is the website for the Virtual Trucking Company: PPL Solutions. It features some awesome information about the VTC, dynamic showing of our events we participate in and an amazing Drivershub!

## Installation

Before everything, you will need to have [git](https://git-scm.com) installed, if you don't have it installed. Download it [here](https://git-scm.com/downloads), after git is installed you can run this command:

```bash
git clone git@git.nexed.com:0191bd26-8ad6-775a-a3fb-8161a33b6a11/0191d5d1-b9ce-7ad9-9c76-6deeabe8482d/Almost-there-05949418010a-40799e9f4aab.git
```

To use and open the website, you will have to install XAMPP, to learn how to install it. Go to the [XAMPP](https://www.apachefriends.org/download.html) download page. Once XAMPP is installed, you need to turn on the modules Apache and MySQL. After that is done, you will need to add a database on the [phpmyadmin](http://localhost/phpmyadmin) page. When all is done, you need [NodeJS](https://nodejs.org/en/download) and its package manager [npm](https://www.npmjs.com/package/npm). Once they are installed, run

```bash
# creates a package.json
npm init -y
```

Note: in the package.json, you will have to replace the "main": "index.js" with "main": "index.html".

After that, you will have to install the dependencies [Bootstrap](https://getbootstrap.com) and [Sass](https://sass-lang.com) with the command:

```bash
#installs Sass
npm i sass

#installs Bootstrap and Popper
npm i bootstrap
```

Note: 
```bash
npm i bootstrap
```
will also install [Popper](https://popper.js.org/docs/v2/).


Next-up, you will need to add some scripts into the "scripts" section of package.json:
```json
"watch": "sass --watch ./src/pages/scss/custom.scss ./src/pages/css/style.css",
"build": "sass ./src/pages/scss/custom.scss ./src/pages/css/style.css --style compressed"
```

## Usage

To use and update the project you have to run the website on a localhost, to update the styling: run

```bash
npm run watch
```

When you're done, run

```bash
npm run build
```
to compress the style.css file

Happy coding! ;)