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

const InvoiceSearchModel = function (searchModel) {
  this.buyerName = searchModel.buyerName;
  this.dateFrom = searchModel.dateFrom;
  this.dateTo = searchModel.dateTo;
  this.ordering = searchModel.ordering;
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

Invoice.getAll = (searchModel, result) => {
  let whereClausule = "";
  let buyerNameQuery = "";
  if (searchModel.buyerName) {
    whereClausule += " WHERE ";
    buyerNameQuery = ` invoice_buyerName COLLATE NOCASE LIKE '%${searchModel.buyerName}%'`;
  }
  let dateFromQuery = "";
  if (searchModel.dateFrom) {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      dateFromQuery += " AND ";
    }
    dateFromQuery += ` invoice_createDate >= '${searchModel.dateFrom}'`;
  }
  let dateToQuery = "";
  if (searchModel.dateTo) {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      dateToQuery += " AND ";
    }
    dateToQuery += ` invoice_createDate <= '${searchModel.dateTo}'`;
  }
  let advancePaymentFromQuery = "";
  if (searchModel.advancePaymentFrom) {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      advancePaymentFromQuery += " AND ";
    }
    advancePaymentFromQuery +=
      " invoice_advancePayment >= " + searchModel.advancePaymentFrom;
  }
  let advancePaymentToQuery = "";
  if (searchModel.advancePaymentTo) {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      advancePaymentToQuery += " AND ";
    }
    advancePaymentToQuery +=
      " invoice_advancePayment <= " + searchModel.advancePaymentTo;
  }
  let amountQuery = "";

  if (searchModel.showPaidUnpaid === "PAID") {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      amountQuery += " AND ";
    }
    amountQuery += `invoice_advancePayment=invoice_amount`;
  } else if (searchModel.showPaidUnpaid === "UNPAID") {
    if (!whereClausule) {
      whereClausule += " WHERE ";
    } else {
      amountQuery += " AND ";
    }
    amountQuery += `invoice_advancePayment<invoice_amount`;
  } else {
    amountQuery = "";
  }
  const order = searchModel.ordering === "ASC" ? " ASC " : " DESC ";
  const orderingQuery = ` ORDER BY invoice_createDate ${order}, invoice_buyerName ${order}`;
  let paginationQuery = ` LIMIT ${searchModel.top} OFFSET ${searchModel.skip}`;
  const query =
    "SELECT * FROM invoice" +
    whereClausule +
    buyerNameQuery +
    dateFromQuery +
    dateToQuery +
    advancePaymentFromQuery +
    advancePaymentToQuery +
    amountQuery +
    orderingQuery +
    paginationQuery;

  const countQuery =
    "SELECT COUNT(*) FROM invoice" +
    whereClausule +
    buyerNameQuery +
    dateFromQuery +
    dateToQuery +
    advancePaymentFromQuery +
    advancePaymentToQuery +
    amountQuery;

  let promises = [];
  const getCount = new Promise((resolve, reject) => {
    sql.all(countQuery, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
        return;
      } else {
        response.totalCount = res[0]["COUNT(*)"];
        resolve();
      }
    });
  });

  promises.push(getCount);

  const response = { entities: [], nextID: 1, totalCount: 1 };
  const getResults = new Promise((resolve, reject) => {
    sql.all(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
        return;
      } else {
        response.entities = res.map((invoice) => {
          return {
            oid: invoice.invoice_oid,
            createDate: invoice.invoice_createDate,
            amount: invoice.invoice_amount,
            advancePayment: invoice.invoice_advancePayment,
            buyerName: invoice.invoice_buyerName,
          };
        });
        resolve();
      }
    });
  });

  promises.push(getResults);
  Promise.all(promises)
    .then(() => {
      result(null, response);
    })
    .catch((err) => {
      result(err, null);
    });
};

Invoice.updateById = (invoice, result) => {
  sql.run(
    "UPDATE invoice SET invoice_createDate = ?, invoice_amount = ?, invoice_advancePayment = ?, invoice_buyerName = ?, user_user_oid = ? WHERE invoice_oid = ?",
    [
      invoice.createDate,
      invoice.amount,
      invoice.advancePayment,
      invoice.buyerName,
      invoice.user.oid,
      invoice.oid,
    ],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (this.changes === 0) {
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
