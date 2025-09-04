class OrderListShareSql {
    static getOrderIdsSql() {
        return `SELECT o.id
                FROM secondary_orders o
                WHERE o.organization_id = :org_filter
                  AND o.order_date BETWEEN :from_date AND :to_date
                  AND o.market_id IN (SELECT unnest(ARRAY[:market_filter]))
                  AND ((:status_filter = 0 AND o.is_approved != false) OR
                       (:status_filter = 1 AND o.is_approved IS NULL) OR
                       (:status_filter = 2 AND o.is_approved = true) OR
                       (:status_filter = 3 AND o.is_approved = false))
                  AND (:retailer_filter = 0 OR o.customer_id = :retailer_filter)
                  AND (:db_filter = 0 OR o.distributor_id = :db_filter)`
    }

    static getItemInfoForTopSheetSql() {
        return `SELECT DISTINCT o.created_by                         AS userId
                          , o.market_id                          AS marketId
                          , o.distributor_id                     AS distributorId
                          , d.product_id                         AS productId
                          , sum(coalesce(d.unit, 0.0))           AS unit
                          , sum(coalesce(d.bonus_unit, 0.0))     AS bonus
                          , sum(coalesce(d.total_unit, 0.0))     AS totalUnit
                          , sum(coalesce(d.sub_total, 0.0))      AS subTotal
                          , sum(coalesce(d.discount_total, 0.0)) AS discountTotal
            FROM secondary_orders o
                     LEFT JOIN secondary_order_details d ON o.id = d.order_id
            WHERE o.id IN (SELECT unnest(ARRAY[:order_ids]))
            GROUP BY o.created_by, o.market_id, o.distributor_id, d.product_id`
    }

    static getInfoForTopSheetOfAfmSql() {
        return `SELECT    o.distributor_id                       AS distributorId
                        , d.product_id                           AS productId
                        , json_agg(o.market_id)                  AS marketId
                        , sum(coalesce(d.total_volume, 0.0))     AS totalVolume
                        , sum(coalesce(d.total_unit, 0.0))       AS totalUnit
                        , sum(coalesce(d.total_amount, 0.0))     AS totalAmount
                FROM secondary_orders o
                         LEFT JOIN secondary_order_details d ON o.id = d.order_id
                WHERE o.id IN (SELECT unnest(ARRAY[:order_ids]))
                GROUP BY o.distributor_id, d.product_id`
    }

    static getOrderDetailOfAfmSql() {
        return `SELECT DISTINCT o.id                            AS orderId
              , o.order_date                                    AS orderDate
              , o.created_by                                    AS userId
              , o.customer_id                                   AS retailerId
              , o.market_id                                     AS marketId
              , o.distributor_id                                AS distributorId
              , o.remarks                                       AS remarks
              , o.is_approved                                   AS isApproved
              , d.product_id                                    AS productId
              , coalesce(d.price - d.discount, 0.0)             AS etp
              , coalesce(d.unit, 0.0)                           AS pcs
              , coalesce(d.volume, 0.0)                         AS volume
              , coalesce((d.price-d.discount) * d.unit, 0.0)    AS total
                FROM secondary_orders o
                LEFT JOIN secondary_order_details d ON o.id = d.order_id
                WHERE o.id IN (SELECT unnest(ARRAY[:order_ids]))`
    }
}

module.exports = OrderListShareSql;