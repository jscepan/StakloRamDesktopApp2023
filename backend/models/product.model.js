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
  console.log("--------------------");
  sql.query(
    `INSERT INTO ${domain} SET ?`,
    {
      [`${domain}_name`]: newProduct.name,
      [`${domain}_uom`]: newProduct.uom,
      [`${domain}_pricePerUom`]: newProduct.pricePerUom,
      [`${domain}_cashRegisterNumber`]: newProduct.cashRegisterNumber,
      [`${domain}_isActive`]: true,
    },
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, {
        oid: res.insertId,
        ...newProduct,
      });
    }
  );
};

Product.findById = (domain, id, result) => {
  sql.query(`SELECT * FROM ${domain} WHERE oid = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
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
  console.log("--------------------");

  let query = `SELECT * FROM ${domain} where ${domain}_isActive=true`;

  sql.query(query, (err, res) => {
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
  sql.query(
    `UPDATE ${domain} SET ${domain}_name = ?, ${domain}_uom = ?, ${domain}_pricePerUom = ?, ${domain}_cashRegisterNumber = ?, ${domain}_isActive = ? WHERE ${domain}_oid = ?`,
    [
      product.name,
      product.uom,
      product.pricePerUom,
      product.cashRegisterNumber,
      product.isActive,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
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
  sql.query(`DELETE FROM ${domain} WHERE ${domain}_oid = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("res OBRISANO: ");
    console.log(res);
    result(
      null,
      res.map((p) => {
        return {
          oid: p[`${domain}_oid`],
          name: p[`${domain}_name`],
          uom: p[`${domain}_uom`],
          pricePerUom: p[`${domain}_pricePerUom`],
          cashRegisterNumber: p[`${domain}_cashRegisterNumber`],
          isActive: product[`${domain}_isActive`],
        };
      })
    );
  });
};

module.exports = Product;
