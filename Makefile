.PHONY: setup

setup:
	yarn install
	yarn build
	npm link
