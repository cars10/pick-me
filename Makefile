dev:
	docker compose up -d

lint:
	docker compose run --rm app yarn lint

build:
	docker compose build