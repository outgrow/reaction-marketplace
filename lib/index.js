import mutations from "./graphql/mutations/index.js";
import queries from "./graphql/queries/index.js";
import resolvers from "./graphql/resolvers/index.js";
import schemas from "./graphql/schemas/index.js";
import marketplaceStartup from "./startup.js";

/**
 * @summary Registers the plugin.
 * @param {ReactionAPI} api The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(api) {
  await api.registerPlugin({
    label: "Marketplace",
    name: "reaction-marketplace",
    graphQL: {
      resolvers,
      schemas
    },
    mutations,
    queries,
    functionsByType: {
      startup: [marketplaceStartup]
    },
    i18n: {
      translations: [{
        i18n: "en",
        ns: "reaction-marketplace",
        translation: {
          "reaction-marketplace": {
            marketplaceSettings: {
              sidebarLabel: "Marketplace",
              table: {
                headers: {
                  id: "Database ID",
                  date: "Creation Date",
                  name: "Name",
                  owner: "Owner",
                  productCount: "Product Count"
                }
              }
            }
          }
        }
      }]
    }
  });
}
