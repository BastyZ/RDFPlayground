# RDF Playground
This project allows web users to write RDF as Turtle, check its syntax, 
visualize the data as a graph, and use SPARQL, RDFS, OWL, SHACL and ShEx.

The project is intended to provide many functionalities in one system, 
and is intended to be used for small examples (e.g., for teaching or demos).

You can see a [demo here](http://rdfplayground.dcc.uchile.cl/). Note that the 
demo is not intended to be a production system. If you intend to use RDF Playground
regularly (e.g., for a class), we would recommend to install and run it locally in a 
server you control.

## Installation and running
### Back end (mimir folder)
The backend is written in Kotlin using the Spring Boot framework; dependencies and 
configurations are done using Maven. The code also has [a fork](https://github.com/BastyZ/OWL-RL) of the (Python) [OWL-RL reasoner](https://github.com/RDFLib/OWL-RL) 
inside, so you have to create and environment for this code before executing the backend.

⚠ For this to work you should use Python 3.5+ and Pip

Go to `src/main/reasoner/owlrl` and create a virtualenv (we use _venv_) according to
[venv documentation](https://docs.python.org/3/library/venv.html) and install BastyZ/OWL-RL:
```shell script
# Create venv environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install BastyZ/OWL-RL on the current environment
python setup.py install
```

Then, having _maven_ installed, you go to `mimir/` directory where `pom.xml` is and 
write in your terminal:

``` sh
# install dependencies
mvn install
```

And you can run it with:

``` sh
# Activate venv before running SpringBoot
source src/main/reasoner/owlrl/venv/bin/activate

mvn spring-boot:run
```

### Front end (odin folder)
The frontend is written in Javascript + HTML using Vuetify framework and nodejs
13; having that and npm installed you can go to the `odin/` directory and write:

``` sh
# install dependencies
npm install
```

And you can run it with:
``` sh
# run for development
npm run-script serve

# create a production build
npm run-script build
```
This last command produces a production-ready bundle in the `dist/` directory,
see https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-build for more
information.

For more information on the serve command see 
https://cli.vuejs.org/guide/cli-service.html#vue-cli-service-serve.

### Docker
There is also the option to install the project using Docker and Docker Compose.

First you have to build the project containers running the following command in the folder where `docker-compose.yml` is:

```
docker-compose build
```
If you want to build the containers separately you may add the container's name, `odin` for frontend and `mimir` for backend, at the end of the last command, that is:
```
docker-compose build odin
docker-compose build mimir
```

Then, just run the containers running:
```
docker-compose up
```

For more information on Docker commands see the following links:
* https://docs.docker.com/engine/reference/commandline/cli/
* https://docs.docker.com/compose/reference/


## Configuration
For configurations on the backend and frontend see their respective README
files.

Copyright © 2020 Bastián Inostroza, Licensed under the Apache License, Version 2.0.
