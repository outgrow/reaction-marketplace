# reaction-marketplace (beta)

[![npm (scoped)](https://img.shields.io/npm/v/@outgrowio/reaction-marketplace.svg)](https://www.npmjs.com/package/@outgrowio/reaction-marketplace)

A multi-vendor marketplace plugin for Reaction Commerce. Still in beta and is for now limited to sending e-mail invitations for vendors to sign-up and create their shops.

## How to use

First, install the package in your project's `reaction` (API) directory:

```bash
npm install --save-dev @outgrowio/reaction-marketplace
```

Then, register the plugin in your project's `reaction/plugins.json`, calling the function at the end of the file:

```json
{
  ...,
  "marketplace": "@outgrowio/reaction-marketplace/index.js"
}
```

## User interface

We recommend to use this plugin together with [`reaction-marketplace-ui`](https://github.com/outgrow/reaction-marketplace-ui) to have a user interface in your `reaction-admin` to invite new vendors and manage marketplace shops.

Of course, you're also free to build your own user interface and leverage this plugin's API the way you prefer.

## GraphQL API

Once the plugin is registered, you get access to the following GraphQL queries and mutations. For testing, call these from the GraphQL Playground at http://localhost:3000/graphql.

### Invite shop owner

```graphql
mutation inviteShopOwner($input: InviteShopOwnerInput!) {
    inviteShopOwner(input: $input) {
        emailAddress,
        name
    }
}
```

Call with the following variables:

```json
{
    "input": {
        "emailAddress": "john@doe.com",
        "name": "John Doe"
    }
}
```

### List all shops (paginated)

```graphql
query shops($shopIds: [ID], $first: ConnectionLimitInt, $last: ConnectionLimitInt, $offset: Int) {
    shops(shopIds: $shopIds, first: $first, last: $last, offset: $offset) {
        pageInfo {
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
        }
        nodes {
            _id
            createdAt
            name
            owner
            productCount
        }
    }
}
```

Call with an optional `shopIds` variable (returns all shops if no `shopIds` are passed):

```json
{
    "input": {
        "shopIds": ["kspBu62vAyXnnb2v6"]
    }
}
```

### Authentication

Don't forget to use an `Authorization` HTTP header to authenticate your API calls. Example:

```json
{
    "Authorization": "skwL_8jUOkmom7wW_se6_XgfSBtBrUBSR9UL-CUq74A.fwTZ8_G2QTMPf83O6jAOtYxyEU1TYV6spm8abPENutg"
}
```

You can get the value for the `Authorization` header in the `reaction-admin` UI (http://localhost:4080). By using your browser's network analyzer in the devtools, look for any recent `POST` call to `/graphql` or `/graphql-beta` and copy the value for `Authorization` in the request headers.

When developing a plugin inside of `reaction-admin`, your GraphQL calls should automatically be authentified by Apollo.

## Help

Need help integrating this plugin into your Reaction Commerce project? Simply looking for expert [Reaction Commerce developers](https://outgrow.io)? Want someone to train your team to use Reaction at its fullest?

Whether it is just a one-hour consultation to get you set up or helping your team ship a whole project from start to finish, you can't go wrong by reaching out to us:

* +1 (281) OUT-GROW
* contact@outgrow.io
* https://outgrow.io
