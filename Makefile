start:
	docker compose -f prod-docker-compose.yml up -d --build

stop:
	docker compose -f prod-docker-compose.yml down

update:
	make stop && git reset --hard && git pull origin dev && make start

destroy:
	docker compose -f prod-docker-compose.yml down -v && docker system prune -af
