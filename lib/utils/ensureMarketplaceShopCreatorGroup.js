import Random from "@reactioncommerce/random";

/**
 * @name ensureMarketplaceShopCreatorGroup
 * @summary Ensure marketplace shop creator group exists
 * @param {Object} context App context
 * @returns {String} id of marketplace shop creator group
 */
export default async function ensureMarketplaceShopCreatorGroup(context) {
  const { collections: { Groups } } = context;
  // get ID of `marketplace-shop-creator`
  let group = await Groups.findOne({ slug: "marketplace-shop-creator" }, { projection: { _id: 1 } });
  let groupId = (group && group._id) || null;
  // if system-manager group doesn't exist, create it now
  if (!group) {
    const ownerGroup = await Groups.findOne({ slug: "owner" }, { projection: { permissions: 1 } });

    groupId = Random.id();

    await Groups.insertOne({
      _id: groupId,
      name: "marketplace shop creator",
      slug: "marketplace-shop-creator",
      permissions: ownerGroup.permissions,
      shopId: null
    });
  }

  return groupId;
}
