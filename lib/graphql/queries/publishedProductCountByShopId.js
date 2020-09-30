/**
 * @name ReactionMarketplace/publishedProductCountByShopId
 * @method
 * @memberof Queries/ReactionMarketplace
 * @summary Returns the the number of published products of a given shop
 * @param {Object} context - an object containing the per-request state
 * @param {Object} shopId - The shop ID for which to get the product count
 * @returns {Promise<Object>} Account object Promise
 */
export default async function publishedProductCountByShopId(context, shopId) {
  const { collections } = context;
  const { Catalog } = collections;

  await context.validatePermissions("reaction:legacy:shops", "read", { shopId });

  const productCount = await Catalog.find({ shopId }).count();

  return productCount;
}
