const sql = require("./db.js");

// constructor
const InvoiceItem = function (invoiceItem) {
  this.oid = invoiceItem.oid;
  this.title = invoiceItem.title;
  this.serviceType = invoiceItem.serviceType;
  this.amount = invoiceItem.amount;
  this.dimensionsWidth = invoiceItem.dimensionsWidth;
  this.dimensionsHeight = invoiceItem.dimensionsHeight;
  this.dimensionsUom = invoiceItem.dimensionsUom;
  this.dimensionsOutterWidth = invoiceItem.dimensionsOutterWidth;
  this.dimensionsOutterHeight = invoiceItem.dimensionsOutterHeight;
  this.selectedFrames = invoiceItem.selectedFrames;
  this.glass = invoiceItem.glass;
  this.mirror = invoiceItem.mirror;
  this.faceting = invoiceItem.faceting;
  this.sanding = invoiceItem.sanding;
  this.passpartuWidth = invoiceItem.passpartuWidth;
  this.passpartuWidthUom = invoiceItem.passpartuWidthUom;
  this.passpartuColor = invoiceItem.passpartuColor;
};

InvoiceItem.create = (newInvoiceItem, invoiceOid, result) => {
  const params = [
    newInvoiceItem.title,
    newInvoiceItem.serviceType,
    newInvoiceItem.amount,
    newInvoiceItem.dimensionsWidth,
    newInvoiceItem.dimensionsHeight,
    newInvoiceItem.dimensionsUom,
    newInvoiceItem.dimensionsOutterWidth,
    newInvoiceItem.dimensionsOutterHeight,
    invoiceOid,
    newInvoiceItem.glass ? newInvoiceItem.glass.oid : null,
    newInvoiceItem.mirror ? newInvoiceItem.mirror.oid : null,
    newInvoiceItem.faceting ? newInvoiceItem.faceting.oid : null,
    newInvoiceItem.sanding ? newInvoiceItem.sanding.oid : null,
    newInvoiceItem.passpartuWidth,
    newInvoiceItem.passpartuWidthUom,
    newInvoiceItem.passpartuColor ? newInvoiceItem.passpartuColor.oid : null,
  ];
  sql.run(
    "INSERT INTO invoiceItem (invoiceitem_title,invoiceitem_serviceType,invoiceitem_amount,invoiceitem_dimensionsWidth,invoiceitem_dimensionsHeight,invoiceitem_dimensionsUom,invoiceitem_outterWidth,invoiceitem_outterHeight,invoice_invoice_oid,glass_glass_oid,mirror_mirror_oid,faceting_faceting_oid,sanding_sanding_oid,invoiceitem_passpartuWidth,invoiceitem_passpartuWidthUom,passpartucolor_passpartuColor_oid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    params,
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (
        newInvoiceItem.selectedFrames &&
        newInvoiceItem.selectedFrames.length > 0
      ) {
        function resolvePromisesSequentially(promises, index) {
          if (index === promises.length) {
            // Svi promisi su razrešeni, izvršavamo željenu logiku
            result(null, { ...newInvoiceItem, oid: this.lastID });
            return;
          }

          promises[index]()
            .then(() => {
              resolvePromisesSequentially(promises, index + 1);
            })
            .catch((err) => {
              result(err, null);
            });
        }

        let promises = [];
        newInvoiceItem.selectedFrames.forEach((f) => {
          const frameQuery =
            "INSERT INTO invoiceitem_has_frame (invoiceItem_invoiceItem_oid, frame_frame_oid, colorCode) VALUES (?,?,?)";
          promises.push(
            () =>
              new Promise((resolve, reject) => {
                const frameParams = [this.lastID, f.frame.oid, f.colorCode];
                sql.run(frameQuery, frameParams, (err) => {
                  if (err) {
                    console.log("error invoiceitem_has_frame: ", err);
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              })
          );
        });

        // Razrešavamo promisi redom
        resolvePromisesSequentially(promises, 0);
      } else {
        result({ ...newInvoiceItem, oid: this.lastID });
      }
    }
  );
};

InvoiceItem.findById = (id, result) => {
  sql.query(
    `SELECT * FROM invoiceItem WHERE invoiceItem_oid = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(
          null,
          res.map((invoiceItem) => {
            return {
              oid: invoiceItem.invoiceItem_oid,
              createDate: invoiceItem.invoiceItem_createDate,
              amount: invoiceItem.invoiceItem_amount,
              advancePayment: invoiceItem.invoiceItem_advancePayment,
              buyerName: invoiceItem.invoiceItem_buyerName,
            };
          })[0]
        );
        return;
      }

      // not found InvoiceItem with the id
      result({ kind: "not_found" }, null);
    }
  );
};

InvoiceItem.getAll = (invoiceOid, result) => {
  sql.all(
    `SELECT * FROM invoiceitem
    LEFT JOIN glass on invoiceitem.glass_glass_oid=glass.glass_oid
    LEFT JOIN mirror on invoiceitem.mirror_mirror_oid=mirror.mirror_oid
    LEFT JOIN faceting on invoiceitem.faceting_faceting_oid=faceting.faceting_oid
    LEFT JOIN sanding on invoiceitem.sanding_sanding_oid=sanding.sanding_oid
    LEFT JOIN passpartucolor on invoiceitem.passpartucolor_passpartuColor_oid=passpartucolor.passpartuColor_oid
    LEFT JOIN passpartu on passpartucolor.passpartu_passpartu_oid=passpartu.passpartu_oid
    WHERE invoice_invoice_oid=?`,
    [invoiceOid],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      let ii = res.map((i) => {
        return {
          oid: i.invoiceitem_oid,
          title: i.invoiceitem_title,
          serviceType: i.invoiceitem_serviceType,
          amount: i.invoiceitem_amount,
          dimensionsWidth: i.invoiceitem_dimensionsWidth,
          dimensionsHeight: i.invoiceitem_dimensionsHeight,
          dimensionsUom: i.invoiceitem_dimensionsUom,
          dimensionsOutterWidth: i.invoiceitem_outterWidth,
          dimensionsOutterHeight: i.invoiceitem_outterHeight,
          selectedFrames: [],
          passpartuWidth: i.invoiceitem_passpartuWidth,
          passpartuWidthUom: i.invoiceitem_passpartuWidthUom,
          passpartuColor: i.passpartucolor_passpartuColor_oid
            ? {
                oid: i.passpartuColor_oid,
                name: i.passpartuColor_name,
                passpartu: {
                  oid: i.passpartu_oid,
                  name: i.passpartu_name,
                  uom: i.passpartu_uom,
                  pricePerUom: i.passpartu_pricePerUom,
                  cashRegisterNumber: i.passpartu_cashRegisterNumber,
                },
              }
            : null,
          glass: i.glass_oid
            ? {
                oid: i.glass_oid,
                name: i.glass_name,
                uom: i.glass_uom,
                pricePerUom: i.glass_pricePerUom,
                cashRegisterNumber: i.glass_cashRegisterNumber,
              }
            : null,
          mirror: i.mirror_oid
            ? {
                oid: i.mirror_oid,
                name: i.mirror_name,
                uom: i.mirror_uom,
                pricePerUom: i.mirror_pricePerUom,
                cashRegisterNumber: i.mirror_cashRegisterNumber,
              }
            : null,
          faceting: i.faceting_oid
            ? {
                oid: i.faceting_oid,
                name: i.faceting_name,
                uom: i.faceting_uom,
                pricePerUom: i.faceting_pricePerUom,
                cashRegisterNumber: i.faceting_cashRegisterNumber,
              }
            : null,
          sanding: i.sanding_oid
            ? {
                oid: i.sanding_oid,
                name: i.sanding_name,
                uom: i.sanding_uom,
                pricePerUom: i.sanding_pricePerUom,
                cashRegisterNumber: i.sanding_cashRegisterNumber,
              }
            : null,
        };
      });
      if (ii.length) {
        let condition = "";
        const par = [];
        for (i = 0; i < ii.length; i++) {
          // i === 0
          //   ?
          par.push(ii[i].oid);
          // :
          if (i > 0)
            condition +=
              " OR invoiceitem_has_frame.invoiceItem_invoiceItem_oid=?";
        }
        const query =
          `SELECT * FROM invoiceitem_has_frame JOIN frame on invoiceitem_has_frame.frame_frame_oid=frame.frame_oid WHERE invoiceitem_has_frame.invoiceItem_invoiceItem_oid=?` +
          condition;
        sql.all(query, par, (errFrame, resFrame) => {
          ii.forEach((item) => {
            resFrame.forEach((frame) => {
              if (item.oid === frame.invoiceItem_invoiceItem_oid) {
                item.selectedFrames.push({
                  frame: {
                    oid: frame.frame_frame_oid,
                    name: frame.frame_name,
                    uom: frame.frame_uom,
                    pricePerUom: frame.frame_pricePerUom,
                    cashRegisterNumber: frame.frame_cashRegisterNumber,
                    code: frame.frame_code,
                    frameWidthMM: frame.frame_frameWidthMM,
                  },
                  colorCode: frame.colorCode,
                });
              }
            });
          });
          result(ii);
        });
      } else {
        result(ii);
      }
    }
  );
};

InvoiceItem.updateById = (id, invoiceItem, result) => {
  sql.query(
    "UPDATE invoiceItem SET invoiceItem_createDate = ?, invoiceItem_amount = ?, invoiceItem_advancePayment = ?, invoiceItem_buyerName = ? WHERE invoiceItem_oid = ?",
    [
      new Date(newInvoiceItem.createDate)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      ,
      invoiceItem.amount,
      invoiceItem.advancePayment,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found InvoiceItem with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, {
        oid: id,
        ...invoiceItem,
      });
    }
  );
};

InvoiceItem.remove = (id, result) => {
  sql.query(
    "DELETE FROM invoiceItem WHERE invoiceItem_oid = ?",
    id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found InvoiceItem with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(
        null,
        res.map((invoiceItem) => {
          return {
            createDate: invoiceItem.invoiceItem_createDate,
            amount: invoiceItem.invoiceItem_amount,
            advancePayment: invoiceItem.invoiceItem_advancePayment,
            buyerName: invoiceItem.invoiceItem_buyerName,
          };
        })
      );
    }
  );
};

module.exports = InvoiceItem;
