const { getUserById } = require('../models/userModel')

async function getUser(req, res) {
  try {

    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getLoggedUser(req, res) {
  try {

    if (!req.session.userId) {
      return res.status(401).json({
        error: "Not authenticated"
      });
    }

    const loggedUser = await getUserById( req.session.userId );

    const userInfo = {
      fullname: loggedUser.fullname,
      username: loggedUser.username,
      email: loggedUser.email,
      joinedDate: loggedUser.created_at,
      userRating: loggedUser.user_rating
    }
    
    res.json({userInfo});

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error"
    });
  }
}

module.exports = {
  getUser,
  getLoggedUser
}