const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const fs = require("fs");
// import * as path from "path";

const docId = "1C9eP6HJNlWuj8yBRT_D-IpPQVpFnDPPkkKC54XGRFOg"; // Replace with your sheet's ID
const keyfilePath = "./controllers/service_account.json"; // Replace with the path to your JSON file

console.log(keyfilePath);

const cred = JSON.parse(fs.readFileSync(keyfilePath));

const serviceAccountAuth = new JWT({
  email: cred.client_email,
  key: cred.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getSheetData() {
  const doc = new GoogleSpreadsheet(docId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle["testing"]; // Assuming the first sheet
  const rows = await sheet.getRows();
  const columnNames = sheet.headerValues;
  //   await Promise.all(rows.map((row) => row.loadCells()));
  return { rows, columnNames };
}

async function createRow(data) {
  const doc = new GoogleSpreadsheet(docId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsById[0]; // Assuming the first sheet
  const row = await sheet.addRow(data);

  return row;
}

async function updateRow(id, data) {
  const doc = new GoogleSpreadsheet(docId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsById[0]; // Assuming the first sheet
  const row = await sheet.getRowById(id);
  await row.update(data);

  return row;
}

async function deleteRow(id) {
  const doc = new GoogleSpreadsheet(docId, serviceAccountAuth);
  await doc.loadInfo();

  const sheet = doc.sheetsById[0]; // Assuming the first sheet
  const row = await sheet.getRowById(id);
  await row.delete();
}

module.exports = {
  index: async (req, res) => {
    const data = await getSheetData();
    console.log("Data passed to EJS:", data); // Log data here
    res.render("index", { rows: data.rows, columnNames: data.columnNames });
  },

  create: (req, res) => {
    res.render("create");
  },

  store: async (req, res) => {
    const data = req.body;
    const row = await createRow(data);
    res.redirect("/");
  },

  edit: async (req, res) => {
    const id = req.params.id;
    const data = await getSheetData();
    let rows = data.rows;
    const row = rows.find((r) => r.get("_id_") == id);
    console.log(row);
    res.render("edit", { row });
    // // console.log(data.rows);
    // for (let row in data.rows) {
    //   console.log(row);
    //   if (row["_id_"] === id) {
    //     // console.log(row);
    //     res.render("edit", { row: row });
    //     break;
    //   }
    // }
    // res.render("Data not found");
  },

  update: async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const row = await updateRow(id, data);
    res.redirect("/");
  },

  destroy: async (req, res) => {
    const id = req.params.id;
    await deleteRow(id);
    res.redirect("/");
  },
};
