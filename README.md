# About
This is a simple collection of useful config files to enforce a clean statically typed coding style.

* Prettier - Code Formatting
* TypeScript - Static Typing + Intellisense
* ESLint - Linter
* Babel - Transpile import / export
* Transform JSX

# Get Started
## git 
    git init 
    git remote add clean-code https://github.com/state-less/clean-starter-backend.git
    git fetch --all
    git checkout clean-code/react-server -- *
    git remote remove clean-code

This initializes a new git repository (you can omit this step if you already have git setup)
Add this repository as another remote (you can have as many as you want)
Once you fetched the remote you can checkout single files from it without affecting any history
Checkout all the files contained in the backend branch (see backend branch)
After you checked out all config files you can remove the repository again (or keep it in case you want pull new changes)

## Target 
This branch targets backend projects working with **react-server** it contains everything you need to run a react-server. (TypeScript + JSX)

## What does this package contain

It contains all config files and dev dependencies needed for *babel*, *eslint* and *prettier*. It enforces a consisten EOL to mitigate cross env line endings conflicting with eslint. It contains a standard .gitignore and a .eslintignore. Prettier can be used with VSCode and configured to run with Alt+Shift+F. It contains a simple babel.config.json that compiles JavaScript, TypeScript and JSX. It also contains a build script in the *package.json* to run babel on your src directory. 

That's about the minimum you need for a clean code experience in a server side JavaScript environment.

# Guidelines
## What's clean code. 

*  Clean code is **readable**. Code communicates the intent of a developer to another developer. Computers don't care whether your code is a mess or well readable, but your fellow human coworkers do. 
*  Clean code is **structured**. Code should be modular. A well formed folder structure and conventional namings of your files ensure the next person working on the code
*  Clean code is **typed**. Code should be statically typed as much as possible. This will help you leverage all your favorite IDE features and spend less time typing.
*  Clean code is **modular**. Every took a look at the code of popular libraries. You can tell at first glance: That's clean code. 
*  Clean code is **documented**. You can be a genious programmer. Reading other peoples source takes time. Document your thoughts. Your code has side-effects? You better document them.
*  Clean code is **DRY**. You heard this often enough. Don't repeat yourself. Functions should be small, concise.
*  Clean code is **functional**. Functional code is preferabble over object oriented code. That is because of its static computability and optimization potential. Pure and functional code can be highly optimized by a compiler. 
