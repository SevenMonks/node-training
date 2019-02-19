const db = require('../index');

const fetchUsers = () => {
  return db.sequelize.query(
    "select * from tbl_user where is_deleted = false order by id desc",
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  );
};

const fetchUserById = id => {
  return db.sequelize.query(
    "select * from tbl_user where id = :id and is_deleted = false",
    {
      replacements: {
        id
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
};

const addUser = (username, password, firstName, midName, lastName, sex, age) => {
  return db.sequelize.query(
    "insert into tbl_user (username, password, first_name, mid_name, last_name, sex, age) values(:username, :password, :firstName, :midName, :lastName, :sex, :age)",
    {
      replacements: {
        username,
        password,
        firstName,
        midName,
        lastName,
        sex,
        age
      },
      type: db.sequelize.QueryTypes.INSERT
    }
  );
};

const deleteUser = id => {
  return db.sequelize.query(
    "update tbl_user set is_deleted = true, updated_on = now() where id = :id and is_deleted = false",
    {
      replacements: {
        id
      },
      type: db.sequelize.QueryTypes.UPDATE
    }
  );
};

const getLastInsertId = () => {
  return db.sequelize.query(
    "select currval(pg_get_serial_sequence('tbl_user', 'id'))",
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  );
};

module.exports = {
  fetchUsers,
  fetchUserById,
  addUser,
  deleteUser,
  getLastInsertId
};
