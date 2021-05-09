The database build process cannot be done automatically.
The following command has to be used in the db folder from a linux shell
(e.g. the one installed with docker, or a git bash window)
or another environment that supports .sh scripts.

    ./buildDockerImage.sh -v 18.4.0 -x

Afterwards the docker-compose file can be used to run the resulting image with:

    docker compose run