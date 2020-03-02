import getPaginatedResponseFromAggregate from "@reactioncommerce/api-utils/graphql/getPaginatedResponseFromAggregate.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";

/**
 * @name Query/shops
 * @method
 * @memberof ReactionMarketplace/Query
 * @summary Query for a list of shops
 * @param {Object} _ - unused
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Object} context - an object containing the per-request state
 * @param {Object} info Info about the GraphQL request
 * @returns {Promise<Object>} Products
 */
export default async function shops(_, args, context, info) {
  const {
    collection,
    pipeline
  } = await context.queries.shops(context, args);

  return getPaginatedResponseFromAggregate(collection, pipeline, args, {
    includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
    includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
    includeTotalCount: true
  });
}
