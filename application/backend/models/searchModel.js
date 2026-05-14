const { pool } = require('../database')

function normalizeCategories(category) {
  if (category === undefined || category === null || category === '') return []
  const raw = Array.isArray(category) ? category : [category]
  return raw
    .flatMap((c) => String(c).split(','))
    .map((c) => c.trim())
    .filter(Boolean)
}

async function getListings({
  keyword = '',
  category,
  sort = '',
  priceMin = '',
  priceMax = '',
  userId = null
}) {
  let sql = `
        SELECT 
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
            ) AS image_url,
            CASE
              WHEN uf.favorite_id IS NOT NULL THEN TRUE
              ELSE FALSE
            END AS isFavorited,
            CASE
              WHEN l.user_id = ${userId} THEN TRUE
              ELSE FALSE
            END AS isOwner
        FROM listings l
        JOIN Categories c ON l.category = c.category_id
        LEFT JOIN user_favorites uf
          ON uf.listing_id = l.listing_id
          AND uf.user_id = ${userId}
        WHERE l.active = 1`

  const params = []

  const kw = typeof keyword === 'string' ? keyword.trim() : ''
  if (kw) {
    sql += ' AND (l.title LIKE ? OR l.description LIKE ?)'
    params.push(`%${kw}%`, `%${kw}%`)
  }

  const categories = normalizeCategories(category)
  if (categories.length > 0) {
    const placeholders = categories.map(() => '?').join(', ')
    sql += ` AND LOWER(TRIM(c.category_name)) IN (${placeholders})`
    params.push(...categories.map((c) => c.toLowerCase()))
  }

  if (priceMin !== '' && priceMin !== undefined && priceMin !== null) {
    const n = Number(priceMin)
    if (!Number.isNaN(n)) {
      sql += ' AND l.price >= ?'
      params.push(n)
    }
  }
  if (priceMax !== '' && priceMax !== undefined && priceMax !== null) {
    const n = Number(priceMax)
    if (!Number.isNaN(n)) {
      sql += ' AND l.price <= ?'
      params.push(n)
    }
  }

  if (sort === 'price_low') {
    sql += ' ORDER BY l.price ASC'
  } else if (sort === 'price_high') {
    sql += ' ORDER BY l.price DESC'
  } else if (sort === 'newest') {
    sql += ' ORDER BY l.created_at DESC'
  } else {
    sql += ' ORDER BY l.created_at DESC'
  }

  const [rows] = await pool.query(sql, params)
  return rows
}

module.exports = {
  getListings,
}
