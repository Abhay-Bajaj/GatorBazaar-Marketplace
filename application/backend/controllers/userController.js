const { getUserById } = require('../models/userModel')

async function getUser(req, res) {
  try {

    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await getUserById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
module.exports = {
  getUser,
}