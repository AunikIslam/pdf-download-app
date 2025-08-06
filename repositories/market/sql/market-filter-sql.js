class MarketFilterSql {
    static accessibleMarketSQL() {
        return {
            query: `SELECT unnest(t.m_list) AS marketId
             FROM (SELECT accessible_markets_of_user(:organization_id, :user_id, :has_market_level, :active_only) AS m_list) t`,
            replacements: {
                organization_id: null,
                user_id: null,
                has_market_level: null,
                active_only: null
            }
        }
    }
}

module.exports = MarketFilterSql;