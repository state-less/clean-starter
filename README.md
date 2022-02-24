# About
This is a simple collection of useful config files to enforce a clean statically typed coding style.

* Prettier - Code Formatting
* TypeScript - Static Typing + Intellisense
* ESLint - Linter
* Babel - Transpile import / export

# Get Started
## git 
    git init 
    git remote add clean-code https://github.com/state-less/clean-starter-backend.git
    git fetch --all
    git checkout clean-code/backend -- *
    git remote remove clean-code

This initialized a new git repository (you can omit this step if you already have git setup)
Add this repository as another remote (you can have as many as you want)
Once you fetched the remote you can checkout single files from it without affecting any history
Checkout all the files contained in the backend branch (see backend branch)
After you checked out all config files you can remove the repository again (or keep it in case you want pull new changes)