const db = require('../index');

const fetchUsers = () => {
  return db.sequelize.query(
    "select * from tbl_user",
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  );
};

module.exports = {
  fetchUsers
};
