const db = require('../index');

const updateProfile = (id, username, password, firstName, midName, lastName, sex, age, profileImage) => {
  return db.sequelize.query(
    "update tbl_user set username = :username, password = :password, first_name = :firstName, mid_name = :midName, last_name = :lastName, sex = :sex, age = :age, profile_image = :profileImage where id = :id",
    {
      replacements: {
        id,
        username,
        password,
        firstName,
        midName,
        lastName,
        sex,
        age,
        profileImage
      },
      type: db.sequelize.QueryTypes.UPDATE
    }
  );
};

module.exports = {
  updateProfile
};
