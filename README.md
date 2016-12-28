# gitnode

Search for GitHub users by the programming language they use in their public repos

## Example request

```
curl -X GET localhost:8000/users/go
```

Limit the results to 20

```
curl -X GET localhost:8000/users/go?limit=20
```
### Running the service

```
npm start
```

### Run tests

```
npm test
```

Optionally the Oauth token can be filled as well in the config files to avoid any rate limitations
