import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name addShopIdToUser
 * @summary Adds shopId to account profile
 * @param {Object} context - GraphQL execution context
 * @param {Object} input - Input arguments for the operation
 * @param {Number} input.shopId - the shopId to assign
 * @param {Number} input.userId - the userId to assign it to
 * @returns {Boolean} whether the update was successful
 */
export default async function addShopIdToUser(context, input) {
  const { collections } = context;
  const { users } = collections;
  const { shopId, userId } = input;

  const { result } = await users.updateOne({
    _id: userId
  }, {
    $set: {
      "profile.preferences.reaction.activeShopId": shopId
    }
  });

  if (result.n === 0) {
    throw new ReactionError("not-found", "Account couldn't be updated, or doesn't exist");
  }

  return true;
}
