const db = require("../database");

const journeys = {
  getById: function (id, callback) {
    return db.query("select * from journeys where id=?", [id], callback);
  },

  getTotalPages: function (pageSize, callback) {
    db.query("select count(*) as total from journeys", function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        const totalJourneys = result[0].total;
        const totalPages = Math.ceil(totalJourneys / pageSize);
        callback(null, totalPages);
      }
    });
  },

  getAll: function (page, pageSize, callback) {
    const offset = (page - 1) * pageSize;

    db.query(
      "select * from journeys limit ? offset ?",
      [pageSize, offset],
      function (err, rows) {
        if (err) {
          callback(err, null);
        } else {
          const data = {
            journeys: rows,
          };

          callback(null, data);
        }
      }
    );
  },

  add: function (add_data, callback) {
    return db.query(
      "insert into journeys values(?,?,?,?,?,?)",
      [
        add_data.departure_id,
        add_data.departure_name,
        add_data.return_id,
        add_data.return_name,
        add_data.distance,
        add_data.duration,
      ],
      callback
    );
  },

  delete: function (id, callback) {
    return db.query("delete from stations where id=?", [id], callback);
  },

  update: function (id, update_data, callback) {
    return db.query(
      "update stations set departure_id=?,departure_name=?,return_id=?,return_name=?, distance=?,duration=? where id=?",
      [
        update_data.departure_id,
        update_data.departure_name,
        update_data.return_id,
        update_data.return_name,
        update_data.distance,
        update_data.duration,
        id,
      ],
      callback
    );
  },
};

module.exports = journeys;
