#! /bin/bash
docker run --network host -d -p 8080:8080 \
       -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:password@localhost:5432/main \
       -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
       -e HASURA_GRAPHQL_ADMIN_SECRET=keyboardcat \
       -e HASURA_GRAPHQL_AUTH_HOOK=http://localhost:3000/api/hasura \
       -e HASURA_GRAPHQL_AUTH_HOOK_MODE=GET \
       hasura/graphql-engine:v1.0.0-beta.8
