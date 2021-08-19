# How can you help out?

Any contributions are welcome! These guidelines should help you get setup and developing :).

To contribute, follow the [setting up local environment instructions](/README.md#setting-up-the-local-environment);

When you make a commit please use `npx cz` in place of git commit, to keep inline with the cz standard. Pick the relevant type, for example if you are fixing a bug then (fix). When applying a scope i don't really stick to the convention, e.g. If I am working on the ReviewModal component I will use that as the scope. And please be relatively descriptive in your commits, as they will be included in the [changelog](/CHANGELOG.md).

When you npm install a husky hook should install that checks your code for any typescript / eslint errors after the commit, if this fails and you need to re-commit, use `npx cz --retry`.
