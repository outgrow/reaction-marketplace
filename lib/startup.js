import addShopIdToUser from "./utils/addShopIdToUser.js";

/**
 * @summary Called on startup
 * @param {Object} context Startup context
 * @returns {undefined}
 */
export default function marketplaceStartup(context) {
  context.appEvents.on("afterShopCreate", async (event) => {
    const { createdBy: ownerUserId, shop } = event;

    await addShopIdToUser(context, {
      shopId: shop._id,
      userId: ownerUserId
    });
  });
}
