/**
 * @name ReactionMarketplace/shopOwnerByShopId
 * @method
 * @memberof Queries/ReactionMarketplace
 * @summary Returns the owner's account of a given shop
 * @param {Object} context - an object containing the per-request state
 * @param {Object} shopId - The shop ID for which to get the owner account
 * @returns {Promise<Object>} Account object Promise
 */
export default async function shopOwnerByShopId(context, shopId) {
  const { collections } = context;
  const { Groups } = collections;

  await context.validatePermissions("reaction:legacy:shops", "read", { shopId });

  const ownerGroupAndAccount = await Groups.aggregate([
    {
      $match: {
        shopId,
        slug: "owner"
      }
    }, {
      // Find the users who are assigned to the owner group for each shop
      $lookup: {
        from: "Accounts",
        localField: "_id",
        foreignField: "groups",
        as: "account"
      }
    }, {
      $unwind: {
        path: "$account"
      }
    }
  ]);

  return ownerGroupAndAccount.account;
}
