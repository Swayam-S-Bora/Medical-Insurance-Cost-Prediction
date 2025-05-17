FROM python:3.13.3

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r /code/requirements.txt

COPY ./app /code/app

EXPOSE 8000

CMD sh -c "echo 'App running at http://localhost:8000' && uvicorn app.server:app --host 0.0.0.0 --port 8000"
