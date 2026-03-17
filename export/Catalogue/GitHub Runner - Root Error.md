The following command should solve this issue by setting the environment variable which negates the check if a user is root or not.

```
export RUNNER_ALLOW_RUNASROOT="1"
```
