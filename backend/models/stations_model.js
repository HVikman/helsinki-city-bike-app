const db = require("../database");

const stations = {
  getById: function (id, callback) {
    return db.query("select * from stations where id=?", [id], callback);
  },

  getTotalPages: function (pageSize, callback) {
    db.query("select count(*) as total from stations", function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        const totalStations = result[0].total;
        const totalPages = Math.ceil(totalStations / pageSize);
        callback(null, totalPages);
      }
    });
  },

  getAll: function (page, pageSize, callback) {
    const offset = (page - 1) * pageSize;

    db.query(
      "select * from stations limit ? offset ?",
      [pageSize, offset],
      function (err, rows) {
        if (err) {
          callback(err, null);
        } else {
          const data = {
            stations: rows,
          };

          callback(null, data);
        }
      }
    );
  },

  add: function (add_data, callback) {
    return db.query(
      "insert into stations values(?,?,?,?,?)",
      [add_data.id, add_data.name, add_data.address, add_data.x, add_data.y],
      callback
    );
  },

  delete: function (id, callback) {
    return db.query("delete from stations where id=?", [id], callback);
  },

  update: function (id, update_data, callback) {
    return db.query(
      "update stations set name=?,address=?,x=?,y=? where id=?",
      [update_data.name, update_data.address, update_data.x, update_data.y, id],
      callback
    );
  },
};

module.exports = stations;
