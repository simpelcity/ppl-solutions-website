# PPL Solutions website

Hello there, it seems you have stumbled across one of my projects. This project in particular is one of my finest work, this is the website for the Virtual Trucking Company: PPL Solutions. It features some awesome information about the VTC, dynamic showing of our events we participate in and an amazing Drivershub!

## Installation

Before everything, you will need to have [git](https://git-scm.com) installed, if you don't have it installed. Download it [here](https://git-scm.com/downloads), after git is installed you can run this command:

```bash
git clone git@git.nexed.com:0191bd26-8ad6-775a-a3fb-8161a33b6a11/0191d5d1-b9ce-7ad9-9c76-6deeabe8482d/Almost-there-05949418010a-40799e9f4aab.git
```

To use and open the website, you will have to install XAMPP, to learn how to install it. Go to the [XAMPP](https://www.apachefriends.org/download.html) download page. Once XAMPP is installed, you need to turn on the modules Apache and MySQL. After that is done, you will need to add a database on the [phpmyadmin](http://localhost/phpmyadmin) page. You can find the code for this in the database folder. To import the database, got to the [phpmyadmin](http://localhost/phpmyadmin) page, there you can find a button called 'sql' in the field there, paste the code from database.sql and execute it. When all is done, you need [NodeJS](https://nodejs.org/en/download) and its package manager [npm](https://www.npmjs.com/package/npm). Once they are installed, you will have to install the dependencies [Bootstrap](https://getbootstrap.com) and [Sass](https://sass-lang.com) with these commands:

```bash
#installs Bootstrap and Popper
npm i bootstrap

#installs Sass
npm i sass
```

You need to execute them in this order for the .gitignore to not take the node_modules with the commits.

## Usage

To use and update the project you have to run the website on a localhost, to update the styling: run

```bash
npm run watch
```

And when you're done, run

```bash
npm run build
```
to compress the style.css file

Happy coding! ;)