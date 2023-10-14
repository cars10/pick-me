dev:
	docker compose up -d

prod:
	docker compose run --rm app yarn build

lint:
	docker compose run --rm app yarn lint

build:
	docker compose build

logs:
	docker compose logs -f

down:
	docker compose down