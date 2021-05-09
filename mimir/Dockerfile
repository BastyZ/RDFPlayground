FROM maven:3.3-jdk-8-alpine

WORKDIR /app/mimir 
COPY --from=python:3.9 / /
COPY . /app/mimir
RUN pip install virtualenv
RUN cd src/main/reasoner/owlrl \
    && virtualenv venv \
    && /bin/bash -c "source venv/bin/activate" \
    && python setup.py install

COPY pom.xml /app/mimir
RUN mvn install

CMD /bin/bash -c "source src/main/reasoner/owlrl/venv/bin/activate" ; mvn spring-boot:run