/**
 *
 * @method inviteShopOwner
 * @summary Invites a new marketplace shop owner.
 * @param {Object} _ - unused
 * @param {Object} args - The input arguments
 * @param {Object} args.input - mutation input object
 * @param {String} args.input.clientMutationId - The mutation id
 * @param {Number} args.input.emailAddress - the new shop owner's e-mail address
 * @param {Object} context - an object containing the per-request state
 * @return {Promise<Object>} Returns an object with the clientMutationId and the result of the mutation
 */
export default async function loadOrders(_, { input }, context) {
  const { clientMutationId } = input;

  const mutationResult = await context.mutations.inviteShopOwner(context, input);

  return {
    clientMutationId,
    ...mutationResult
  };
}
