const sql = require("./db.js");

// constructor
const PasspartuColor = function (passpartuColor) {
  this.name = passpartuColor.name;
  this.isActive = passpartuColor.isActive;
  this.passpartu = passpartuColor.passpartu;
};

PasspartuColor.create = (newPasspartuColor, result) => {
  const query = `INSERT INTO passpartuColor (passpartuColor_oid, passpartuColor_name, passpartuColor_isActive, passpartu_passpartu_oid) VALUES (?, ?, ?, ?)`;

  sql.run(
    query,
    [
      newPasspartuColor.oid,
      newPasspartuColor.name,
      true,
      newPasspartuColor.passpartu.oid,
    ],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, {
        oid: this.lastID,
        ...newPasspartuColor.map((pc) => {
          return {
            name: pc.name,
            passpartu: newPasspartuColor.passpartu,
          };
        }),
      });
    }
  );
};

PasspartuColor.findById = (id, result) => {
  sql.get(
    `SELECT * FROM passpartuColor JOIN passpartu on passpartuColor.passpartu_passpartu_oid=passpartu.passpartu_oid WHERE passpartuColor_oid = ?`,
    [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res) {
        result(null, {
          oid: res.passpartuColor_oid,
          name: res.name,
          passpartu: {
            oid: res.passpartu_oid,
            name: res.passpartu_name,
            uom: res.passpartu_uom,
            pricePerUom: res.passpartu_pricePerUom,
            cashRegisterNumber: res.passpartu_cashRegisterNumber,
          },
        });
        return;
      }

      // not found PasspartuColor with the id
      result({ kind: "not_found" }, null);
    }
  );
};

PasspartuColor.getAll = (result) => {
  let query = `SELECT * FROM passpartuColor JOIN passpartu on passpartuColor.passpartu_passpartu_oid=passpartu.passpartu_oid`;

  sql.all(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(
      null,
      res.map((pc) => {
        return {
          oid: pc.passpartuColor_oid,
          name: pc.passpartuColor_name,
          isActive: pc.passpartucolor_isActive,
          passpartu: {
            oid: pc.passpartu_oid,
            name: pc.passpartu_name,
            uom: pc.passpartu_uom,
            pricePerUom: pc.passpartu_pricePerUom,
            cashRegisterNumber: pc.passpartu_cashRegisterNumber,
            isActive: pc.passpartu_isActive,
          },
        };
      })
    );
  });
};

PasspartuColor.updateById = (id, passpartuColor, result) => {
  sql.run(
    `UPDATE passpartuColor SET passpartuColor_name = ?, passpartu_passpartu_oid = ?, passpartucolor_isActive = ? WHERE passpartuColor_oid = ?`,
    [
      passpartuColor.name,
      passpartuColor.passpartu.oid,
      passpartuColor.isActive,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (this.changes === 0) {
        // not found PasspartuColor with the id
        result({ kind: "not_found" }, null);
        return;
      } else {
        result(null, {
          oid: id,
          ...passpartuColor,
        });
      }
    }
  );
};

PasspartuColor.remove = (id, result) => {
  sql.run(
    `DELETE FROM passpartuColor WHERE passpartuColor_oid = ?`,
    id,
    (err) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (this.changes === 0) {
        // not found PasspartuColor with the id
        result({ kind: "not_found" }, null);
        return;
      } else {
        result(null, true);
      }
    }
  );
};

module.exports = PasspartuColor;
