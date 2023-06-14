const sql = require("./db.js");

// constructor
const Product = function (product) {
  this.name = product.name;
  this.uom = product.uom;
  this.pricePerUom = product.pricePerUom;
  this.cashRegisterNumber = product.cashRegisterNumber;
  this.isActive = product.isActive;
};

Product.create = (domain, newProduct, result) => {
  const query = `INSERT INTO ${domain} (${domain}_name, ${domain}_uom, ${domain}_pricePerUom, ${domain}_cashRegisterNumber, ${domain}_isActive) VALUES (?, ?, ?, ?, ?)`;
  sql.run(
    query,
    [
      newProduct.name,
      newProduct.uom,
      newProduct.pricePerUom,
      newProduct.cashRegisterNumber,
      newProduct.isActive,
    ],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, {
        oid: this.lastID,
        ...newProduct
      });
    }
  );
};

Product.findById = (domain, id, result) => {
  sql.get(`SELECT * FROM ${domain} WHERE oid = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res) {
      result(null, {
        oid: product[`${domain}_oid`],
        name: product[`${domain}_name`],
        uom: product[`${domain}_uom`],
        pricePerUom: product[`${domain}_pricePerUom`],
        cashRegisterNumber: product[`${domain}_cashRegisterNumber`],
        isActive: product[`${domain}_isActive`],
      });
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};

Product.getAll = (domain, result) => {
  const query = `SELECT * FROM ${domain}`;

  sql.all(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(
      null,
      res.map((product) => {
        return {
          oid: product[`${domain}_oid`],
          name: product[`${domain}_name`],
          uom: product[`${domain}_uom`],
          pricePerUom: product[`${domain}_pricePerUom`],
          cashRegisterNumber: product[`${domain}_cashRegisterNumber`],
          isActive: product[`${domain}_isActive`],
        };
      })
    );
  });
};

Product.updateById = (domain, id, product, result) => {
  const query = `UPDATE ${domain} SET ${domain}_name = ?, ${domain}_uom = ?, ${domain}_pricePerUom = ?, ${domain}_cashRegisterNumber = ?, ${domain}_isActive = ? WHERE ${domain}_oid = ?`;

  sql.run(
    query,
    [
      product.name,
      product.uom,
      product.pricePerUom,
      product.cashRegisterNumber,
      product.isActive,
      id,
    ],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (this.changes === 0) {
        // not found Product with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, {
        oid: id,
        ...product,
      });
    }
  );
};

Product.remove = (domain, id, result) => {
  sql.run(`DELETE FROM ${domain} WHERE ${domain}_oid = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    } else {
      result(
        null,
        true
        // res.map((p) => {
        //   return {
        //     oid: p[`${domain}_oid`],
        //     name: p[`${domain}_name`],
        //     uom: p[`${domain}_uom`],
        //     pricePerUom: p[`${domain}_pricePerUom`],
        //     cashRegisterNumber: p[`${domain}_cashRegisterNumber`],
        //     isActive: product[`${domain}_isActive`],
        //   };
        // })
      );
    }
  });
};

module.exports = Product;
