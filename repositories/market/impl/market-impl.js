const marketSql = require('../sql/market-sql')
const sequelize = require("../../../utils/database-connection");

class MarketImpl {
    static async findAll(ids) {
        try {
            const query = marketSql.getDetailedListSQL();
            const replacements = {
                id_filter: ids
            }
            const result = await sequelize.query(query, {
                replacements: replacements,
                type: sequelize.QueryTypes.SELECT,
            });

        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = MarketImpl;