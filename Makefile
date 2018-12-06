export PATH := ./node_modules/.bin:$(PATH)

lint:
ifneq ($(CIRCLECI),)
	eslint .
else
	eslint --cache --fix .
	prettier --write *.md
endif

test: lint

publish:
	npm version --no-git-tag-version ${CIRCLE_TAG}
	npm publish --access public
