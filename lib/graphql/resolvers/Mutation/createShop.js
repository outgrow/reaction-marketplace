import Logger from "@reactioncommerce/logger";

/**
 * @name Mutation/createShop
 * @method
 * @memberof Shop/GraphQL
 * @summary overridden resolver for the createShop GraphQL mutation
 * @param {Object} _ - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} [args.input.currencyCode] Currency in which all money values should be assumed to be. Default "USD"
 * @param {String} [args.input.defaultLanguage] Default language for translation and localization. Default "en"
 * @param {String} [args.input.defaultTimezone] Primary timezone. Default "US/Pacific"
 * @param {String} args.input.name A unique name for the shop
 * @param {String} [args.input.type] The shop type. Default is "primary", but there may be only one primary shop.
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} CreateShopPayload
 */
export default async function createShop(_, { input }, context) {
  const { collections } = context;
  const { Shops } = collections;
  const { clientMutationId = null, ...mutationInput } = input;

  Logger.info("Override taking over for resolver createShop");

  // Check if there's already a primary shop
  const primaryShop = await Shops.findOne({ type: "primary" });

  // If there is already one, we assume that every other shop created is a merchant one
  if (primaryShop !== undefined) {
    Logger.info("Primary shop already exists. Forcing type merchant.");
    mutationInput.type = "merchant";
  }

  const shop = await context.mutations.createShop(context, { ...mutationInput });

  return { shop, clientMutationId };
}
