const sql = require("./db.js");

// constructor
const Frame = function (frame) {
  this.name = frame.name;
  this.uom = frame.uom;
  this.pricePerUom = frame.pricePerUom;
  this.cashRegisterNumber = frame.cashRegisterNumber;
  this.code = frame.code;
  this.frameWidthMM = frame.frameWidthMM;
  this.isActive = frame.isActive;
};

Frame.create = (newFrame, result) => {
  const query =
    "INSERT INTO frame (frame_name, frame_uom, frame_pricePerUom, frame_cashRegisterNumber, frame_code, frame_frameWidthMM, frame_isActive) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const params = [
    newFrame.name,
    newFrame.uom,
    newFrame.pricePerUom,
    newFrame.cashRegisterNumber,
    newFrame.code,
    newFrame.frameWidthMM,
    newFrame.isActive,
  ];
  sql.run(query, params, function (err) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { oid: this.lastID, ...newFrame });
  });
};

Frame.findById = (id, result) => {
  sql.get(`SELECT * FROM frame WHERE frame_oid = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res) {
      result(null, {
        oid: res.frame_oid,
        name: res.frame_name,
        uom: res.frame_uom,
        pricePerUom: res.frame_pricePerUom,
        cashRegisterNumber: res.frame_cashRegisterNumber,
        code: res.frame_code,
        frameWidthMM: res.frame_frameWidthMM,
        isActive: res.frame_isActive,
      });
      return;
    }

    // not found Frame with the id
    result({ kind: "not_found" }, null);
  });
};

Frame.getAll = (result) => {
  const query = "SELECT * FROM frame";

  sql.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      result(null, err);
      return;
    }

    const frames = rows.map((frame) => {
      return {
        oid: frame.frame_oid,
        name: frame.frame_name,
        uom: frame.frame_uom,
        pricePerUom: frame.frame_pricePerUom,
        cashRegisterNumber: frame.frame_cashRegisterNumber,
        code: frame.frame_code,
        frameWidthMM: frame.frame_frameWidthMM,
        isActive: frame.frame_isActive,
      };
    });

    result(null, frames);
  });
};

Frame.updateById = (id, frame, result) => {
  const query = `UPDATE frame SET frame_name = ?, frame_uom = ?, frame_pricePerUom = ?, frame_cashRegisterNumber = ?, frame_code = ?, frame_frameWidthMM = ?, frame_isActive = ? WHERE frame_oid = ?`;

  sql.run(
    query,
    [
      frame.name,
      frame.uom,
      frame.pricePerUom,
      frame.cashRegisterNumber,
      frame.code,
      frame.frameWidthMM,
      frame.isActive,
      id,
    ],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (this.changes === 0) {
        // not found Frame with the id
        result({ kind: "not_found" }, null);
        return;
      } else {
        result(null, {
          oid: id,
          ...frame,
        });
      }
    }
  );
};

Frame.remove = (id, result) => {
  const query = `DELETE FROM frame WHERE frame_oid = ?`;
  sql.run(query, id, (err) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (this.changes === 0) {
      // not found Frame with the id
      result({ kind: "not_found" }, null);
      return;
    } else {
      result(
        null,
        true
        // res.map((frame) => {
        //   return {
        //     name: frame.frame_name,
        //     uom: frame.frame_uom,
        //     pricePerUom: frame.frame_pricePerUom,
        //     cashRegisterNumber: frame.frame_cashRegisterNumber,
        //     code: frame.frame_code,
        //     frameWidthMM: frame.frame_frameWidthMM,
        //   };
        // })
      );
    }
  });
};

module.exports = Frame;
