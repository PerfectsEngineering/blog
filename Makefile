build_docker_image:
	docker build -t pe_website .

run_docker_container:
	docker run -p 8000:8000 --rm pe_website

# This runs the container and attach it to 
# a proxynetwork. The proxynetwork is created by
# another project.
run_docker_container_in_proxy:
	docker run --net proxynetwork --name pe_blog --rm --env-file .env -d pe_website
