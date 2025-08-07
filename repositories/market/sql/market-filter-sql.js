class MarketFilterSql {
    static accessibleMarketSQL() {
        return `SELECT unnest(t.m_list) AS marketId
             FROM (SELECT accessible_markets_of_user(:organization_id, :user_id, :has_market_level, :active_only) AS m_list) t`
    }

    static filteredMarketSQL() {
        return `SELECT unnest(t.m_list) AS marketId
                  FROM (SELECT associated_market_list_including(:organization_id, TRUE, ARRAY [:market_id_filter],
                                                                :active_only, TRUE) AS m_list) t`
    }
}

module.exports = MarketFilterSql;