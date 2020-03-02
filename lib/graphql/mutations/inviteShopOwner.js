import _ from "lodash";
import Random from "@reactioncommerce/random";
import config from "../../utils/config.js";
import ensureMarketplaceShopCreatorGroup from "../../utils/ensureMarketplaceShopCreatorGroup.js";
import getCurrentUserName from "../../utils/getCurrentUserName.js";

const { REACTION_ADMIN_PUBLIC_ACCOUNT_REGISTRATION_URL } = config;

/**
 * @name ReactionMarketplace/inviteShopOwner
 * @memberof Mutations/ReactionMarketplace
 * @method
 * @summary Inserts dummy orders into the database
 * @param {Object} context - GraphQL execution context
 * @param {Object} input - Input arguments for the operation
 * @param {String} input.clientMutationId - The mutation id
 * @param {Number} input.emailAddress - the new shop owner's e-mail address
 * @returns {Boolean} whether the invite was sent or not
 */
export default async function inviteShopOwner(context, input) {
  const { collections, user: userFromContext } = context;
  const { Accounts, AccountInvites, Groups } = collections;
  const { emailAddress, name } = input;

  // Make sure the current user is super-admin
  await context.validatePermissions("reaction:legacy:shops", "create", { shopId: null });

  const lowercaseEmail = emailAddress.toLowerCase();

  // check to see if invited email has an account
  const invitedAccount = await Accounts.findOne({ "emails.address": lowercaseEmail }, { projection: { _id: 1 } });

  const groupId = await ensureMarketplaceShopCreatorGroup(context);

  if (invitedAccount) {
    // Set the account's permission group for this shop
    await context.mutations.addAccountToGroup(context, {
      accountId: invitedAccount._id,
      groupId
    });

    return Accounts.findOne({ _id: invitedAccount._id });
  }

  // Create an AccountInvites document. If a person eventually creates an account with this email address,
  // it will be automatically added to this group instead of the default group for this shop.
  await AccountInvites.updateOne({
    email: lowercaseEmail
  }, {
    $set: {
      groupId,
      invitedByUserId: userFromContext._id
    },
    $setOnInsert: {
      _id: Random.id()
    }
  }, {
    upsert: true
  });

  const primaryShop = await context.queries.primaryShop(context);
  const marketplaceShopCreatorGroup = await Groups.findOne({ _id: groupId });

  // Now send them an invitation email
  const dataForEmail = {
    contactEmail: _.get(primaryShop, "emails[0].address"),
    copyrightDate: new Date().getFullYear(),
    groupName: _.startCase(marketplaceShopCreatorGroup.name),
    legalName: _.get(primaryShop, "addressBook[0].company"),
    physicalAddress: {
      address: `${_.get(primaryShop, "addressBook[0].address1")} ${_.get(primaryShop, "addressBook[0].address2")}`,
      city: _.get(primaryShop, "addressBook[0].city"),
      region: _.get(primaryShop, "addressBook[0].region"),
      postal: _.get(primaryShop, "addressBook[0].postal")
    },
    shopName: primaryShop.name,
    currentUserName: getCurrentUserName(userFromContext),
    invitedUserName: name,
    url: REACTION_ADMIN_PUBLIC_ACCOUNT_REGISTRATION_URL
  };

  await context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop: primaryShop,
    templateName: "accounts/inviteNewShopMember",
    to: lowercaseEmail
  });

  return { wasInviteSent: true };
}
