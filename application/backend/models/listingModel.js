const { pool } = require('../database')

async function getListingById(id, userId = null) {
  const [rows] = await pool.query(
    `SELECT 
        l.listing_id,
        l.title,
        l.description,
        l.price,
        l.active,
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
          WHEN l.user_id = ? THEN TRUE
          ELSE FALSE
        END AS isOwner,
        l.user_id AS seller_id,
        u.username AS seller_username,
        u.fullname AS seller_fullname
    FROM listings l
    JOIN Categories c ON l.category = c.category_id
    JOIN registered_users u ON l.user_id = u.user_id
    LEFT JOIN user_favorites uf
      ON uf.listing_id = l.listing_id
      AND uf.user_id = ?
    WHERE l.listing_id = ?`,
    [userId, userId, id]
  )

  if (!rows.length) return null
  const listing = rows[0]

  if (!listing) return null

  const [imageRows] = await pool.execute(
    `
    SELECT image_url
    FROM listing_images
    WHERE listing_id = ?
    ORDER BY image_id ASC
    `,
    [id]
  )

  listing.images = imageRows.map(row => row.image_url)

  return listing
  return rows[0]
}

async function getListingsByUser(userId) {

  const [rows] = await pool.execute(
    `SELECT *
    FROM listings
    WHERE user_id = ?
    ORDER BY created_at DESC`,
    [userId]
  );

  return rows;

}
// what do i need to do? 
// insert into listings (user_id, title, desc, price, category)
// insert tag into tags
// insert image_url into listing_images with listing_id
async function createListing(userId, title, description, price, category, tag, imageUrls) {
  const [result] = await pool.execute(
    `
    INSERT INTO listings (user_id, title, description, price, category)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, title, description, price, category]
  )
  const listingId = result.insertId
  await pool.execute(
    `
    INSERT INTO Tags (tag_name)
    VALUES (?)
    `,
    [tag]
  )
  for (const imageUrl of imageUrls) {
    await pool.execute(
      `
      INSERT INTO listing_images (image_url, listing_id)
      VALUES (?, ?)
      `,
      [imageUrl, listingId]
    )
  }
  return listingId

}

async function getBoughtListings(userId) {
    const [rows] = await pool.execute(
        `
        SELECT
            l.listing_id,
            l.title,
            l.price,
            bl.purchase_date,

            (
                SELECT li.image_url
                FROM listing_images li
                WHERE li.listing_id = l.listing_id
                LIMIT 1
            ) AS image_url

        FROM bought_listings bl

        JOIN listings l
            ON bl.listing_id = l.listing_id

        WHERE bl.buyer_id = ?

        ORDER BY bl.purchase_date DESC
        `,
        [userId]
    )

    return rows
}

module.exports = {
  getListingById,
  getListingsByUser,
  createListing,
  getBoughtListings
}