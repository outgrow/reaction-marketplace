/**
 * @name Shop/productCount
 * @method
 * @memberof Shop/GraphQL
 * @summary Returns the default navigation tree for a shop
 * @param {Object} shop The current shop
 * @param {Object} args - An object of all arguments that were sent by the previous resolver
 * @param {Object} context An object containing the per-request state
 * @returns {Promise<Object[]>} Promise that resolves to a navigation tree document
 */
export default function productCount(shop, args, context) {
  const { _id: shopId } = shop;

  if (!shopId) {
    return null;
  }

  return context.queries.publishedProductCountByShopId(context, shopId);
}
