const pool = require('../database')

async function getListings({ keyword = '', category = '', sort = '' }) {
    let sql = 
        `SELECT 
            l.listing_id,
            l.title,
            l.description,
            l.price,
            c.category_name,
            (
                SELECT li.image_url
            FROM listing_images li
            WHERE li.listing_id = l.listing_id
            LIMIT 1
            ) AS image_url
        FROM listings l
        JOIN Categories c ON l.category = c.category_id
        WHERE l.active = 1`
    

    const params = []


    if (keyword) {
        sql += ' AND (l.title LIKE ? OR l.description LIKE ?)'
        params.push(`%${keyword}%`, `%${keyword}%`)
    }

    if (category) {
        sql += ' AND LOWER(c.category_name) = LOWER(?)'
        params.push(category.trim())
    }

    if (sort === 'price_low') {
        sql += ' ORDER BY l.price ASC'
    } else if (sort === 'price_high') {
        sql += ' ORDER BY l.price DESC'
    } else if (sort === 'newest') {
        sql += ' ORDER BY l.created_at DESC'
    }

    const [rows] = await pool.query(sql, params)
    return rows
}

module.exports = {
    getListings,
}