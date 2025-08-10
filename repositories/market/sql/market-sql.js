class MarketSql {
    static getDetailedListSQL() {
        return `SELECT mdv.market_id               AS marketId,
                   mdv.market_active_status        AS active,
                   mdv.market_name                 AS marketName,
                   mdv.market_code                 AS marketCode,
                   mdv.market_level_id             AS marketLevelId,
                   mdv.market_level_name           AS marketLevelName,
                   mdv.market_level_rank           AS marketLevelRank,
                   mdv.market_id_hierarchy         AS marketIdHierarchyJson,
                   mdv.market_name_hierarchy       AS marketNameHierarchyJson,
                   mdv.market_code_hierarchy       AS marketCodeHierarchyJson,
                   mdv.market_level_id_hierarchy   AS marketLevelIdHierarchyJson,
                   mdv.market_level_name_hierarchy AS marketLevelNameHierarchyJson,
                   mdv.market_level_rank_hierarchy AS marketLevelRankHierarchyJson,
                   mdv.market_rank                 AS marketRank
            FROM market_details mdv
            WHERE mdv.market_id = ANY (ARRAY [:id_filter])`
    }
}

module.exports = MarketSql;