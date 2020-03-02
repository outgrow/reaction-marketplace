/**
 * @name ReactionMarketplace/shops
 * @method
 * @memberof Queries/ReactionMarketplace
 * @summary Query the Shops collection for a list of shops
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - Request input
 * @returns {Promise<Object>} Products object Promise
 */
export default async function shops(context) {
  const { collections } = context;
  const { Shops } = collections;

  await context.validatePermissions("reaction:legacy:shops", "create", { shopId: null });

  return {
    collection: Shops,
    pipeline: [
      {
        // Find Groups for each shopId
        $lookup: {
          from: "Groups",
          localField: "_id",
          foreignField: "shopId",
          as: "ownerGroup"
        }
      }, {
        // Turn the groups array into individual objects
        $unwind: {
          path: "$ownerGroup"
        }
      }, {
        // Only keep the object with the "owner" group (i.e. we now have the shop owner group for each shop)
        $match: {
          "ownerGroup.slug": "owner"
        }
      }, {
        // Find the users who are assigned to the owner group for each shop
        $lookup: {
          from: "Accounts",
          localField: "ownerGroup._id",
          foreignField: "groups",
          as: "account"
        }
      }, {
        // Keep only one owner user per object
        $unwind: {
          path: "$account"
        }
      }, {
        // Identify the owner's default e-mail address
        $match: {
          "account.emails.provides": "default"
        }
      }, {
        // Extract the e-mail address
        $unwind: {
          path: "$account.emails"
        }
      }, {
        // Find all the top-level, published products for each shop
        $lookup: {
          from: "Catalog",
          localField: "_id",
          foreignField: "shopId",
          as: "products"
        }
      }, {
        // Add our custom `owner` and `productCount` fields
        $addFields: {
          owner: "$account.emails.address",
          productCount: {
            $size: "$products"
          }
        }
      }, {
        // Remove the now-useless $lookup fields
        $project: {
          account: 0,
          products: 0,
          ownerGroup: 0
        }
      }
    ]
  };
}
