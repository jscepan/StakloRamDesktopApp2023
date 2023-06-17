const sql = require("./db.js");
const invoiceItemService = require("./invoice-item.model");

// constructor
const Invoice = function (invoice) {
  this.oid = invoice.oid;
  this.createDate = invoice.createDate;
  this.amount = invoice.amount;
  this.advancePayment = invoice.advancePayment;
  this.buyerName = invoice.buyerName;
  this.invoiceItems = invoice.invoiceItems;
  this.user = invoice.user;
};

Invoice.create = (newInvoice, result) => {
  const invoiceSql = `INSERT INTO invoice (invoice_createDate, invoice_amount, invoice_advancePayment, invoice_buyerName, user_user_oid)
  VALUES (?, ?, ?, ?, ?)`;

  const params = [
    newInvoice.createDate,
    newInvoice.amount,
    newInvoice.advancePayment,
    newInvoice.buyerName,
    newInvoice.user.oid,
  ];

  sql.run(invoiceSql, params, function (err) {
    if (err) {
      console.log("error in Invoice.create: ", err);
      result(err, null);
      return;
    }
    let promises = [];

    if (newInvoice.invoiceItems && newInvoice.invoiceItems.length > 0) {
      newInvoice.invoiceItems.forEach((item) => {
        promises.push(
          new Promise((resolve, reject) => {
            invoiceItemService.create(item, this.lastID, (resInvItem) => {
              item.oid = resInvItem.oid;
              resolve(item);
            });
          })
        );
      });
      Promise.all(promises).then(() => {
        result(null, { ...newInvoice, oid: this.lastID });
      });
    } else {
      result(null, { ...newInvoice, oid: this.lastID });
    }
  });
};

Invoice.findById = (id, result) => {
  sql.get(
    `SELECT * FROM invoice JOIN user on invoice.user_user_oid=user.user_oid WHERE invoice_oid = ?`,
    [id],
    (err, rows) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (rows) {
        invoiceItemService.getAll(id, (items) => {
          result(null, {
            oid: rows.invoice_oid,
            createDate: rows.invoice_createDate,
            amount: rows.invoice_amount,
            advancePayment: rows.invoice_advancePayment,
            buyerName: rows.invoice_buyerName,
            invoiceItems: items,
            user: {
              oid: rows.user_oid,
              name: rows.user_name,
              isActive: rows.user_isActive,
            },
          });
        });
      } else {
        // not found Invoice with the id
        result({ kind: "not_found" }, null);
      }
    }
  );
};

Invoice.getAll = (result) => {
  let query = "SELECT * FROM invoice";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(
      null,
      res.map((invoice) => {
        return {
          oid: invoice.invoice_oid,
          createDate: invoice.invoice_createDate,
          amount: invoice.invoice_amount,
          advancePayment: invoice.invoice_advancePayment,
          buyerName: invoice.invoice_buyerName,
        };
      })
    );
  });
};

Invoice.updateById = (invoice, result) => {
  sql.query(
    "UPDATE invoice SET invoice_createDate = ?, invoice_amount = ?, invoice_advancePayment = ?, invoice_buyerName = ?, user_user_oid = ? WHERE invoice_oid = ?",
    [
      new Date(invoice.createDate).toISOString().slice(0, 19).replace("T", " "),
      invoice.amount,
      invoice.advancePayment,
      invoice.buyerName,
      invoice.user.oid,
      invoice.oid,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Invoice with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, {
        ...invoice,
      });
    }
  );
};

Invoice.remove = (id, result) => {
  sql.query("DELETE FROM invoice WHERE invoice_oid = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Invoice with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(
      null,
      res.map((invoice) => {
        return {
          createDate: invoice.invoice_createDate,
          amount: invoice.invoice_amount,
          advancePayment: invoice.invoice_advancePayment,
          buyerName: invoice.invoice_buyerName,
        };
      })
    );
  });
};

module.exports = Invoice;
